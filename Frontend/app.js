const authScreen = document.getElementById("authScreen");
const successScreen = document.getElementById("successScreen");
const mainScreen = document.getElementById("mainScreen");

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const authForm = document.getElementById("authForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

const logoutButton = document.getElementById("logoutButton");
const bookButton = document.getElementById("bookButton");
const bookCircle = document.querySelector(".header-center");
const bookText = document.getElementById("bookText");
const timeDisplay = document.getElementById("timeDisplay");
const submitButton = document.getElementById("submitButton");

const API_BASE_URL = "https://books-project-backend.onrender.com";

let currentMode = "login";
let isAuthorized = false;

async function updateTime() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/time`);
    const data = await response.json();

    if (!response.ok) {
      timeDisplay.textContent = "--:--";
      return;
    }

    const hours = String(data.hour).padStart(2, "0");
    const minutes = String(data.minute).padStart(2, "0");

    timeDisplay.textContent = `${hours}:${minutes}`;
  } catch (error) {
    console.error("Ошибка при получении времени:", error);
    timeDisplay.textContent = "--:--";
  }
}

function showScreen(screen) {
  authScreen.classList.add("hidden");
  successScreen.classList.add("hidden");
  mainScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

function resetMainScreen() {
  bookCircle.classList.remove("active");
  bookText.classList.add("hidden");
  bookText.textContent = "";
}

function clearForm() {
  usernameInput.value = "";
  passwordInput.value = "";
}

function showError(message) {
  errorMessage.textContent = message;
}

function setActiveTab(mode) {
  currentMode = mode;
  errorMessage.textContent = "";

  if (mode === "login") {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    submitButton.textContent = "Log in";
  } else {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    submitButton.textContent = "Sign up";
  }
}

function handleSuccessAuth() {
  isAuthorized = true;
  errorMessage.textContent = "";
  clearForm();
  resetMainScreen();
  showScreen(successScreen);

  setTimeout(() => {
    showScreen(mainScreen);
  }, 2000);
}

loginTab.addEventListener("click", () => {
  setActiveTab("login");
});

signupTab.addEventListener("click", () => {
  setActiveTab("signup");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showError("Заполните все поля!");
    return;
  }

  if (username.length < 3) {
    showError("Имя должно быть не короче 3 символов!");
    return;
  }

  if (password.length < 4) {
    showError("Пароль должен быть не короче 4 символов!");
    return;
  }

  const url =
    currentMode === "signup"
      ? `${API_BASE_URL}/api/auth/register`
      : `${API_BASE_URL}/api/auth/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message);
      return;
    }

    handleSuccessAuth();
  } catch (error) {
    showError("Сервер недоступен или произошла ошибка");
    console.error(error);
  }
});

bookButton.addEventListener("click", async () => {
  if (!isAuthorized) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/work/random`);
    const data = await response.json();

    if (!response.ok) {
      bookCircle.classList.add("active");
      bookText.classList.remove("hidden");
      bookText.textContent = data.message || "Ошибка при получении произведения";
      return;
    }

    bookCircle.classList.add("active");
    bookText.classList.remove("hidden");
    bookText.textContent = `${data.title}\n\n${data.summary}`;
  } catch (error) {
    console.error("Ошибка:", error);
    bookCircle.classList.add("active");
    bookText.classList.remove("hidden");
    bookText.textContent = "Сервер недоступен или произошла ошибка";
  }
});

logoutButton.addEventListener("click", () => {
  isAuthorized = false;
  errorMessage.textContent = "";
  clearForm();
  resetMainScreen();
  setActiveTab("login");
  showScreen(authScreen);
});

updateTime();
setInterval(updateTime, 60000);
setActiveTab("login");
showScreen(authScreen);