
import React, { useState, useEffect } from "react";
import { profile, updateProfile, savedFamilyMember, getMembers, deletefamilymember,deleteAccount } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User as UserIcon, Users, Phone, MapPin, Calendar, Plus, Trash2, ShieldAlert, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) throw new Error('No user in localStorage');
      
      // Get user profile data
      const response = await profile(storedUser.id || storedUser._id);
      console.log('Profile response:', response);
      
      if (!response) throw new Error('No data received from profile API');
      
      // The response is the user data directly (auth.js already extracts response.data)
      const userData = response;
      setUser(userData);
      
      // Fetch family members from API and normalize keys
      const membersResponse = await getMembers();
      const normalizedMembers = (membersResponse?.familyMembers || []).map(m => ({
        ...m,
        date_of_birth: m.dateOfBirth || m.date_of_birth || '',
        email: m.email || ''
      }));
      
      // Update form data with user details
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        date_of_birth: userData.date_of_birth || userData.dateOfBirth || '',
        phone_number: userData.phone_number || '',
        address: userData.address || '',
        family_members: normalizedMembers
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFamilyMember = () => {
  setFormData(prev => ({
    ...prev,
    family_members: [
      ...(prev.family_members || []),
      { name: '', date_of_birth: '', relationship: '', email: '', phone_number: '' }
    ]
  }));
};

  // Corrected function name and added validation
  const updateFamilyMember = (index, field, value) => {
    setFormData(prev => {
      const updatedMembers = prev.family_members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      );
      return { ...prev, family_members: updatedMembers };
    });
  };

  // Validation for family members
  const validateFamilyMembers = () => {
    const errors = [];
    formData.family_members.forEach((member, idx) => {
      const memberErrors = {};
      if (!member.name || member.name.trim() === "") {
        memberErrors.name = "Name is required.";
      }
      if (!member.relationship || member.relationship.trim() === "") {
        memberErrors.relationship = "Relationship is required.";
      }
      errors[idx] = memberErrors;
    });
    return errors;
  };

  // Remove family member using API
  const removeFamilyMember = async (index, member) => {
    try {
      if (member._id) {
        await deletefamilymember(member._id);
        await loadUserData();
      } else {
        // If not saved yet, just remove from local state
        setFormData(prev => ({
          ...prev,
          family_members: prev.family_members.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      alert('Error deleting family member.');
    }
  };


  const validateProfile = () => {
    const errors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name is required and must be at least 2 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'A valid email is required.';
    }
    return errors;
  };

  const [formErrors, setFormErrors] = useState({});

  const handleSave = async () => {
    const errors = validateProfile();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) throw new Error('User not found in localStorage');
      
      // Prepare the update data
      const updateData = {
        ...formData,
        _id: storedUser.id || storedUser._id
      };
      
      // Remove any undefined or null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });
      
      console.log('Updating profile with data:', updateData);
      const updatedUser = await updateProfile(updateData);
      
      // Update local storage with the new user data
      if (updatedUser) {
        const newUserData = {
          ...storedUser,
          ...updatedUser,
          // Ensure we keep the token
          token: storedUser.token
        };
        localStorage.setItem('user', JSON.stringify(newUserData));
        console.log('Profile updated successfully');
      }
      
      // Refresh the user data
      await loadUserData();
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error updating profile. Please try again.";
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    // Reset to the current user data but keep any unsaved family members
    setFormData(prev => ({
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      // Keep the current family members in the form state
      family_members: prev.family_members || []
    }));
    setFormErrors({});
    setIsEditing(false);
  };
  const handleNavigateToResetPassword = () => {
    navigate(createPageUrl("ResetPassword"));
  };
  const handleDeleteAccount = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await deleteAccount(storedUser.id || storedUser._id);
      localStorage.removeItem('user');
      setShowDeleteConfirm(false);
      alert("Your account has been deleted.");
      window.location.href = '/welcome';
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting your account. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/welcome';
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="neumorphic p-8 rounded-3xl animate-pulse">
          <div className="h-8 bg-gray-300 rounded-2xl w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded-xl w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="neumorphic p-8 rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="neumorphic-small p-6 rounded-2xl">
              <UserIcon className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="neumorphic-small px-4 py-3 rounded-2xl font-semibold text-gray-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <Button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setFormData(prev => ({
                    ...prev,
                    family_members: prev.family_members || []
                  }));
                  setIsEditing(true);
                }
              }}
              className="neumorphic-small px-6 py-3 rounded-2xl font-semibold text-blue-700"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="neumorphic p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
            {isEditing ? (
              <>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => updateFormData('name', e.target.value)}
                  placeholder="Enter your name"
                  className="neumorphic-inset border-none mt-2"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </>
            ) : (
              <div className="neumorphic-inset p-4 rounded-2xl mt-2">
                <span className="text-gray-800">{user?.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
            {isEditing ? (
              <>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={e => updateFormData('email', e.target.value)}
                  placeholder="Enter your email"
                  className="neumorphic-inset border-none mt-2"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </>
            ) : (
              <div className="neumorphic-inset p-4 rounded-2xl mt-2">
                <span className="text-gray-800">{user?.email}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="date_of_birth" className="text-gray-700 font-semibold">Date of Birth</Label>
{isEditing ? (
  <Input
    id="date_of_birth"
    type="date"
    value={formData.date_of_birth ? formData.date_of_birth.substring(0, 10) : ''}
    onChange={e => updateFormData('date_of_birth', e.target.value)}
    placeholder="YYYY-MM-DD"
    className="neumorphic-inset border-none mt-2"
  />
) : (
  <div className="bg-lime-600 text-slate-100 mt-2 p-4 neumorphic-inset rounded-2xl">
    <span className="text-gray-800">
      {user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not set'}
    </span>
  </div>
)}
          </div>

          <div>
            <Label htmlFor="phone_number" className="text-gray-700 font-semibold">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => updateFormData('phone_number', e.target.value)}
                placeholder="Enter phone number"
                className="neumorphic-inset border-none mt-2"
              />
            ) : (
              <div className="neumorphic-inset p-4 rounded-2xl mt-2">
                <span className="text-gray-800">{user?.phone_number || 'Not set'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="address" className="text-gray-700 font-semibold">Address</Label>
          {isEditing ? (
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder="Enter your address"
              className="neumorphic-inset border-none mt-2"
            />
          ) : (
            <div className="neumorphic-inset p-4 rounded-2xl mt-2">
              <span className="text-gray-800">{user?.address || 'Not set'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Family Members */}
      <div className="neumorphic p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Family Members</h2>
          {isEditing && (
            <Button
              onClick={addFamilyMember}
              className="neumorphic-small px-4 py-2 rounded-2xl font-semibold text-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          )}
        </div>

        {formData.family_members && formData.family_members.length > 0 ? (
          <div className="space-y-4">
            {formData.family_members.map((member, index) => (
              <div key={index} className="neumorphic-inset p-6 rounded-2xl">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label className="text-gray-700 font-semibold">Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                        placeholder="Member name"
                        className="neumorphic-inset border-none mt-1"
                      />
                    </div>
                    {/* <div>
                      <Label className="text-gray-700 font-semibold">Relationship</Label>
                      <Input
                        value={member.relationship}
                        onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                        placeholder="e.g., Spouse, Child"
                        className="neumorphic-inset border-none mt-1"
                      />
                    </div> */}
                    <div>
                      <Label className="text-gray-700 font-semibold">Email</Label>
                      <Input
                        type="email"
                        value={member.email || ''}
                        onChange={(e) => updateFamilyMember(index, 'email', e.target.value)}
                        placeholder="Email address"
                        className="neumorphic-inset border-none mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Phone Number</Label>
                      <Input
                        type="tel"
                        value={member.phone_number || ''}
                        onChange={(e) => updateFamilyMember(index, 'phone_number', e.target.value)}
                        placeholder="Phone number"
                        className="neumorphic-inset border-none mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Date of Birth</Label>
                      <Input
                        type="date"
                        value={member.date_of_birth}
                        onChange={(e) => updateFamilyMember(index, 'date_of_birth', e.target.value)}
                        className="neumorphic-inset border-none mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-semibold">Relationship</Label>
                      <div className="flex gap-2">
                        <Input
                          value={member.relationship}
                          onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                          placeholder="e.g., Spouse, Child"
                          className="neumorphic-inset border-none mt-1 flex-1"
                        />
                        <Button
                          onClick={() => removeFamilyMember(index, member)}
                          className="neumorphic-small p-3 rounded-xl text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="neumorphic-small p-3 rounded-xl">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{member.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {member.relationship} • Born {new Date(member.date_of_birth).toLocaleDateString()}
                        {member.phone_number && (
                          <span className="block text-gray-500">
                            <Phone className="inline w-3 h-3 mr-1" />
                            {member.phone_number}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No family members added</p>
            {isEditing && (
              <p className="text-sm text-gray-500">Click "Add Member" to include family members</p>
            )}
          </div>
    )}
  </div>

  {/* Save Member Button after family members list */}
  {isEditing && formData.family_members && formData.family_members.some(member => !member._id && (member.name || member.relationship || member.date_of_birth || member.phone_number || member.email)) && (
    <Button
      className="mt-4 neumorphic-small px-6 py-3 rounded-2xl font-semibold text-green-700"
      onClick={async () => {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          let anySaved = false;
          for (const member of formData.family_members) {
            if (!member._id && (member.name || member.relationship || member.date_of_birth || member.email)) {
              await savedFamilyMember({
                  name: member.name,
                  relationship: member.relationship,
                  dateOfBirth: member.date_of_birth,
                  email: member.email,
                  phone_number: member.phone_number,
                  user_id: storedUser.id || storedUser._id
                });
              anySaved = true;
            }
          }
          if (anySaved) {
            alert('Family member(s) saved!');
            await loadUserData();
          } else {
            alert('No new family member to save.');
          }
        } catch (error) {
          alert('Error saving family member(s).');
        }
      }}
    >
      Save Member
    </Button>
  )}

  {/* Tree Planting Stats */}
      <div className="neumorphic p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tree Planting Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neumorphic-inset p-6 rounded-2xl text-center">
            <p className="text-3xl font-bold text-green-600">{user?.total_trees_planted || 0}</p>
            <p className="text-gray-600 mt-1">Total Trees</p>
          </div>
          <div className="neumorphic-inset p-6 rounded-2xl text-center">
            <p className="text-3xl font-bold text-blue-600">{user?.trees_self_planted || 0}</p>
            <p className="text-gray-600 mt-1">Self Planted</p>
          </div>
          <div className="neumorphic-inset p-6 rounded-2xl text-center">
            <p className="text-3xl font-bold text-purple-600">{user?.trees_org_planted || 0}</p>
            <p className="text-gray-600 mt-1">Organization Planted</p>
          </div>
        </div>

        <div className="mt-6 neumorphic-inset p-4 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Progress to 1,000,000 trees</span>
            <span className="text-green-600 font-bold">
              {((user?.total_trees_planted || 0) / 1000000 * 100).toFixed(3)}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleCancel}
            className="neumorphic-small px-6 py-3 rounded-2xl font-semibold text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="neumorphic-small px-6 py-3 rounded-2xl font-semibold text-green-700"
          >
            Save Changes
          </Button>
        </div>
      )}

      {/* Danger Zone */}
      <div className="neumorphic p-8 rounded-3xl border-2 border-red-300">
        <div className="flex items-center gap-4 mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-red-700">Danger Zone</h2>
        </div>
        <p className="text-gray-600 mb-4">
          These actions are permanent and cannot be undone. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleNavigateToResetPassword}
            className="neumorphic-small px-6 py-3 rounded-2xl font-semibold text-blue-700"
          >
            Change Password
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            className="neumorphic-small px-6 py-3 rounded-2xl font-semibold bg-red-500 hover:bg-red-600 text-white"
          >
            Delete My Account
          </Button>
        </div>

      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="neumorphic p-8 rounded-3xl border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-700">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              This action cannot be undone. This will permanently delete your account and all associated data, including your tree planting history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-4">
            <Button 
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 neumorphic-small px-6 py-3 rounded-2xl font-semibold text-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="flex-1 neumorphic-small px-6 py-3 rounded-2xl font-semibold bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
