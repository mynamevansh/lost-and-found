const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      return next(new Error('Please provide all fields'));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const role = email === 'vanshranawat48@gmail.com' ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    if (user) {
      console.log(`✅ User registered: ${email}`);
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        message: 'User registered successfully. Please log in to continue.'
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log(`✅ User logged in: ${email}`);
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        },
        message: 'Login successful'
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    console.log('🔵 Google login request received');
    const { token } = req.body;

    if (!token) {
      console.log('❌ No token provided');
      res.status(400);
      return next(new Error('Token is required'));
    }

    console.log('🔍 Verifying Google token...');
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    console.log(`✅ Token verified for user: ${email}`);

    let user = await User.findOne({ email });

    if (!user) {
      const role = email === 'vanshranawat48@gmail.com' ? 'admin' : 'user';
      user = await User.create({
        name,
        email,
        password: googleId,
        role
      });
      console.log(`✅ New Google user registered: ${email}`);
    } else {
      console.log(`✅ Google user logged in: ${email}`);
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      },
      message: 'Google login successful'
    });
  } catch (error) {
    console.error('🔴 Google login error:', error);
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

const makeAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400);
      return next(new Error('User ID is required'));
    }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${user.email} made admin`);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'User role updated to admin'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  makeAdmin
};
