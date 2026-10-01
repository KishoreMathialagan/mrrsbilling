'use client';

import { useState } from 'react';
import { addAdmin, updateProfile, deleteAdmin, updateSettings } from './actions';
import { User, Trash2 } from 'lucide-react';

type Admin = {
  id: string;
  username: string;
  createdAt: string;
};

type Settings = {
  gstRate: string | number;
};

export default function AdminClient({ admins, currentAdminId, settings }: { admins: Admin[], currentAdminId: string, settings: Settings }) {
  // Add Admin State
  const [addUsername, setAddUsername] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Profile State
  const currentAdmin = admins.find(a => a.id === currentAdminId);
  const [editUsername, setEditUsername] = useState(currentAdmin?.username || '');
  const [editPassword, setEditPassword] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Settings State
  const [gstRate, setGstRate] = useState(settings.gstRate.toString());
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    const formData = new FormData();
    formData.append('username', addUsername);
    formData.append('password', addPassword);
    
    const res = await addAdmin(formData);
    setAddLoading(false);
    if (res.error) {
      setAddError(res.error);
    } else {
      setAddUsername('');
      setAddPassword('');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess(false);
    setEditLoading(true);
    const formData = new FormData();
    formData.append('username', editUsername);
    if (editPassword) {
      formData.append('password', editPassword);
    }
    
    const res = await updateProfile(formData);
    setEditLoading(false);
    if (res.error) {
      setEditError(res.error);
    } else {
      setEditSuccess(true);
      setEditPassword('');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      await deleteAdmin(id);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess(false);
    setSettingsLoading(true);
    const formData = new FormData();
    formData.append('gstRate', gstRate);
    
    const res = await updateSettings(formData);
    setSettingsLoading(false);
    if (res.error) {
      setSettingsError(res.error);
    } else {
      setSettingsSuccess(true);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Settings & Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#111] focus:border-transparent transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reset Password (optional)</label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#111] focus:border-transparent transition-all outline-none"
                placeholder="Leave blank to keep current"
              />
            </div>
            
            {editError && <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg">{editError}</div>}
            {editSuccess && <div className="text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg">Profile updated successfully.</div>}

            <button
              type="submit"
              disabled={editLoading}
              className="w-full bg-[#111] text-white font-bold py-3 px-4 rounded-xl hover:bg-black transition-colors disabled:opacity-70"
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Global Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
          <form onSubmit={handleUpdateSettings} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">GST Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#111] focus:border-transparent transition-all outline-none"
                required
              />
            </div>
            
            {settingsError && <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg">{settingsError}</div>}
            {settingsSuccess && <div className="text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg">Settings updated successfully.</div>}

            <button
              type="submit"
              disabled={settingsLoading}
              className="w-full bg-[#111] text-white font-bold py-3 px-4 rounded-xl hover:bg-black transition-colors disabled:opacity-70"
            >
              {settingsLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

      </div>

      {/* Manage Admins Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Admins</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Add New Admin Form */}
          <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Admin</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={addUsername}
                  onChange={(e) => setAddUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#111] focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#111] focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
              {addError && <div className="text-sm text-red-500 font-medium">{addError}</div>}
              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-[#FFBC11] text-black font-bold py-2.5 px-4 rounded-xl hover:bg-[#e5a80f] transition-colors disabled:opacity-70"
              >
                {addLoading ? 'Adding...' : 'Add Admin'}
              </button>
            </form>
          </div>

          {/* Admin List */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Existing Admins</h3>
            <div className="space-y-3">
              {admins.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{admin.username.charAt(0).toUpperCase() + admin.username.slice(1)}</div>
                      <div className="text-xs text-gray-500 font-medium">Added {new Date(admin.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {admin.id !== currentAdminId && (
                    <button 
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  {admin.id === currentAdminId && (
                    <span className="text-xs font-bold text-[#FFBC11] bg-[#FFBC11]/10 px-2.5 py-1 rounded-md">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
