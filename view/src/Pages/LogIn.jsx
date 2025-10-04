import axios from "axios";
import { useState } from "react";
import Header from "./Components/Header";
import { FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, {
        email, 
        password 
      });
      const data = response.data;
      // store JWT token
      localStorage.setItem("token", data.token);
      // Redirect to home or dashboard
      window.location.href = "/";
    } catch (err) {
        console.error(err);
        if (err.response)
           setError(err.response.data.message || "Login failed");
        else
           setError("Network error - please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Login Card */}
          <div className="bg-[#FFFFFF] border-2 border-[#EBD0BF] rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-[#CFC1B4] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaSignInAlt size={28} className="text-[#111111]" />
              </div>
              <h1 className="text-3xl font-bold text-[#111111] mb-2">Welcome Back</h1>
              <p className="text-[#111111]/80">Sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-[#C19C82]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                             focus:border-[#C19C82] focus:outline-none 
                             focus:ring-2 focus:ring-[#C19C82]/20 
                             transition-all duration-200
                             placeholder-[#111111]/40"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-[#C19C82]" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#EBD0BF] rounded-xl 
                             focus:border-[#C19C82] focus:outline-none 
                             focus:ring-2 focus:ring-[#C19C82]/20 
                             transition-all duration-200
                             placeholder-[#111111]/40"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200
                  flex items-center justify-center space-x-2
                  ${loading 
                    ? 'bg-[#CFC1B4] text-[#111111]/50 cursor-not-allowed' 
                    : 'bg-[#C19C82] text-[#111111] hover:bg-[#EBD0BF] hover:shadow-lg cursor-pointer'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#111111]"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="h-5 w-5" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6 pt-6 border-t border-[#EBD0BF]">
              <p className="text-[#111111]/80">
                Don't have an account?{" "}
                <a 
                  href="/signup" 
                  className="text-[#C19C82] font-semibold hover:text-[#111111] 
                           transition-colors duration-200 inline-flex items-center space-x-1"
                >
                  <FaUserPlus className="h-4 w-4" />
                  <span>Sign up here</span>
                </a>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-[#111111]/60">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}