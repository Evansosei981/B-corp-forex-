import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [settings, setSettings] = useState({
    'payment.bank.name': '',
    'payment.bank.accountName': '',
    'payment.bank.accountNo': ''
  });
  
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings({
          'payment.bank.name': response.data['payment.bank.name'] || 'Guaranty Trust Bank (GTB)',
          'payment.bank.accountName': response.data['payment.bank.accountName'] || 'B CORP FOREX ACADEMY',
          'payment.bank.accountNo': response.data['payment.bank.accountNo'] || '0123456789'
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSuccess('');
    setGlobalError('');
    try {
      setSaving(true);
      await api.post('/settings', settings);
      setGlobalSuccess('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setGlobalError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    try {
      setPasswordSaving(true);
      await api.put('/users/me', { 
        currentPassword: passwords.currentPassword, 
        newPassword: passwords.newPassword 
      });
      setPasswordSuccess('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      console.error(err);
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-foreground-muted animate-pulse">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold mb-1 tracking-tight text-foreground">Global Settings</h1>
        <p className="text-sm text-foreground-muted">Configure payment details and other application settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-lg font-bold text-foreground mb-6">Manual Payment Details (Bank Transfer)</h2>
        
        {globalSuccess && <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm">{globalSuccess}</div>}
        {globalError && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{globalError}</div>}
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Bank Name</label>
            <input 
              required
              value={settings['payment.bank.name']}
              onChange={e => handleChange('payment.bank.name', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Account Name</label>
            <input 
              required
              value={settings['payment.bank.accountName']}
              onChange={e => handleChange('payment.bank.accountName', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Account Number</label>
            <input 
              required
              value={settings['payment.bank.accountNo']}
              onChange={e => handleChange('payment.bank.accountNo', e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm transition-colors font-mono"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-background px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordUpdate} className="bg-surface border border-border rounded-xl p-6 shadow-sm max-w-2xl mt-8">
        <h2 className="text-lg font-bold text-foreground mb-6">Account Security</h2>
        
        {passwordSuccess && <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm">{passwordSuccess}</div>}
        {passwordError && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{passwordError}</div>}
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Current Password</label>
            <input 
              required
              type="password"
              value={passwords.currentPassword}
              onChange={e => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">New Password</label>
            <input 
              required
              type="password"
              value={passwords.newPassword}
              onChange={e => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm transition-colors"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button 
            type="submit" 
            disabled={passwordSaving}
            className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-background px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
