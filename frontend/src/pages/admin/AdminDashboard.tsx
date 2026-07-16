import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 400 },
  { name: 'Tue', revenue: 600 },
  { name: 'Wed', revenue: 550 },
  { name: 'Thu', revenue: 800 },
  { name: 'Fri', revenue: 950 },
  { name: 'Sat', revenue: 700 },
  { name: 'Sun', revenue: 1100 }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    activeCourses: 0,
    recentSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold mb-1 tracking-tight text-foreground">Overview</h1>
        <p className="text-sm text-foreground-muted">Welcome back! Here's what's happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-foreground-muted">Total Revenue</h3>
            <div className="p-2 bg-gold-500/10 rounded-md">
              <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {loading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
          </p>
        </div>
        
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-foreground-muted">Total Students</h3>
            <div className="p-2 bg-gold-500/10 rounded-md">
              <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {loading ? '...' : stats.totalStudents}
          </p>
        </div>
        
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-foreground-muted">Active Courses</h3>
            <div className="p-2 bg-gold-500/10 rounded-md">
              <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {loading ? '...' : stats.activeCourses}
          </p>
        </div>
        
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-foreground-muted">Recent Sales</h3>
            <div className="p-2 bg-gold-500/10 rounded-md">
              <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {loading ? '...' : stats.recentSales}
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 h-[300px] sm:h-96 w-full shadow-sm flex flex-col">
        <h3 className="text-lg font-medium text-foreground mb-4 sm:mb-6 tracking-tight">Analytics Dashboard</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', color: '#e4e4e7' }}
                itemStyle={{ color: '#eab308', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
