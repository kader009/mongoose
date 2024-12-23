const mongoose = require('mongoose'); 
const express = require('express');
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
dotenv.config();

/**
 * Middleware Configuration
 * - @express.json() for parsing JSON request bodies
 * - @cors() for enabling Cross-Origin Resource Sharing
 */
app.use(express.json());
app.use(cors()); // this cors is used to connect the frontend and backend

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

// post schema
const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'text is needed'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Posts = mongoose.model('posts', postSchema);
module.exports = Posts;

// user post
app.post('/post', async (req, res) => {
  try {
    const posts = new Posts(req.body);
    await posts.save();
    res.status(201).send({ message: 'Post create successfully..' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// all post
app.get('/post', async (req, res) => {
  const post = await Posts.find();
  res.send(post);
});

// update post
app.patch('/post/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatePost = await Posts.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatePost) {
      return res.status(404).json({ message: 'post not found' });
    }
    res.send(updatePost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
});

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

// user login
app.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).send({ message: 'Invalid user email..' });
  }

  res.send({ message: 'Login user successfully.' });
});

// get all user
app.get('/user', async (req, res) => {
  const user = await User.find();
  res.send(user);
});

app.listen(port, () => {
  console.log(`server is active on ${port}`);
});

app.get('/', (req, res) => {
  res.send('mongoose server');
});
