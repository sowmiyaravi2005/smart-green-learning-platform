import os
from uuid import uuid4

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session
from google import genai


load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", os.getenv("SECRET_KEY", str(uuid4())))

MODEL_CANDIDATES = (
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
)


def get_gemini_client():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured.")
    return genai.Client(api_key=api_key)


def generate_with_fallback(prompt):
    client = get_gemini_client()
    last_error = None

    for model_name in MODEL_CANDIDATES:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return response.text, model_name
        except Exception as err:
            last_error = err

    raise last_error or RuntimeError("No Gemini model response.")


def get_chat_messages():
    if "messages" not in session:
        session["messages"] = []
    return session["messages"]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/course")
def course():
    return render_template("course.html")


@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        user_message = (data.get("message") or "").strip()

        if not user_message:
            return jsonify({"error": "Please enter a message."}), 400

        messages = get_chat_messages()
        messages.append({"role": "user", "content": user_message})

        try:
            reply, model_name = generate_with_fallback(user_message)
        except Exception as err:
            messages.pop()
            session["messages"] = messages
            return jsonify({"error": f"Gemini error: {err}"}), 500

        messages.append({"role": "assistant", "content": reply})
        session["messages"] = messages
        session["last_model_used"] = model_name

        return jsonify({"reply": reply, "model": model_name})

    if request.args.get("reset") == "1":
        session.pop("messages", None)
        session.pop("last_model_used", None)
        session.pop("course_title", None)

    course_title = (request.args.get("course") or "").strip()
    messages = get_chat_messages()

    if course_title and session.get("course_title") != course_title:
        session["course_title"] = course_title
        try:
            reply, model_name = generate_with_fallback(
                f"Start teaching me {course_title} in an interactive way."
            )
            messages.append({"role": "assistant", "content": reply})
            session["messages"] = messages
            session["last_model_used"] = model_name
        except Exception as err:
            session["chat_error"] = f"Gemini error: {err}"

    chat_error = session.pop("chat_error", None)
    return render_template(
        "chat.html",
        messages=messages,
        course_title=course_title or session.get("course_title"),
        model_name=session.get("last_model_used"),
        chat_error=chat_error,
    )


if __name__ == "__main__":
    app.run(debug=True)
