// Get elements
const signupBtn = document.querySelector(".signup");
const loginBtn = document.querySelector(".login");
const slider = document.querySelector(".slider");
const formSection = document.querySelector(".form-section");

// Switch animations
signupBtn.addEventListener("click", () => {
  slider.classList.add("moveslider");
  formSection.classList.add("form-section-move");
});

loginBtn.addEventListener("click", () => {
  slider.classList.remove("moveslider");
  formSection.classList.remove("form-section-move");
});

// Signup form validation and save
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirm = document.getElementById("signupConfirm").value.trim();

  if (!name || !email || !password || !confirm) {
    alert("Please fill all fields!");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  // Save user data to localStorage
  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);

  alert("Signup successful! Please login now.");
  // Switch to login screen
  slider.classList.remove("moveslider");
  formSection.classList.remove("form-section-move");
});

// Login validation
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const savedEmail = localStorage.getItem("userEmail");
  const savedPassword = localStorage.getItem("userPassword");

  if (email === savedEmail && password === savedPassword) {
    alert("Login successful!");
    window.location.href = window.APP_ROUTES?.dashboard || "/dashboard"; // redirect after login
  } else {
    alert("Invalid email or password!");
  }
});
