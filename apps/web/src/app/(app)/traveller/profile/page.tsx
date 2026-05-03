'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardBody, Input } from '@heroui/react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authApiWithoutSession } from '../../../../services/auth';
import toast from 'react-hot-toast';

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: '',
        location: '',
      });
    }
  }, []);

  const [savedFormData, setSavedFormData] = useState(formData);

  const handleSave = () => {
    setSavedFormData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(savedFormData);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired, please log in again');
      return;
    }

    setPasswordLoading(true);
    try {
      await authApiWithoutSession.changePassword(
        { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
        token,
      );
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass = {
    base: "flex-1",
    inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
    input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
  };

  return (
    <div className="space-y-6 p-4">

      <div>
        <p className="text-(--muted-foreground)">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Header */}
      <Card className='border border-(--border) rounded-lg p-4'>
        <CardBody className="">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-(--primary)/20 flex items-center justify-center">
              <FaUser className="w-12 h-12 text-(--primary)" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-(--foreground)">{formData.fullName}</h2>
              <p className="text-(--muted-foreground)">{formData.email}</p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="space-y-2">
              <label htmlFor="name">Full Name</label>
              <div className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}>
                <FaUser className="h-5 w-5 ml-2 text-(--muted-foreground)" />
                <Input
                  value={formData.fullName}
                  onValueChange={(value) => setFormData({ ...formData, fullName: value })}
                  isDisabled={!isEditing}
                  classNames={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <div className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}>
                <FaEnvelope className="h-5 w-5 ml-2 text-(--muted-foreground)" />
                <Input
                  type="email"
                  value={formData.email}
                  onValueChange={(value) => setFormData({ ...formData, email: value })}
                  isDisabled={!isEditing}
                  classNames={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="Phone">Phone</label>
              <div className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}>
                <Input
                  value={formData.phone}
                  onValueChange={(value) => setFormData({ ...formData, phone: value })}
                  isDisabled={!isEditing}
                  classNames={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="Location">Location</label>
              <div className={`border border-(--border) rounded-lg flex items-center mt-2 h-10`}>
                <Input
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                  isDisabled={!isEditing}
                  classNames={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {isEditing ? (
              <>
                <Button className='bg-(--primary) text-(--primary-foreground) rounded-lg' onPress={handleSave}>
                  Save Changes
                </Button>
                <Button className='rounded-lg border border-(--border)' onPress={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button className='bg-(--primary) text-(--primary-foreground) rounded-lg' onPress={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

        </CardBody>
      </Card>

      {/* Security Section */}
      <Card className='border border-(--border) rounded-lg p-4'>
        <CardBody>
          <div className="flex items-center gap-3 mb-4">
            <FaLock className="w-6 h-6 text-(--primary)" />
            <h3 className="text-xl font-bold text-(--foreground)">Security</h3>
          </div>
          <p className="text-(--muted-foreground) mb-4">
            Manage your password and security settings
          </p>

          {!showChangePassword ? (
            <Button variant="bordered" className='rounded-lg border border-(--border)' onPress={() => setShowChangePassword(true)}>
              Change Password
            </Button>
          ) : (
            <div className="space-y-4 max-w-md">
              {/* Current Password */}
              <div className="space-y-2">
                <label>Current Password</label>
                <div className="border border-(--border) relative rounded-lg flex items-center mt-2 h-10">
                  <FaLock className="h-4 w-4 ml-2 text-(--muted-foreground)" />
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onValueChange={(v) => setPasswordForm({ ...passwordForm, currentPassword: v })}
                    classNames={inputClass}
                  />
                  <button type="button" className="absolute right-1 text-(--muted-foreground) hover:text-(--foreground)"
                    onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}   >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label>New Password</label>
                <div className="border relative border-(--border) rounded-lg flex items-center mt-2 h-10">
                  <FaLock className="h-4 w-4 ml-2 text-(--muted-foreground)" />
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onValueChange={(v) => setPasswordForm({ ...passwordForm, newPassword: v })}
                    classNames={inputClass}
                  />
                  <button className="absolute right-1 text-(--muted-foreground) hover:text-(--foreground)" type="button" onClick={() => setShowPasswords(s => ({ ...s, new: !s.new }))} >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label>Confirm New Password</label>
                <div className="border border-(--border) rounded-lg flex items-center mt-2 h-10">
                  <FaLock className="h-4 w-4 ml-2 text-(--muted-foreground)" />
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onValueChange={(v) => setPasswordForm({ ...passwordForm, confirmPassword: v })}
                    classNames={inputClass}
                  />
                  <button className="absolute right-1 text-(--muted-foreground) hover:text-(--foreground)" type="button" onClick={() => setShowPasswords(s => ({ ...s, confirm: !s.confirm }))} >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className='bg-(--primary) text-(--primary-foreground) rounded-lg'
                  onPress={handleChangePassword}
                  isLoading={passwordLoading}
                  isDisabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                >
                  Update Password
                </Button>
                <Button
                  className='rounded-lg border border-(--border)'
                  onPress={() => {
                    setShowChangePassword(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

    </div>
  );
}
