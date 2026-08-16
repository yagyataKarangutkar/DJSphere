import User from '../models/User.js';
import generateToken, { setTokenCookie } from '../helpers/generateToken.js';

// @desc    Register a new student user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Normalize email
    const normalizedEmail = String(email).toLowerCase().trim();

    // Check whether email is already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Always enforce role: "student" for public signup (ignore role if passed in req.body)
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      role: 'student',
    });

    if (user) {
      // Generate JWT and store in HTTP-only cookie
      const token = generateToken(user._id, user.role);
      setTokenCookie(res, token);

      // Return safe user information only (never return password)
      return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubName: user.clubName,
        course: user.course,
        year: user.year,
        avatar: user.avatar,
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Normalize email & find user
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Compare supplied password with stored hash
    if (user && (await user.matchPassword(password))) {
      // Generate JWT and store in HTTP-only cookie
      const token = generateToken(user._id, user.role);
      setTokenCookie(res, token);

      // Return safe user information only (never return password)
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubName: user.clubName,
        course: user.course,
        year: user.year,
        avatar: user.avatar,
      });
    } else {
      // Return 401 for invalid credentials
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear authentication cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.json({ message: 'Logged out successfully' });
};

// @desc    Get currently authenticated user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Return safe user information only (never return password)
    return res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      clubName: req.user.clubName,
      course: req.user.course,
      year: req.user.year,
      avatar: req.user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.course = req.body.course || user.course;
    user.year = req.body.year || user.year;

    const updatedUser = await user.save();

    return res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      clubName: updatedUser.clubName,
      course: updatedUser.course,
      year: updatedUser.year,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
