import { useState } from "react";
import { MessageCircle, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { addComment } from "@/features/blogs/blogApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const BlogCard = ({ blog }) => {
  const {
    _id,
    title,
    content,
    image,
    category,
    tags,
    author,
    views,
    likes,
    comments,
    createdAt,
  } = blog;

  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(comments || []);
  const { user } = useSelector((state) => state.user);

  const excerpt =
    content.length > 50 ? content.substring(0, 50) + "..." : content;

  // add comment
  const mutation = useMutation({
    mutationFn: addComment,
  });

  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) return;

    const newComment = commentText;

    mutation.mutate(
      { content: newComment, postId: postId },
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          setCommentsList((prev) => [
            ...prev,
            {
              content: newComment,
              user: {
                name: user?.name,
                photo: { url: user?.photo?.url },
              },
            },
          ]);
          setCommentText(""); 
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message);
        },
      }
    );
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56">
        <img
          src={image?.url}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </span>
      </div>

      <div className="p-4">
        <Link to={`/blog/${_id}`}>
          <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition">
            {title}
          </h2>
        </Link>

        <div className="flex items-center gap-2 mt-3">
          <img
            src={author?.photo?.url}
            alt={author?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm text-gray-600">{author?.name}</span>
          <span className="text-xs text-gray-400 ml-auto">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mt-3">{excerpt}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats + Comment Trigger */}
        <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <Eye size={16} /> {views?.length}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={16} /> {likes?.length}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1">
                <MessageCircle size={16} /> {comments?.length}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Comments</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Left: Comment list */}
                <div className="max-h-64 overflow-y-auto pr-2 border-r">
                  {commentsList?.length > 0 ? (
                    commentsList.map((c, i) => (
                      <div key={i} className="mb-4 border-b pb-2">
                        <div className="flex gap-2 items-center">
                          <img
                            src={
                              c?.user?.photo?.url ||
                              "https://via.placeholder.com/30"
                            }
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-semibold">
                            {c?.user?.name}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mt-1">
                          {c?.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                </div>

                {/* Right: Add Comment */}
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Write your comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button onClick={() => handleCommentSubmit(_id)}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
