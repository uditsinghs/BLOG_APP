import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPaginatedBlogs } from "@/features/blogs/blogApi";
import BlogCard from "./BlogCard";

const Blogs = () => {
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs", page],
    queryFn: () => fetchPaginatedBlogs({ page, limit }),
    keepPreviousData: true,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  const { blogs, totalPages, currentPage } = data;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Blogs;
