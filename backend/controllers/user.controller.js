import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  deleteImageOnCloudinary,
  uploadImageOnCloudinary,
} from "../utils/cloudinary.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Registered successfully",
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV = "production",
      sameSite: process.env.NODE_ENV = "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const logout = (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV = "production",
    sameSite: process.env.NODE_ENV = "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// i also need to update the user profile image 
export const updateUserProfile = async (req, res) => {
  try {
    const { bio, userid } = req.body;

    let user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({}).select("-password");
    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No user Found.", success: true });
    }
    return res.status(200).json({ allUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
// need to update this controller after deleting a specific user i need to delete the user's related action done in past 
export const deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }



    const user = await User.findByIdAndDelete(userid);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};
export const changeRole = async (req, res) => {
  try {
    const { userid } = req.params;
    const trimmedUserid = userid.trim();
    const { role } = req.body;
    if (!role) {
      return res
        .status(404)
        .json({ message: "role not provided", success: false });
    }

    const user = await User.findById(trimmedUserid).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }
    user.role = role;
    await user.save();
    return res.status(200).json({
      message: `${user.name} is now ${user.role}`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};
export const updateProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    const { id } = req.user;
    console.log(file);

    if (!file) {
      return res.status(404).json({
        message: "profile picture not found",
        success: false,
      });
    }

    // find user
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }
    if (user.photo.url) {
      await deleteImageOnCloudinary(user.photo.publicId);
    }

    const cloudinaryResponse = await uploadImageOnCloudinary(file.path);
    console.log(cloudinaryResponse);

    if (cloudinaryResponse) {
      user.photo.url = cloudinaryResponse.secure_url;
      user.photo.publicId = cloudinaryResponse.public_id;
    }
    await user.save();
    return res
      .status(200)
      .json({ message: "photo updated successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};
export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.user.id;
    const jiskoFollowKrunga = req.params.id;
    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "khud ko follow ya unfollow nhi kar skte ho..",
        success: false,
      });
    }
    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // ab check krunga ki follow krna hai ya unfollow..
    const isFollowing = user.following.includes(targetUser._id); //check krega user ki following main ki jisko follow kar rha hu kya bo user ki following list main pahle se exist krta hai if krta hai to usko unfollow kar skte hai aur agar following main id nhi mili to usko follow karunga
    if (isFollowing) {
      // agar follow kiya hai pahle se to unfollow ka logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "unFollow success",
        success: true,
      });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "Follow success",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const getFollower = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    // Fetch user and populate followers
    const user = await User.findById(userid).populate("followers");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user has followers
    if (!user.followers || user.followers.length === 0) {
      return res.status(404).json({
        message: "No followers found",
        success: false,
      });
    }

    return res.status(200).json({
      followers: user.followers,
      success: true,
    });

  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};
export const getFollowing = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }


    const user = await User.findById(userid).populate("following");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!user.following || user.following.length === 0) {
      return res.status(404).json({
        message: "No following found",
        success: false,
      });
    }

    return res.status(200).json({
      following: user.following,
      success: true,
    });

  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};



// after post -----------------
export const forgotPassword = (req, res) => { };
export const resetPassword = (req, res) => { };
export const verifyEmail = (req, res) => { };