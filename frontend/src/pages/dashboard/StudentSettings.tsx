import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';

export default function StudentSettings() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingProfile(true);
    
    try {
      const response = await api.put('/users/me', { firstName, lastName });
      // Update local storage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        firstName: response.data.firstName,
        lastName: response.data.lastName
      }));
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingPassword(true);
    
    try {
      await api.put('/users/me', { currentPassword, newPassword });
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center bg-background">Loading...</div>;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader active="Settings" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 flex-1">
        
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your personal information and security preferences.</p>
        </div>

        {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm font-medium">{error}</div>}
        {success && <div className="p-4 bg-success/10 text-success rounded-lg border border-success/20 text-sm font-medium">{success}</div>}

        {/* Profile Settings */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name</label>
                <input 
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <input 
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input 
                disabled
                value={email}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-muted-foreground text-sm cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Security</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <input 
                required
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <input 
                required
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-colors"
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters, and contain 1 uppercase letter and 1 number.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="secondary" disabled={savingPassword || !currentPassword || !newPassword}>
                {savingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
