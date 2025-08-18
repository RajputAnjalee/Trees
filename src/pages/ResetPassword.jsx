import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TreePine, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { resetPassword } from "@/api/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const validatePassword = (password) => {
    // Strong password: at least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleChangePassword = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Prepare the data for the API call
        const resetData = {
          _id: JSON.parse(localStorage.getItem('user'))._id,
          oldpassword: formData.oldPassword,
          newpassword: formData.newPassword
        };

        // Call the reset password API
        const response = await resetPassword(resetData);
        
        if (response.code === 200) {
          setResetSuccess(true);
        } else {
          setErrors({ submit: response.msg || 'Failed to reset password' });
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        setErrors({ submit: error.message || 'An error occurred while resetting your password' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToProfile = () => {
    navigate(createPageUrl("Profile"));
  };

  // Success state view
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="neumorphic-small p-6 rounded-3xl inline-block mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Password Updated!</h1>
            <p className="text-gray-600 mb-6">
              Your password has been successfully changed.
            </p>
          </div>

          <div className="neumorphic p-6 rounded-3xl text-center">
            <Button
              onClick={handleBackToProfile}
              className="w-full neumorphic py-4 rounded-2xl text-lg font-bold text-green-700"
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBackToProfile}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="neumorphic-small p-6 rounded-3xl inline-block mb-6">
            <TreePine className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Change Password</h1>
          <p className="text-gray-600">
            Update your password below for better security.
          </p>
        </div>

        {/* Change Password Form */}
        <div className="neumorphic p-8 rounded-3xl">
          <div className="space-y-6">
            {/* Old Password */}
            <div>
              <Label htmlFor="oldPassword" className="text-gray-700 font-semibold">Old Password</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={(e) => handleInputChange("oldPassword", e.target.value)}
                  placeholder="Enter your old password"
                  className={`neumorphic-inset border-none pl-12 pr-12 py-4 ${errors.oldPassword ? 'ring-2 ring-red-500' : ''}`}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowOldPassword(!showOldPassword)}>
                  {showOldPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>}
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="text-gray-700 font-semibold">New Password</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  placeholder="Enter new password"
                  className={`neumorphic-inset border-none pl-12 pr-12 py-4 ${errors.newPassword ? 'ring-2 ring-red-500' : ''}`}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
               <p className="text-xs text-gray-600 mt-1">
                Must contain at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Confirm New Password</Label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm new password"
                  className={`neumorphic-inset border-none pl-12 pr-12 py-4 ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {errors.submit}
              </div>
            )}
            <Button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="w-full neumorphic py-4 rounded-2xl text-lg font-bold text-green-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}