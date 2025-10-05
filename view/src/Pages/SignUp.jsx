import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function SignUp({ isDarkMode }) {
  const navigate = useNavigate();
  
  // Single state object for all form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/register`,
        { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        }
      );

      alert(response.data.message || "Signup successful!");
      
      // Navigate to login after 1 second
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || "Signup failed");
      } else {
        setError("Network error - please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Sign Up Card */}
          <div className="bg-[var(--color-background)] border-2 border-[var(--color-accent)] rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-[var(--color-primary)] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUserPlus size={28} className="text-[var(--color-text)]" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Join Our Community</h1>
              <p className="text-[var(--color-text)]/80">Create your account to get started</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 transition-colors duration-300">
                {error}
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-[var(--color-secondary)]" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-[var(--color-accent)] rounded-xl 
                             focus:border-[var(--color-secondary)] focus:outline-none 
                             focus:ring-2 focus:ring-[var(--color-secondary)]/20 
                             transition-all duration-200
                             placeholder-[var(--color-text)]/40 bg-[var(--color-background)] text-[var(--color-text)]"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-[var(--color-secondary)]" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-[var(--color-accent)] rounded-xl 
                             focus:border-[var(--color-secondary)] focus:outline-none 
                             focus:ring-2 focus:ring-[var(--color-secondary)]/20 
                             transition-all duration-200
                             placeholder-[var(--color-text)]/40 bg-[var(--color-background)] text-[var(--color-text)]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-[var(--color-secondary)]" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[var(--color-accent)] rounded-xl 
                             focus:border-[var(--color-secondary)] focus:outline-none 
                             focus:ring-2 focus:ring-[var(--color-secondary)]/20 
                             transition-all duration-200
                             placeholder-[var(--color-text)]/40 bg-[var(--color-background)] text-[var(--color-text)]"
                    placeholder="Enter your password (min. 6 characters)"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-[var(--color-secondary)]" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-[var(--color-accent)] rounded-xl 
                             focus:border-[var(--color-secondary)] focus:outline-none 
                             focus:ring-2 focus:ring-[var(--color-secondary)]/20 
                             transition-all duration-200
                             placeholder-[var(--color-text)]/40 bg-[var(--color-background)] text-[var(--color-text)]"
                    placeholder="Confirm your password"
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
                    ? 'bg-[var(--color-primary)] text-[var(--color-text)]/50 cursor-not-allowed' 
                    : 'bg-[var(--color-secondary)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:shadow-lg cursor-pointer'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--color-text)]"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-[var(--color-accent)]">
              <p className="text-[var(--color-text)]/80">
                Already have an account?{" "}
                <Link
                  to="/login" 
                  className="text-[var(--color-secondary)] font-semibold hover:text-[var(--color-text)] 
                           transition-colors duration-200 inline-flex items-center space-x-1"
                >
                  <FaSignInAlt className="h-4 w-4" />
                  <span>Login here</span>
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-[var(--color-text)]/60">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}