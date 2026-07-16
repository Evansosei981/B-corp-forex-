import { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface Payment {
  id: number;
  student: {
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    title: string;
  };
  amount: number;
  proofUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/payments/${id}/${action}`);
      fetchPayments(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold mb-1 tracking-tight text-foreground">Payment Verification</h1>
        <p className="text-sm text-foreground-muted">Review and approve manual bank transfers.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider">Proof</th>
                <th className="px-6 py-3 font-semibold text-foreground-muted text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground-muted animate-pulse">Loading payments...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground-muted">No payments found.</td></tr>
              ) : payments.map(payment => (
                <tr key={payment.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{payment.student.firstName} {payment.student.lastName}</div>
                    <div className="text-xs text-foreground-muted mt-0.5">{payment.student.email}</div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{payment.course.title}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">${payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      payment.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      payment.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {payment.proofUrl ? (
                      <a href={payment.proofUrl} target="_blank" rel="noreferrer" className="text-gold-500 hover:text-gold-400 font-medium hover:underline text-sm flex items-center gap-1">
                        View Receipt
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    ) : (
                      <span className="text-foreground-muted text-sm italic">No receipt</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {payment.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(payment.id, 'approve')}
                          className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-green-500/20"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(payment.id, 'reject')}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-red-500/20"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
