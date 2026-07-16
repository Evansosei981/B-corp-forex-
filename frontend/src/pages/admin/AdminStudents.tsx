import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/admin/students');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold mb-1 tracking-tight text-foreground">Student Management</h1>
        <p className="text-sm text-foreground-muted">View all registered students on the platform.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-foreground-muted">
                    <div className="animate-pulse">Loading students...</div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-foreground-muted">No students registered yet.</td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{student.firstName} {student.lastName}</div>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">{student.email}</td>
                    <td className="px-6 py-4 text-foreground-muted">{new Date(student.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
