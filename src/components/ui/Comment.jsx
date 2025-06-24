import axios from "axios";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";
export default function Comment({
  comment,
  level,
  setComments,
  parentComments,
  fetchComments,
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [showOptions, setShowOptions] = useState(false);
  const MAX_NESTING = 3;
  const userId = JSON.parse(localStorage.getItem("userId"));
  const token = JSON.parse(localStorage.getItem("token"));
  console.log("userid", userId);
  const url = "https://roadmap-app-backend.onrender.com";
  const addReply = async (parentId, roadmapId) => {
    if (replyText.trim()) {
      try {
        await axios.post(
          `${url}/api/comment/create-comment`,
          {
            roadmapItemId: roadmapId, // You may need to pass this from parent
            text: replyText,
            parent: parentId, // replying to current comment
          },
          {
            withCredentials: true,
          }
        );
        setReplyText("");
        setReplying(false);
        // Re-fetch comments from parent component
        const res = await axios.get(
          `${url}/api/comment?roadmapItemId=${comment.roadmapItemId}`
        );
        console.log("Fetched Comments:", res.data.data);
        setComments(res.data.data);
      } catch (e) {
        const message =
          e.response?.data?.message || "Something went wrong during reply";
        toast.error(message);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.put(
        `${url}/api/comment/update-comment?commentId=${id}`,
        {
          text: editedText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      comment.text = editedText;
      toast.success(res.data?.message);
      setEditing(false);
      fetchComments();
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong during editing";
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/comment/delete-comment?commentId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong during deleting";
      toast.error(message);
    }
  };

  return (
    <div className={`ml-${level * 4} border-l pl-4 space-y-2 relative`}>
      <div className="flex justify-between items-center bg-gray-200 rounded-xl p-2">
        <div>
          <p className="text-sm font-semibold">{comment.user?.name}</p>
          {editing ? (
            <div className="space-y-2">
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleEdit(comment._id);
                  }
                }}
              />
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => handleEdit(comment._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditedText(comment.text);
                  }}
                  className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-black text-sm">{comment.text}</p>
          )}
          {!editing && (
            <button
              onClick={() => setReplying(!replying)}
              className="text-blue-500 text-sm mt-1 cursor-pointer"
            >
              Reply
            </button>
          )}
        </div>

        <div className="relative">
          {comment.user._id === userId && (
            <FaEllipsisV
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-400 hover:text-black cursor-pointer"
            />
          )}
          {showOptions && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded border z-10 w-24 text-sm">
              <button
                onClick={() => {
                  setEditing(true);
                  setShowOptions(false);
                }}
                className="block w-full text-left px-3 py-1 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(comment._id)}
                className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {comment.replies?.map(
        (reply) =>
          level < MAX_NESTING && (
            <Comment
              key={reply._id}
              comment={reply}
              level={level + 1}
              setComments={setComments}
              parentComments={parentComments}
            />
          )
      )}

      {replying && level < MAX_NESTING && (
        <div className="mt-2 ml-4">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addReply(comment._id, comment.roadmapItemId);
              }
            }}
            placeholder="Write a reply..."
            maxLength={300}
            className="w-full border px-3 py-1 rounded"
          />
          <button
            onClick={() => addReply(comment._id, comment.roadmapItemId)}
            className="mt-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            Post Reply
          </button>
        </div>
      )}
    </div>
  );
}
