import { useState, useEffect } from 'react';
import { ShieldAlert, KeyRound, Save, RefreshCw, Trash2, Power, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEV_API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api/v1') + '/developer';

export default function DeveloperPortal() {
  const [devKey, setDevKey] = useState(sessionStorage.getItem('devKey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (devKey) {
      checkAuth(devKey);
    }
  }, []);

  const checkAuth = async (key: string) => {
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const res = await fetch(`${DEV_API_URL}/settings`, {
        headers: { 'X-Developer-Key': key }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setIsAuthenticated(true);
        sessionStorage.setItem('devKey', key);
      } else {
        setAuthError('Invalid Developer Key');
        sessionStorage.removeItem('devKey');
        setIsAuthenticated(false);
      }
    } catch (err) {
      setAuthError('Network error connecting to system core.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devKey) return;
    checkAuth(devKey);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('devKey');
    setIsAuthenticated(false);
    setDevKey('');
  };

  const saveSettings = async (updates: Record<string, string>) => {
    setSaveSuccess('');
    try {
      const res = await fetch(`${DEV_API_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Developer-Key': devKey
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, ...updates }));
        setSaveSuccess('System configurations updated securely.');
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        alert('Failed to save settings. Key might have expired.');
      }
    } catch (err) {
      alert('Network error saving settings.');
    }
  };

  const clearCache = async () => {
    if (!confirm('Are you sure you want to flush the system cache?')) return;
    try {
      const res = await fetch(`${DEV_API_URL}/system/clear-cache`, {
        method: 'POST',
        headers: { 'X-Developer-Key': devKey }
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
      } else {
        alert('Failed to clear cache.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-black relative overflow-hidden">
        {/* Hacker-esque background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="z-10 w-full max-w-md p-8 rounded-2xl border border-red-900/30 bg-black/50 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 rounded-full bg-red-950/30 mb-4 border border-red-900/50">
              <ShieldAlert className="size-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-widest uppercase">Restricted Area</h1>
            <p className="text-sm text-red-400 mt-2 font-mono">Developer clearance required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-red-500/50" />
                <input
                  type="password"
                  value={devKey}
                  onChange={(e) => setDevKey(e.target.value)}
                  placeholder="Enter access key..."
                  className="w-full bg-red-950/10 border border-red-900/30 rounded-xl py-3 pl-10 pr-4 text-white font-mono placeholder:text-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                  required
                />
              </div>
              {authError && <p className="text-red-400 text-sm mt-2 font-mono">{authError}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isAuthenticating || !devKey}
              className="w-full bg-red-900 hover:bg-red-800 text-white font-mono font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isAuthenticating ? 'VERIFYING...' : 'INITIALIZE UPLINK'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 font-mono mt-4">
              Return to public sector
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getVal = (key: string) => settings[key] || '';
  const getBool = (key: string) => settings[key] === 'true';

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-300 font-sans selection:bg-red-500/30">
      <header className="sticky top-0 z-50 border-b border-red-900/30 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="size-6 text-red-500" />
          <h1 className="font-mono text-xl font-bold text-white tracking-tight">SYSTEM_CORE // GOD_MODE</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            CONNECTION SECURE
          </span>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
            <Power className="size-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Admin Access Control */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-orange-500" />
              <h2 className="text-lg font-medium text-white">Admin Access Protocol</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={getBool('dev_adminLoginDisabled')} onChange={(e) => saveSettings({'dev_adminLoginDisabled': e.target.checked.toString()})} />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          {getBool('dev_adminLoginDisabled') && (
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Rejection Message</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={getVal('dev_adminDisabledMessage')}
                  onChange={(e) => handleChange('dev_adminDisabledMessage', e.target.value)}
                  placeholder="e.g. System is undergoing scheduled maintenance."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
                />
                <button onClick={() => saveSettings({'dev_adminDisabledMessage': getVal('dev_adminDisabledMessage')})} className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-xl flex items-center gap-2 transition-colors">
                  <Save className="size-4" /> Save
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Global Maintenance Mode */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Power className="size-5 text-red-500" />
              <h2 className="text-lg font-medium text-white">Global Maintenance Mode</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={getBool('dev_maintenanceMode')} onChange={(e) => saveSettings({'dev_maintenanceMode': e.target.checked.toString()})} />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          {getBool('dev_maintenanceMode') && (
            <div className="p-6 space-y-4">
              <p className="text-sm text-red-400">WARNING: All public and student routes will instantly redirect to the Maintenance Screen.</p>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Maintenance Message</label>
                <textarea
                  rows={3}
                  value={getVal('dev_maintenanceMessage')}
                  onChange={(e) => handleChange('dev_maintenanceMessage', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
                  placeholder="We are currently upgrading the system..."
                />
              </div>
              <div className="flex justify-end">
                <button onClick={() => saveSettings({'dev_maintenanceMessage': getVal('dev_maintenanceMessage')})} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                  <Save className="size-4" /> Save Message
                </button>
              </div>
            </div>
          )}
        </section>

        {/* System Announcements */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-3">
              <AlertCircle className="size-5 text-blue-500" />
              Global Announcements
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                <input
                  type="text"
                  value={getVal('dev_announcementTitle')}
                  onChange={(e) => handleChange('dev_announcementTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="e.g. Scheduled Downtime"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                <select
                  value={getVal('dev_announcementType') || 'INFO'}
                  onChange={(e) => handleChange('dev_announcementType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="INFO">Information (Blue)</option>
                  <option value="WARNING">Warning (Yellow)</option>
                  <option value="ERROR">Critical (Red)</option>
                  <option value="SUCCESS">Success (Green)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Message (Leave empty to disable banner)</label>
              <textarea
                rows={2}
                value={getVal('dev_announcementMessage')}
                onChange={(e) => handleChange('dev_announcementMessage', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                placeholder="Message content..."
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={() => {
                  handleChange('dev_announcementTitle', '');
                  handleChange('dev_announcementMessage', '');
                  saveSettings({'dev_announcementTitle': '', 'dev_announcementMessage': ''});
                }} 
                className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
              >
                <Trash2 className="size-4" /> Clear Announcement
              </button>
              <button onClick={() => saveSettings({
                'dev_announcementTitle': getVal('dev_announcementTitle'),
                'dev_announcementMessage': getVal('dev_announcementMessage'),
                'dev_announcementType': getVal('dev_announcementType') || 'INFO'
              })} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                <Save className="size-4" /> Publish Banner
              </button>
            </div>
          </div>
        </section>

        {/* System Controls */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-3">
              <RefreshCw className="size-5 text-purple-500" />
              System Controls
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button onClick={clearCache} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 text-white p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group">
              <div className="p-3 bg-slate-900 rounded-full group-hover:bg-purple-500/20 transition-colors">
                <RefreshCw className="size-6 text-purple-400" />
              </div>
              <span className="font-medium">Purge System Cache</span>
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500/50 text-white p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group">
              <div className="p-3 bg-slate-900 rounded-full group-hover:bg-slate-700 transition-colors">
                <Trash2 className="size-6 text-slate-400" />
              </div>
              <span className="font-medium">Clear Temp Files</span>
            </button>
          </div>
        </section>

      </main>

      {/* Floating Save Indicator */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5" />
          <span className="font-medium">{saveSuccess}</span>
        </div>
      )}
    </div>
  );
}
