import React, { useState } from "react";
import { login, sendOtp } from "@/api/auth";
// import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TreePine, ShieldCheck, Users, TrendingUp, Mail, Lock, Eye, EyeOff, Phone, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Welcome() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    otp: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === "email") {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
    } else {
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      }

      if (otpSent) {
        if (!formData.otp) {
          newErrors.otp = "OTP is required";
        } else if (formData.otp.length !== 6) {
          newErrors.otp = "Please enter a valid 6-digit OTP";
        }
      }
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

  const handleSendOtp = async () => {
    if (!formData.phoneNumber || !validatePhoneNumber(formData.phoneNumber)) {
      setErrors({ phoneNumber: "Please enter a valid 10-digit phone number" });
      return;
    }

    setIsLoadingOtp(true);
    try {
      await sendOtp(formData.phoneNumber);
      setOtpSent(true);
      alert(`OTP sent to +91 ${formData.phoneNumber}`);
    } catch (error) {
      let msg = error?.message || error?.error || error;
      if (typeof msg !== 'string') msg = 'Failed to send OTP. Please try again.';
      alert(msg);
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleStartForest = () => {
    if (!loading && !isLoadingOtp) {
      if (loginMethod === "phone" && !otpSent) {
        handleSendOtp();
      } else {
        handleLogin();
      }
    }
  };

  const handleSignup = () => {
    navigate(createPageUrl("Register"));
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (loginMethod === "email") {
        const response = await login(formData);
        console.log('Login response:', response);
        
        if (response && response.user) {
          const userData = {
            ...response.user,
            token: response.token,
            // Ensure we have _id for backward compatibility
            _id: response.user.id
          };
          
          console.log('Saving to localStorage:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('User data saved to localStorage');
        }
      } else {
        // Handle phone/OTP login with correct param name
        const phonePayload = {
          phone_number: formData.phoneNumber,
          otp: formData.otp
        };
        const response = await login(phonePayload);
        console.log('Phone login response:', response);
        
        if (response && response.user) {
          const userData = {
            ...response.user,
            token: response.token,
            // Ensure we have _id for backward compatibility
            _id: response.user.id
          };
          
          console.log('Saving phone user to localStorage:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('Phone user data saved to localStorage');
        }
      }
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      setErrors({
        [loginMethod === "email" ? "email" : "otp"]: error?.message || "Login failed. Please check your credentials."
      });
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_CLIENT_ID = "790034571422-jc13vkp633f79e29sgvhjkjalits1vl6.apps.googleusercontent.com";

// Dynamically load Google Identity Services script
function loadGoogleScript() {
  if (document.getElementById("google-client-js")) return;
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.id = "google-client-js";
  document.body.appendChild(script);
}

React.useEffect(() => {
  loadGoogleScript();
}, []);

const handleGoogleLogin = () => {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    alert("Google login is not ready. Please try again in a moment.");
    return;
  }
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: async (response) => {
      try {
        // Send Google ID token to backend
        const res = await fetch("/api/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential })
        });
        const data = await res.json();
        if (data && data.token && data.user) {
          localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
          navigate(createPageUrl("Dashboard"));
        } else {
          throw new Error(data.message || "Google login failed");
        }
      } catch (error) {
        alert("Google login failed: " + (error.message || error));
      }
    },
  });
  window.google.accounts.id.prompt(); // Show Google One Tap or popup
};
const handleForgotPassword = () => {
  navigate(createPageUrl("ForgotPassword"));
};
  const features = [
    {
      icon: TrendingUp,
      title: "Track Your Impact",
      description: "Watch your progress grow towards the 1,000,000 tree goal with a personalized dashboard."
    },
    {
      icon: Users,
      title: "Family & Individual Goals",
      description: "Embark on this journey solo or as a family, uniting under a single green mission."
    },
    {
      icon: ShieldCheck,
      title: "Secure & Simple",
      description: "Your data is protected. Planting trees is made easy through a seamless and secure process."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <div className="neumorphic-small p-3 rounded-2xl">
              <TreePine className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Tress</h1>
          </div>
          <Button
            onClick={handleSignup}
            className="neumorphic-small px-6 py-3 rounded-2xl font-semibold text-blue-700"
          >
            Sign Up
          </Button>
        </header>

        {/* Hero Section */}
        <main className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
            Plant a Million Trees.
            <br />
            <span className="text-green-600">Leave a Legacy.</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600">
            Join a global community dedicated to reforesting our planet. Start your journey, track your impact, and celebrate every tree planted towards your goal of one million.
          </p>

          {/* Login Form */}
          <div className="max-w-md mx-auto mt-12 neumorphic p-8 rounded-3xl">
            {/* Login Method Toggle */}
            <div className="flex neumorphic-inset rounded-2xl p-2 mb-6">
              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  loginMethod === "email" 
                    ? 'neumorphic-small text-green-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => {
                  setLoginMethod("phone");
                  setOtpSent(false);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  loginMethod === "phone" 
                    ? 'neumorphic-small text-green-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </button>
            </div>

            <div className="space-y-6">
              {loginMethod === "email" ? (
                  <form
                    onSubmit={e => { e.preventDefault(); handleStartForest(); }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-semibold text-left block">Email Address</Label>
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
                        <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-gray-700 font-semibold text-left block">Password</Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Enter your password"
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
                        <p className="text-red-500 text-sm mt-1 text-left">{errors.password}</p>
                      )}
                   
                    </div>

                    {/* <Button
                      type="submit"
                      className="w-full neumorphic py-4 rounded-2xl text-xl font-bold text-green-700 hover:shadow-lg transition-all duration-200"
                      disabled={loading || isLoadingOtp}
                    >
                      {loading ? 'Logging in...' : 'Start Your Forest'}
                    </Button> */}
                  </form>
              ) : (
                <>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold text-left block">Phone Number</Label>
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
                      <p className="text-red-500 text-sm mt-1 text-left">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {otpSent && (
                    <div>
                      <Label htmlFor="otp" className="text-gray-700 font-semibold text-left block">Enter OTP</Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="otp"
                          type="text"
                          value={formData.otp}
                          onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="123456"
                          className={`neumorphic-inset border-none pl-12 py-4 text-center text-lg tracking-widest ${errors.otp ? 'ring-2 ring-red-500' : ''}`}
                          maxLength={6}
                        />
                      </div>
                      {errors.otp && (
                        <p className="text-red-500 text-sm mt-1 text-left">{errors.otp}</p>
                      )}
                      <p className="text-xs text-gray-600 mt-2 text-left">
                        OTP sent to +91 {formData.phoneNumber}
                      </p>
                    </div>
                  )}

      
                </>
              )}
              <div className="text-right mt-2">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-green-600 hover:text-green-700 font-semibold"
                        >
                          Forgot Password?
                        </button>
              </div>
              <Button
                onClick={handleStartForest}
                className="w-full neumorphic py-4 rounded-2xl text-xl font-bold text-green-700 hover:shadow-lg transition-all duration-200"
                disabled={loading || isLoadingOtp}
              >
                {loading ? 'Logging in...' : 
                 isLoadingOtp ? 'Sending OTP...' : 
                 loginMethod === "phone" && !otpSent ? 'Send OTP' : 
                 'Start Your Forest'}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Google Login */}
              <Button
                onClick={handleGoogleLogin}
                className="w-full neumorphic py-4 rounded-2xl font-semibold text-gray-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={handleSignup}
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </main>
        
        {/* Features Section */}
        <section className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="neumorphic p-8 rounded-3xl">
                <div className="neumorphic-small p-4 rounded-2xl w-fit mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}