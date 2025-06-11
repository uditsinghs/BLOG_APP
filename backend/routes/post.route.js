import express from 'express';
import { isAuthenticated, isAuthorized } from '../middleware/authUser.middleware.js'
import { bookMarkPost, commentOnPost, createPost, deletePost, getAllBookMarkPosts, getAllPosts, getPostsById, getPublishedPosts, getUserPosts, publishPost, searchPostByKeyword, updatePost, viewCountPost } from '../controllers/post.controller.js';
import upload from '../middleware/multer.middleware.js';
const router = express.Router();

router.post("/create", isAuthenticated, isAuthorized("author"), upload.single("image"), createPost);
router.get('/get', isAuthenticated, getAllPosts)
router.get('/get/:postid', isAuthenticated, getPostsById)
router.delete('/delete/:postid', isAuthenticated, isAuthorized("author"), deletePost);
router.put('/update/:postid', isAuthenticated, isAuthorized("author"), upload.single("image"), updatePost)
router.get('/getuserpost', isAuthenticated, getUserPosts);
router.put("/publish/:postId", isAuthenticated, isAuthorized("author"), publishPost);
router.get('/getpublishpost', isAuthenticated, getPublishedPosts);
router.put('/view/:postid', isAuthenticated, viewCountPost)
router.get('/search', isAuthenticated, searchPostByKeyword);
router.put('/bookmark/:postId',isAuthenticated,bookMarkPost)
router.get('/bookmark',isAuthenticated,getAllBookMarkPosts)
router.put('/comment/:postId',isAuthenticated,commentOnPost);
export default router