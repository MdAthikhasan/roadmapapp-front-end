import { useEffect, useState } from "react";
import { BiUpvote } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";
import Comment from "./Comment";

import axios from "axios"; // Add this
import { toast } from "react-toastify";

export default function RoadmapCard({ item, setRoadmapData }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const url = "https://roadmap-app-backend.onrender.com";
  const token = JSON.parse(localStorage.getItem("token"));
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${url}/api/comment?roadmapItemId=${item._id}`
      );

      setComments(res.data.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong during fetching comments";
      toast.error(message);
    }
  };

  const addComment = async () => {
    if (newComment.trim()) {
      try {
        await axios.post(
          `${url}/api/comment/create-comment`,
          {
            roadmapItemId: item._id,
            text: newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchComments();
        setNewComment("");
      } catch (e) {
        const message =
          e.response?.data?.message || "Something went wrong during comment";
        toast.error(message);
      }
    }
  };
  const toggleUpvote = async () => {
    try {
      await axios.put(
        `${url}/api/roadmapItem/${item._id}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await axios.get("http://localhost:3000/api/roadmapitem/");
      setRoadmapData(data.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong during upvoting";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold">{item.title}</h2>
      <p className="text-black font-medium mt-2">{item.description}</p>
      <div className="flex mt-3 text-md text-black">
        <p className="mr-4">
          <span className="font-medium">Category:</span> {item.category}
        </p>
        <p className="">
          {" "}
          <span className="font-medium">Status:</span> {item.status}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4 border-t pt-3">
        <button
          onClick={toggleUpvote}
          className="flex items-center  text-lg text-blue-400 hover:text-blue-600 font-semibold gap-1 cursor-pointer"
        >
          <BiUpvote /> {item.upvotes}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-600 hover:text-black gap-1 cursor-pointer"
        >
          <FaCommentAlt /> Comment
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          {comments
            ?.filter((comment) => comment.roadmapItemId == item._id)
            .map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                level={0}
                setComments={setComments}
                parentComments={comments}
                fetchComments={fetchComments}
              />
            ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment();
                }
              }}
              placeholder="Write a comment..."
              maxLength={300}
              className="w-full border px-3 py-2 rounded"
            />
            <button
              onClick={addComment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
