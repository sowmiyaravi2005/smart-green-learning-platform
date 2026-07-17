# Smart Green Learning Platform

The Smart Green Learning Platform is a Flask-based e-learning app for sustainability and green skills education. It includes login/signup UI, a course dashboard, enrolled-course tracking in browser storage, and a Gemini AI chatbot.

## Features

- Login and signup page at `/`
- Dashboard at `/dashboard`
- Course route at `/course`
- Gemini AI chatbot at `/chat`
- Static frontend assets served from Flask's `static` folder
- Render-ready deployment config

## Project Structure

```text
Smart-Green-Learning-Platform/
|-- app.py
|-- main.py
|-- requirements.txt
|-- render.yaml
|-- Procfile
|-- README.md
|-- templates/
|   |-- index.html
|   |-- dashboard.html
|   |-- course.html
|   `-- chat.html
`-- static/
    |-- style.css
    |-- index.js
    |-- dashboard.css
    |-- dashboard.js
    |-- chat.css
    `-- chat.js
```

## Local Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000/`. The login page loads first.

## Environment Variables

Create a `.env` file locally or set these in Render:

```text
GOOGLE_API_KEY=your_gemini_api_key
FLASK_SECRET_KEY=your_secret_key
```

## Render Deployment

This repository includes `render.yaml` and `Procfile`.

Render uses:

```bash
pip install -r requirements.txt
gunicorn app:app
```

After deployment, the root URL opens the login page first.
