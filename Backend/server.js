const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Создаём приложение Express
const app = express();

// Создаём Prisma client для работы с БД
const prisma = new PrismaClient();

// Порт сервера
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// -------------------------------
// ПРОВЕРКА СЕРВЕРА
// -------------------------------
app.get("/", (req, res) => {
  res.send("Backend is running");
});


// -------------------------------
// РЕГИСТРАЦИЯ ЧЕРЕЗ БАЗУ ДАННЫХ
// -------------------------------
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверяем, заполнил ли пользователь поля
    if (!username || !password) {
      return res.status(400).json({
        message: "Заполните все поля"
      });
    }

    // Ищем пользователя в БД по username
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    // Если пользователь уже есть — возвращаем ошибку
    if (existingUser) {
      return res.status(400).json({
        message: "Пользователь уже существует"
      });
    }

    // Создаём нового пользователя в БД
    await prisma.user.create({
      data: {
        username,
        password
      }
    });

    res.json({
      message: "Регистрация успешна"
    });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({
      message: "Ошибка сервера при регистрации"
    });
  }
});

// -------------------------------
// ЛОГИН ЧЕРЕЗ БАЗУ ДАННЫХ
// -------------------------------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ищем пользователя с таким username и password
    const user = await prisma.user.findFirst({
      where: {
        username,
        password
      }
    });

    // Если пользователь не найден — ошибка
    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль"
      });
    }

    res.json({
      message: "Успешный вход"
    });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({
      message: "Ошибка сервера при входе"
    });
  }
});


// -------------------------------
// ПОЛУЧИТЬ ТЕСТОВОЕ ПРОИЗВЕДЕНИЕ
// -------------------------------
app.get("/api/work/random", async (req, res) => {
  try {
    const works = await prisma.work.findMany();

    if (works.length === 0) {
      return res.status(404).json({
        message: "В базе пока нет произведений"
      });
    }

    const randomIndex = Math.floor(Math.random() * works.length);
    const randomWork = works[randomIndex];

    res.json(randomWork);
  } catch (error) {
    console.error("Ошибка при получении произведения:", error);
    res.status(500).json({
      message: "Ошибка сервера при получении произведения"
    });
  }
});


// -------------------------------
// Время берём из TimeAPI.
// -------------------------------


app.get("/api/time", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Moscow"
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        message: "Не удалось получить время с внешнего сервиса"
      });
    }

    res.json({
      hour: data.hour,
      minute: data.minute
    });
  } catch (error) {
    console.error("Ошибка при получении времени:", error);
    res.status(500).json({
      message: "Ошибка сервера при получении времени"
    });
  }
});

// -------------------------------
// ЗАПУСК СЕРВЕРА
// -------------------------------
app.listen(PORT, () => {
  console.log(`gazz on http://localhost:${PORT}`);
});