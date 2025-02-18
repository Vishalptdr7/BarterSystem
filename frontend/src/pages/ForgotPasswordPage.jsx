import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
   

    try {
      const response = await axiosInstance.post("/users/forgotPassword", {
        email,
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <p className="text-gray-400 text-center mt-2">
          Enter your email to receive OTP
        </p>

        {message && (
          <p className="text-green-400 text-center mt-3">{message}</p>
        )}
        {error && <p className="text-red-400 text-center mt-3">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
            {" "}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
            >
              Send OTP
            </button>
         
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
