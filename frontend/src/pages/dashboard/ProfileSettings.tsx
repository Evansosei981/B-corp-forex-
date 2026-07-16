import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export default function ProfileSettings() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.put('/users/me', {
        firstName,
        lastName,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      
      setMessage('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      
      // Update local storage user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.firstName = res.data.firstName;
      userData.lastName = res.data.lastName;
      localStorage.setItem('user', JSON.stringify(userData));
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <Link to="/dashboard" className="text-foreground-muted hover:text-foreground">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-sm text-foreground-muted">Update your account details and password.</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 md:p-8 rounded-xl shadow-sm">
          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                disabled
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground-muted opacity-60 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-foreground-muted mt-1">Email cannot be changed.</p>
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <h3 className="text-lg font-bold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-background px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
