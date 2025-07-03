import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sign_in = () => {
  const [state, setState] = useState({
    formData: { email: "", password: "" },
    token: null,
  });
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      token: JSON.parse(localStorage.getItem("token")),
    }));
  }, []);

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [e.target.name]: e.target.value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/sign_in`, state.formData);
      toast.success(res.data?.message);
      const token = res.data?.data;
      if (token) {
        localStorage.setItem("token", JSON.stringify(token));
        setState((prev) => ({ ...prev, token }));
        navigate("/");
      }
    } catch (e) {
      const message =
        e.response?.data?.message || "Something went wrong during sign-in";
      toast.error(message);
    }
  };

  if (state.token) {
    return (
      <div className="text-black text-center min-h-screen flex items-center justify-center bg-gray-100">
        You are logged in
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <input
          type="email"
          name="email"
          value={state.formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={state.formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
        <p className="text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/sign_up" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Sign_in;
