import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import Datastore from "nedb";

const db = new Datastore({ filename: "users.db", autoload: true });

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your_jwt_secret_key';
const TOKEN_EXPIRY = '1h';

const users = [
  {
    email: 'test@gmail.com',
    password: bcrypt.hashSync('123456', 10) // hashed password
  }
];

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });

  res.json({ token });
});


const blacklist = new Set(); // Store invalidated tokens

app.post('/logout', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) return res.status(400).json({ message: 'Token required' });

  blacklist.add(token); // Add token to blacklist
  res.json({ message: 'Logged out successfully' });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // attach user info
    next(); // proceed to route
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
}




// GET /users
app.get("/users", authenticateToken, async (req, res) => {

  db.find({ }, (err, user) => {
    if (err) return res.status(500).json({ message: err });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
});


// GET /users/:id
app.get('/users/:id', authenticateToken , async (req, res) => {
  const { id } = req.params;
  db.findOne({ _id: id }, (err, user) => {
    if (err) return res.status(500).json({ message: err });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
});




// post /users/create
app.post("/users/create", authenticateToken, async (req, res) => {

  try {
    const user = req.body;
    const email = user.email;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    else { 
      console.log('>>email', email)
      db.findOne({ email }, (err, existingUser) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        if (existingUser) {
          return res.status(400).json({ message: "Email already exists" });
        }
        db.insert(user, (err, newUser) => {
          if (err) return res.status(500).json({ message: 'insert Server error' });
          else {
            res.status(201).json(newUser);
          }
        });
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




// PUT /users/:id
app.put('/users/edit/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const email = updates.email;

  try {
    db.findOne({ email }, (err, existingUser) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (existingUser && existingUser._id !== id) {
        return res.status(400).json({ message: "Email already exists for another user" });
      }
      
      db.update(
        { _id: id },
        { $set: updates },
        {},
        (err, numReplaced) => {
          if (err) return res.status(500).json({ message: "Update failed" });
          if (numReplaced === 0) return res.status(404).json({ message: "User not found" });

          // Fetch updated user
          db.findOne({ _id: id }, (err, updatedUser) => {
            if (err) return res.status(500).json({ message: "Error fetching updated user" });
            res.json(updatedUser);
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/users/:id', authenticateToken, async (req, res) => {
// Delete a user by ID
  try {
    const { id } = req.params;
    db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        res.json({ message: `Error deleting user: ${err}` });
      } else if (numRemoved === 0) {
        res.json({ message: 'No user found with this ID' });
      } else {
        res.json({ id: id });;
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
