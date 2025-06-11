import express from "express";
import {
  getUser,
  login,
  logout,
  signup,
  updateUserProfile,
  getAllUser,
  deleteUser,
  changeRole,
  getUserById,
  updateProfilePicture,
  followOrUnfollow,
  getFollower,
  getFollowing,
} from "../controllers/user.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/authUser.middleware.js";
import upload from "../middleware/multer.middleware.js";
const router = express.Router();
router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update", updateUserProfile);
router.get("/profile", isAuthenticated, getUser);
router.get("/getprofile/:id", isAuthenticated, getUserById);
router.put(
  "/update/photo",
  isAuthenticated,
  upload.single("photo"),
  updateProfilePicture
);
router.post('/follow/:id', isAuthenticated, followOrUnfollow)
router.get('/get/follower/:userid', isAuthenticated, getFollower)
router.get('/get/following/:userid', isAuthenticated, getFollowing)
// admin routes
router.get(
  "/admin/getalluser",
  isAuthenticated,
  isAuthorized("admin"),
  getAllUser
);
router.delete(
  "/admin/deleteuser/:userid",
  isAuthenticated,
  isAuthorized("admin"),
  deleteUser
);
router.put(
  "/admin/changerole/:userid",
  isAuthenticated,
  isAuthorized("admin"),
  changeRole
);
export default router;
