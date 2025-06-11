import { Post } from "../models/post.model.js";
import { deleteImageOnCloudinary, uploadImageOnCloudinary } from "../utils/cloudinary.js";
import { User } from '../models/user.model.js'
import mongoose from "mongoose";
export const createPost = async (req, res) => {
  try {


    const { title, content, category, tags } = req.body;

    if (!title || !content || !category || !tags) {
      return res.status(400).json({ message: "Please provide all details", success: false });
    }

    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({ message: "User id not found", success: false });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }


    // Handle image upload
    let imageData = {
      url: "https://via.placeholder.com/800x400",
      publicId: null,
    };

    const image = req.file;
    if (image) {
      const cloudinaryResponse = await uploadImageOnCloudinary(image.path);

      if (!cloudinaryResponse) {
        return res.status(400).json({ message: "Error uploading image to Cloudinary", success: false });
      }

      imageData = {
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      };
    }

    // Create post in DB
    const newPost = await Post.create({
      title,
      content,
      category,
      tags: typeof tags === "string" ? tags.split(" ") : [],
      author: userId,
      image: imageData, // Always set image data
    });

    user.posts.push(newPost._id);
    await user.save();
    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      post: newPost,
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    if (posts.length === 0) {
      return res.status(400).json({ message: "No post available ", success: true })
    }
    return res.status(200).json({ posts, success: true })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

export const getPostsById = async (req, res) => {
  try {
    const { postid } = req.params;
    if (!postid) {
      return res.status(404).json({ message: "post id not found", success: false })
    }
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false })
    }
    return res.status(200).json({ success: true, post })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postid } = req.params;
    const userId = req.user._id;
    if (!postid) {
      return res.status(404).json({ message: "post id not found", success: false })
    }
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false })
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    await post.deleteOne();
    user.posts.pop(postid)
    await user.save();

    return res.status(200).json({ success: true, message: "Post deleted successfully" })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postid } = req.params;
    if (!postid) {
      return res.status(404).json({ message: "post id not found", success: false })
    }
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false })
    }

    const { title, content, category, tags } = req.body;

    let imageData = {
      url: "https://via.placeholder.com/800x400",
      publicId: null,
    };

    const image = req.file;
    if (image) {
      const cloudinaryResponse = await uploadImageOnCloudinary(image.path);
      if (!cloudinaryResponse) {
        return res.status(400).json({ message: "Error uploading image to Cloudinary", success: false });
      }

      imageData = {
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
      };
    }
    if (title) {
      post.title = title;
    }
    if (content) {

      post.content = content;
    }
    if (category) {

      post.category = category;
    }
    if (tags) {

      post.tags = typeof tags === "string" ? tags.split(" ") : [];

    }

    // before updating image delete the image;
    if (image) {
      await deleteImageOnCloudinary(post.image.publicId)
      post.image = imageData
    }

    await post.save()

    return res.status(201).json({
      message: "Post updated successfully",
      success: true,
      post
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

export const getUserPosts = async (req, res) => {

  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        message: "User id not found",
        success: false
      })
    }
    const posts = await Post.find({ author: userId });
    if (posts.length === 0) {
      return res.status(404).json({
        message: "post not found",
        success: false
      })
    }

    return res.status(200).json({ success: true, posts })

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
export const publishPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found", success: false })
    }

    // Check if the user is the author or an admin
    if (post.author.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }
    post.isPublished = !post.isPublished;
    await post.save();
    return res.status(200).json({
      message: `Post ${post.isPublished ? "published" : "unpublished"} successfully`,
      success: true,
      post,
    });


  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
export const getPublishedPosts = async (req, res) => {
  try {
    const publishedPost = await Post.find({ isPublished: true });
    if (publishPost.length === 0) {
      return res.status(404).json({ message: "post not found", success: false })
    }
    return res.status(200).json({ success: true, publishedPost })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
export const viewCountPost = async (req, res) => {
  try {
    const { postid } = req.params; 
    const userid = req.user.id;

    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    if (!post.views) {
      post.views = [];
    }

    // Check if user has already viewed the post
    const isAlreadyViewed = post.views.includes(userid);
    if (isAlreadyViewed) {
      return res.status(200).json({ message: "Already viewed", success: true });
    }

    post.views.push(userid);
    await post.save();

    return res.status(200).json({ message: "Viewed", success: true });

  } catch (error) {
    console.error("Error in viewCountPost:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
export const searchPostByKeyword = async (req, res) => {
  try {
    const { keyword } = req.query;
    let trimmedQuery = keyword.trim()

    if (!trimmedQuery) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search keyword",
      });
    }


    const searchedPosts = await Post.find({
      $or: [
        {
          title: { $regex: trimmedQuery, $options: "i" }
        },
        {
          content: { $regex: trimmedQuery, $options: "i" }
        }
      ]
    })

    if (searchedPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No post found ",
      })
    }
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: searchedPosts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
export const bookMarkPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const trimmedPostId = postId.trim();

    if (!mongoose.Types.ObjectId.isValid(trimmedPostId)) {
      return res.status(400).json({ message: "Invalid post ID", success: false });
    }

    const userId = req.user.id;

    const post = await Post.findById(trimmedPostId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (!user.bookmarks.includes(post._id)) {
      user.bookmarks.push(post._id);
      await user.save();
    }

    return res.status(200).json({ message: "Bookmarked successfully", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
export const getAllBookMarkPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }


    const bookmarkedPosts = await Post.find({
      _id: { $in: user.bookmarks }
    });

    return res.status(200).json({
      success: true,
      message: "Bookmarked posts fetched successfully",
      posts: bookmarkedPosts
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
export const commentOnPost = async (req, res) => {

  try {
    const userid = req.user.id;

    const { postId } = req.params;
    const trimmedPostId = postId.trim();

    if (!mongoose.Types.ObjectId.isValid(trimmedPostId)) {
      return res.status(400).json({ message: "Invalid post ID", success: false });
    }

    const post = await Post.findById(trimmedPostId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    const { content } = req.body;
    const commentonPost = {
      content,
      user:userid
    }
 post.comments.push(commentonPost);
    await post.save();
    return res.status(200).json({ message: "comment successfully", success: true })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
// ********************************************************************************************** 

export const likeOrDislikePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
export const getlikeOrDislikePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};
export const getAllComments = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};



export const deleteComment = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};


