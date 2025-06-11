import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      url: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
      },
      publicId: {
        type: String,
      },
    },
    bio: {
      type: String,
      default: "This user hasn't added a bio yet.",
      trim: true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: 0 }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: 0 }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
