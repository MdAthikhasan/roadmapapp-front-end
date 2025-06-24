import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const url = "https://roadmap-app-backend.onrender.com";
  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${url}/api/user/log_out`, {});
      localStorage.removeItem("token");

      toast.success(res.data?.message);
      navigate("/");
    } catch (e) {
      const message =
        e.response?.data?.message || "Something went wrong during logout";
      toast.error(message);
    }
  };
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">Roadmap</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  to="/sign_up"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  to="/sign_in"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <button
                onClick={logoutHandler}
                className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-red-500 font-medium cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {!token ? (
            <>
              <Link
                to="/sign_up"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sign Up
              </Link>
              <Link
                to="/sign_in"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
            </>
          ) : (
            <button
              onClick={logoutHandler}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-red-600 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
