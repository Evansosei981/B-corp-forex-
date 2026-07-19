import { AlertTriangle } from 'lucide-react';

export default function MaintenancePage({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
      {/* Blurred background image/overlay */}
      <div className="absolute inset-0 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
      </div>

      <div className="relative z-20 flex flex-col items-center max-w-2xl mx-auto">
        <div className="bg-white/10 p-5 rounded-full backdrop-blur-xl border border-white/20 mb-8 shadow-2xl">
          <AlertTriangle className="size-16 text-blue-400" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Site Under Maintenance
        </h1>
        
        <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-lg">
          {message || "We are currently upgrading our systems to serve you better. Please check back soon!"}
        </p>

        {/* Pulsing loading indicator */}
        <div className="flex items-center gap-3 text-blue-400 font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          System upgrades in progress...
        </div>
      </div>
    </div>
  );
}
