import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Header() {
  const [state, setState] = useState({ menuOpen: false, token: null });
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      token: JSON.parse(localStorage.getItem("token")),
    }));
  }, []);

  // Logout handler
  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${url}/api/user/log_out`, {});
      localStorage.removeItem("token");
      setState((prev) => ({ ...prev, token: null }));
      toast.success(res.data?.message);
      navigate("/");
    } catch (e) {
      const message =
        e.response?.data?.message || "Something went wrong during logout";
      toast.error(message);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300">
                Roadmap
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!state.token ? (
              <>
                <Link
                  to="/sign_up"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300"
                >
                  Sign Up
                </Link>
                <Link
                  to="/sign_in"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300 shadow-sm hover:shadow"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <button
                onClick={logoutHandler}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 font-medium transition-all duration-300 shadow-sm hover:shadow"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, menuOpen: !prev.menuOpen }))
              }
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              aria-expanded={state.menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {state.menuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          state.menuOpen
            ? "max-h-48 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3 space-y-3 bg-gray-50/90 backdrop-blur-sm border-t border-gray-200">
          {!state.token ? (
            <div className="flex flex-col space-y-2">
              <Link
                to="/sign_up"
                className="block w-full px-4 py-2 text-center rounded-lg text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300"
                onClick={() =>
                  setState((prev) => ({ ...prev, menuOpen: false }))
                }
              >
                Sign Up
              </Link>
              <Link
                to="/sign_in"
                className="block w-full px-4 py-2 text-center rounded-lg text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 transition-all duration-300"
                onClick={() =>
                  setState((prev) => ({ ...prev, menuOpen: false }))
                }
              >
                Sign In
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logoutHandler();
                setState((prev) => ({ ...prev, menuOpen: false }));
              }}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 font-medium transition-all duration-300 shadow-sm hover:shadow"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
