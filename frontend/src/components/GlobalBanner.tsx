import { useState, useEffect } from 'react';
import { X, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';


const DEV_API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api/v1') + '/developer';

export function GlobalBanner() {
  const [announcement, setAnnouncement] = useState<{ title: string; message: string; type: string } | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${DEV_API_URL}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.announcementMessage) {
            setAnnouncement({
              title: data.announcementTitle,
              message: data.announcementMessage,
              type: data.announcementType || 'INFO'
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch system status');
      }
    };
    fetchStatus();
    
    // Poll every minute for updates
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!announcement || !isVisible || !announcement.message) return null;

  const styleConfig = {
    INFO: { bg: 'bg-blue-600', icon: Info, border: 'border-blue-500', text: 'text-white' },
    WARNING: { bg: 'bg-yellow-500', icon: AlertTriangle, border: 'border-yellow-400', text: 'text-yellow-950' },
    ERROR: { bg: 'bg-red-600', icon: AlertCircle, border: 'border-red-500', text: 'text-white' },
    SUCCESS: { bg: 'bg-green-600', icon: CheckCircle2, border: 'border-green-500', text: 'text-white' },
  };

  const config = styleConfig[announcement.type as keyof typeof styleConfig] || styleConfig.INFO;
  const Icon = config.icon;

  return (
    <div className={`w-full ${config.bg} ${config.text} px-4 py-3 flex items-start sm:items-center justify-between border-b ${config.border} shadow-sm z-50 relative`}>
      <div className="flex items-start sm:items-center gap-3 flex-1">
        <Icon className="size-5 shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          {announcement.title && (
            <span className="font-bold tracking-tight">{announcement.title}</span>
          )}
          {announcement.title && <span className="hidden sm:inline opacity-50">•</span>}
          <span className="text-sm font-medium opacity-90">{announcement.message}</span>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)} 
        className="p-1 hover:bg-black/10 rounded-full transition-colors ml-4 shrink-0"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
