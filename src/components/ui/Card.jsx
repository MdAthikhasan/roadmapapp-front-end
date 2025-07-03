// External imports
import axios from "axios";
import { startTransition, useCallback, useEffect, useState } from "react";
import { BiUpvote } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";
import { toast } from "react-toastify";

// Internal imports
import Comment from "./Comment";

export default function RoadmapCard({ item }) {
  // UI state
  const [ui, setUi] = useState({
    showComments: false,
    comments: [],
    newComment: "",
    isLoadingBtn: false,
    isLoadingComments: false,
  });

  // User info and upvote state
  const [userInfo, setUserInfo] = useState({ userId: "", token: "" });
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(item.upvotes);

  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem("userId"));
    const storedToken = JSON.parse(localStorage.getItem("token"));
    setUserInfo({ userId: storedUserId, token: storedToken });
  }, []);

  useEffect(() => {
    if (userInfo.userId) {
      const hasUpvoted = item.upvotedBy?.includes(userInfo.userId);
      setIsUpvoted(hasUpvoted);
    }
  }, [userInfo.userId, item.upvotedBy]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${url}/api/comment?roadmapItemId=${item._id}`
      );
      setUi((cur) => ({ ...cur, comments: res.data?.data ?? [] }));
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong during fetching comments";
      toast.error(message);
    }
  }, [item._id, url]);

  // Add a new comment
  const addComment = useCallback(async () => {
    if (!ui.newComment.trim()) return;
    try {
      setUi((cur) => ({ ...cur, isLoadingBtn: true }));
      await axios.post(
        `${url}/api/comment/create-comment`,
        {
          roadmapItemId: item._id,
          text: ui.newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      fetchComments();
      setUi((cur) => ({ ...cur, newComment: "", isLoadingBtn: false }));
    } catch (e) {
      setUi((cur) => ({ ...cur, newComment: "", isLoadingBtn: false }));
      const message =
        e.response?.data?.message || "Something went wrong during comment";
      toast.error(message);
    }
  }, [ui.newComment, item._id, url, userInfo.token, fetchComments]);

  // Toggle upvote
  const toggleUpvote = useCallback(async () => {
    if (!userInfo.token) return toast.error("Please login to upvote");

    const newVoteState = !isUpvoted;

    startTransition(() => {
      setIsUpvoted(newVoteState);
      setUpvotes((prev) => prev + (newVoteState ? 1 : -1));
    });

    try {
      await axios.put(
        `${url}/api/roadmapItem/${item._id}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
    } catch (err) {
      // Revert optimistic update
      setIsUpvoted(!newVoteState);
      setUpvotes((prev) => prev - (newVoteState ? 1 : -1));

      const message =
        err.response?.data?.message || "Something went wrong during upvoting";
      toast.error(message);
    }
  }, [isUpvoted, url, item._id, userInfo.token]);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold">{item.title}</h2>
      <p className="text-black font-medium mt-2">{item.description}</p>

      <div className="flex mt-3 text-md text-black">
        <p className="mr-4">
          <span className="font-medium">Category:</span> {item.category}
        </p>
        <p>
          <span className="font-medium">Status:</span> {item.status}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4 border-t pt-3">
        <button
          onClick={toggleUpvote}
          className={`flex items-center text-lg font-semibold gap-1 cursor-pointer ${
            isUpvoted ? "text-blue-700" : "text-blue-400 hover:text-blue-700"
          }`}
        >
          <BiUpvote /> {upvotes}
        </button>

        <button
          onClick={() =>
            setUi((cur) => ({ ...cur, showComments: !cur.showComments }))
          }
          className="flex items-center text-gray-600 hover:text-black gap-1 cursor-pointer"
        >
          <FaCommentAlt /> Comment
        </button>
      </div>

      {ui.showComments && (
        <div className="mt-4 space-y-4">
          {ui.comments
            ?.filter((comment) => comment.roadmapItemId === item._id)
            .map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                level={0}
                setComments={(comments) =>
                  setUi((cur) => ({ ...cur, comments }))
                }
                parentComments={ui.comments}
                fetchComments={fetchComments}
              />
            ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={ui.newComment}
              onChange={(e) =>
                setUi((cur) => ({ ...cur, newComment: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") addComment();
              }}
              placeholder="Write a comment..."
              maxLength={300}
              className="w-full border px-3 py-2 rounded"
            />
            <button
              onClick={addComment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {ui.isLoadingBtn ? "posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
