
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { register } from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TreePine, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhoneNumber = (phone) => {
    // Regex for 10-digit phone number starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // Strong password: at least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        // Prepare payload for backend (phone_number not phoneNumber)
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phoneNumber
        };
        const { token, user, message } = await register(payload);
        // Save user to localStorage if needed
        localStorage.setItem('user', JSON.stringify({ ...user, token }));
        alert(message || 'Registration successful!');
        navigate(createPageUrl('Dashboard'));
      } catch (error) {
        // Error may be string or object
        let msg = error?.message || error?.error || error;
        if (typeof msg !== 'string') msg = 'Registration failed. Please try again.';
        alert(msg);
      }
    }
  };

  const handleBackToWelcome = () => {
    navigate(createPageUrl("Welcome"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBackToWelcome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Welcome</span>
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="neumorphic-small p-6 rounded-3xl inline-block mb-6">
            <TreePine className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join the Movement</h1>
          <p className="text-gray-600">Create your account and start planting trees</p>
        </div>

        {/* Registration Form */}
        <div className="neumorphic p-8 rounded-3xl">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`neumorphic-inset border-none pl-12 py-4 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
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
              <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold">Phone Number</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                  <span className="text-gray-600">+91</span>
                </div>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className={`neumorphic-inset border-none pl-20 py-4 ${errors.phoneNumber ? 'ring-2 ring-red-500' : ''}`}
                  maxLength={10}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a strong password"
                  className={`neumorphic-inset border-none pl-12 pr-12 py-4 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must contain at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <Button
              onClick={handleRegister}
              className="w-full neumorphic py-4 rounded-2xl text-lg font-bold text-green-700 hover:shadow-lg transition-all duration-200"
            >
              Create Account
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={handleBackToWelcome}
                className="text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 neumorphic p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Why Join Us?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Track your personal tree planting journey</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Join a global community of eco-warriors</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Make a real impact on our planet's future</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
