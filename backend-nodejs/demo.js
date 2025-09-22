import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { LocalStorage } from "node-localstorage";
import bodyParser from "body-parser";


dotenv.config();

const app = express();
app.use(express.json());

const SECRET_KEY = "mysecretkey"; // In real project -> .env file

// Dummy user database
const users = [];
const localStorage = new LocalStorage("./scratch");
let tokenKey = "";
app.get("/", (req, res) => {
  let usersList = JSON.parse(localStorage.getItem("users") || "[]");  
  res.json({ user: usersList });
});

// REGISTER user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // encrypt password

  users.push({ username, password: hashedPassword });

  localStorage.setItem("users", JSON.stringify(users));

  res.json({ message: "User registered!" });
});

// LOGIN user → get token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  // Create token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  tokenKey = token;
  res.json({ message: "Login successful", token });
});


//console.log ('>> req.headers["authorization"];', req.headers["authorization"]);

// 🔑 Middleware to verify token
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = tokenKey; // authHeader && authHeader.split(" ")[1]; // Bearer <token>
  
  if (!token) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // store user info in request
    next();
  });
}

// PROTECTED route
app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
