import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Comment({
  comment,
  level,
  setComments,
  parentComments,
  fetchComments,
}) {
  // UI state
  const [ui, setUi] = useState({
    replying: false,
    replyText: "",
    editing: false,
    editedText: comment.text,
    showOptions: false,
    isLoading: false,
  });

  // User info state
  const [userInfo, setUserInfo] = useState({
    userId: "",
    token: "",
  });

  // Constants
  const MAX_NESTING = 3;
  const url = import.meta.env.VITE_URL;

  // Get userId and token from localStorage on mount
  useEffect(() => {
    setUserInfo({
      userId: JSON.parse(localStorage.getItem("userId")),
      token: JSON.parse(localStorage.getItem("token")),
    });
  }, []);

  // Add reply to a comment
  const addReply = useCallback(
    async (parentId, roadmapId) => {
      if (!ui.replyText.trim()) return;
      try {
        setUi((prev) => ({ ...prev, isLoading: true }));
        await axios.post(
          `${url}/api/comment/create-comment`,
          {
            roadmapItemId: roadmapId,
            text: ui.replyText,
            parent: parentId,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setUi((prev) => ({
          ...prev,
          replyText: "",
          replying: false,
          isLoading: false,
        }));

        fetchComments && fetchComments();
      } catch (e) {
        const message =
          e.response?.data?.message || "Something went wrong during reply";
        toast.error(message);
        setUi((prev) => ({
          ...prev,
          replyText: "",
          replying: false,
          isLoading: false,
        }));
      }
    },
    [ui.replyText, userInfo.token, url, fetchComments]
  );

  // Edit a comment
  const handleEdit = useCallback(
    async (id) => {
      try {
        setUi((prev) => ({ ...prev, isLoading: true }));
        const res = await axios.put(
          `${url}/api/comment/update-comment?commentId=${id}`,
          { text: ui.editedText },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        toast.success(res.data?.message);
        setUi((prev) => ({ ...prev, editing: false, isLoading: false }));
        fetchComments && fetchComments();
      } catch (err) {
        const message =
          err.response?.data?.message || "Something went wrong during editing";
        toast.error(message);
      }
    },
    [ui.editedText, userInfo.token, url, fetchComments]
  );

  // Delete a comment
  const handleDelete = useCallback(
    async (id) => {
      try {
        setUi((prev) => ({ ...prev, isLoading: true }));
        await axios.delete(
          `${url}/api/comment/delete-comment?commentId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        fetchComments && fetchComments();
        setUi((prev) => ({ ...prev, isLoading: false }));
        toast.success("Comment deleted successfully");
      } catch (err) {
        setUi((prev) => ({ ...prev, isLoading: false }));
        const message =
          err.response?.data?.message || "Something went wrong during deleting";
        toast.error(message);
        setUi((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [userInfo.token, url, fetchComments]
  );

  // Render
  return (
    <div className={`ml-${level * 4} border-l pl-4 space-y-2 relative`}>
      <div className="flex justify-between items-center bg-gray-200 rounded-xl p-2">
        <div>
          <p className="text-sm font-semibold">{comment.user?.name}</p>
          {ui.editing ? (
            <div className="space-y-2">
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                value={ui.editedText}
                onChange={(e) =>
                  setUi((prev) => ({ ...prev, editedText: e.target.value }))
                }
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
                  {ui.isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setUi((prev) => ({ ...prev, editing: false }));
                    setUi((prev) => ({ ...prev, editedText: comment.text }));
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
          {!ui.editing && (
            <button
              onClick={() =>
                setUi((prev) => ({ ...prev, replying: !prev.replying }))
              }
              className="text-blue-500 text-sm mt-1 cursor-pointer"
            >
              Reply
            </button>
          )}
        </div>
        <div className="relative">
          {comment.user?._id === userInfo.userId && (
            <FaEllipsisV
              onClick={() =>
                setUi((prev) => ({ ...prev, showOptions: !prev.showOptions }))
              }
              className="text-gray-400 hover:text-black cursor-pointer"
            />
          )}
          {ui.showOptions && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded border z-10 w-24 text-sm">
              <button
                onClick={() => {
                  setUi((prev) => ({ ...prev, editing: true }));
                  setUi((prev) => ({ ...prev, showOptions: false }));
                }}
                className="block w-full text-left px-3 py-1 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(comment._id)}
                className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-red-600"
              >
                {ui.isLoading ? "Deleting..." : "Delete"}
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
              fetchComments={fetchComments}
            />
          )
      )}
      {ui.replying && level < MAX_NESTING && (
        <div className="mt-2 ml-4">
          <input
            type="text"
            value={ui.replyText}
            onChange={(e) =>
              setUi((prev) => ({ ...prev, replyText: e.target.value }))
            }
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
            {ui.isLoading ? "Posting..." : "Post Reply"}
          </button>
        </div>
      )}
    </div>
  );
}
