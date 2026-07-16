import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Course } from '../../utils/types';
import { Logo } from '@/components/logo';

export default function CourseCheckout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate(`/login?redirect=/checkout/${id}`);
      return;
    }

    const fetchCourseAndSettings = async () => {
      try {
        const [courseRes, settingsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/settings')
        ]);
        setCourse(courseRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndSettings();
  }, [id, navigate]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      setUploading(true);
      
      // Submit Payment record to backend directly
      await api.post('/payments/submit', {
        courseId: course.id,
        proofUrl: null
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit payment.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-foreground-muted min-h-screen bg-background">Loading...</div>;
  if (!course) return <div className="p-8 text-foreground-muted min-h-screen bg-background">Course not found.</div>;

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Payment Submitted</h2>
          <p className="text-sm text-foreground-muted mb-8">
            Your payment confirmation has been sent to our admins. They will verify the bank transfer shortly. You will gain access to the course immediately upon approval.
          </p>
          <Link to="/dashboard" className="block w-full bg-gold-500 hover:bg-gold-400 text-background font-semibold py-2.5 rounded-lg transition-colors text-sm">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Course Summary */}
        <div className="bg-surface border border-border rounded-xl p-8 h-fit shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6 tracking-tight">Order Summary</h2>
          <div className="h-48 bg-background rounded-lg mb-6 relative overflow-hidden border border-border">
             {course.thumbnailUrl ? (
               <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center opacity-40 grayscale blur-[1px]">
                 <Logo className="scale-150" />
               </div>
             )}
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight line-clamp-2">{course.title}</h3>
          <p className="text-sm text-foreground-muted mb-8 line-clamp-3">{course.description}</p>
          
          <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
            <span className="text-foreground font-medium text-sm">Total</span>
            <span className="text-2xl font-bold text-gold-500">${course.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6 tracking-tight">Payment Details</h2>
          
          <div className="bg-background border border-border rounded-lg p-6 mb-8">
            <p className="text-foreground-muted text-sm mb-4">Please transfer the exact amount to the following bank account to gain access to the course:</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center"><span className="text-foreground-muted">Bank Name</span> <span className="font-medium text-foreground">{settings['payment.bank.name'] || 'Guaranty Trust Bank (GTB)'}</span></div>
              <div className="flex justify-between items-center"><span className="text-foreground-muted">Account Name</span> <span className="font-medium text-foreground">{settings['payment.bank.accountName'] || 'B CORP FOREX ACADEMY'}</span></div>
              <div className="flex justify-between items-center"><span className="text-foreground-muted">Account No</span> <span className="font-mono text-foreground tracking-wider">{settings['payment.bank.accountNo'] || '0123456789'}</span></div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border"><span className="text-foreground-muted">Amount</span> <span className="text-gold-500 font-bold">${course.price.toFixed(2)}</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmitPayment}>
            <button 
              type="submit" 
              disabled={uploading}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {uploading ? 'Submitting...' : 'I have made the payment'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
