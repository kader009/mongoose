const mongoose = require('mongoose');
const express = require('express');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Connection error', err));

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'password must be 6 charecter'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;


// user post
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).send({ message: 'Invalid user email..' });
  }

  res.send({ message: 'Login user successfully.' });
});

app.listen(port, () => {
  console.log(`server is active on ${port}`);
});

app.get('/', (req, res) => {
  res.send('mongoose server');
});
