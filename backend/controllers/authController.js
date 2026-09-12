import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, companyName, companyDescription } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      companyName,
      companyDescription,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        companyDescription: user.companyDescription,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await User.matchPassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        companyDescription: user.companyDescription,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerAdmin, loginAdmin, getMe };

export const getCompanies = async (req, res) => {
  try {
    const companies = await User.getAllCompanies();

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};
