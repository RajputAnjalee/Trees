import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TreePine, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { forgotPassword } from "@/api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      newErrors.password = "Password must contain at least 8 characters with uppercase, lowercase, and number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUpdatePassword = async () => {
    setApiError("");
    if (validateForm()) {
      setIsLoading(true);
      try {
        await forgotPassword({ email, newPassword: password });
        setPasswordUpdated(true);
      } catch (error) {
        setApiError(error?.message || error?.error || "Failed to update password. Try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToWelcome = () => {
    navigate(createPageUrl("Welcome"));
  };

  if (passwordUpdated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="neumorphic-small p-6 rounded-3xl inline-block mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Password Updated!</h1>
            <p className="text-gray-600 mb-4">
              Your password for:
            </p>
            <p className="font-semibold text-gray-800 mb-6">{email}</p>
            <p className="text-sm text-gray-600">
              Password updated successfully. Please login with your new password.
            </p>
          </div>
          <div className="neumorphic p-6 rounded-3xl text-center">
            <Button
              onClick={handleBackToWelcome}
              className="w-full neumorphic-small py-3 rounded-2xl font-semibold text-gray-700"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBackToWelcome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="neumorphic-small p-6 rounded-3xl inline-block mb-6">
            <TreePine className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            Don't worry! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Reset Form */}
        <div className="neumorphic p-8 rounded-3xl">
          <div className="space-y-6">
            {apiError && (
              <p className="text-red-500 text-sm mb-2 text-center">{apiError}</p>
            )}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className={`neumorphic-inset border-none pl-12 py-4 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className={`neumorphic-inset border-none pl-12 py-4 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="w-full neumorphic py-4 rounded-2xl text-lg font-bold text-green-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  onClick={handleBackToWelcome}
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}