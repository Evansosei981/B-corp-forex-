import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Course } from '../../utils/types';
import { Logo } from '@/components/logo';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export default function CourseCheckout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setReceiptUrl(res.data.url);
    } catch (err) {
      console.error('Failed to upload receipt', err);
      alert('Failed to upload receipt. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      setSubmitting(true);
      
      // Submit Payment record to backend directly
      await api.post('/payments/submit', {
        courseId: course.id,
        proofUrl: receiptUrl
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit payment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-foreground-muted min-h-screen bg-background">Loading...</div>;
  if (!course) return <div className="p-8 text-foreground-muted min-h-screen bg-background">Course not found.</div>;

  if (success) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const waNumber = settings['payment.admin.whatsapp'] || "1234567890";
    const message = encodeURIComponent(`Hi Admin! I just paid for the course '${course.title}'. My email is ${user.email}. Here is my receipt:`);
    const waLink = `https://wa.me/${waNumber}?text=${message}`;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Payment Recorded!</h2>
          <p className="text-sm text-foreground-muted mb-8 leading-relaxed">
            Your payment is now pending in our system. <br/><br/>
            <strong className="text-foreground">Final Step:</strong> Click the button below to message the admin on WhatsApp. 
            <span className="text-gold-500 font-bold"> Don't forget to attach a screenshot of your receipt!</span>
          </p>
          
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-lg transition-colors text-sm mb-4"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.122.548 4.195 1.587 6.02L.038 24l6.113-1.602a11.96 11.96 0 005.88 1.545v.001c6.645 0 12.029-5.383 12.029-12.031C24.06 5.383 18.678 0 12.031 0zm0 21.968c-1.782 0-3.528-.479-5.06-1.386l-.363-.214-3.766.986.999-3.67-.235-.374a9.92 9.92 0 01-1.522-5.312C2.084 5.485 7.55 0 14.196 0 20.844 0 26.31 5.485 26.31 12.031c0 6.645-5.466 12.031-12.114 12.031z" transform="scale(0.85) translate(2, 2)"/></svg>
            Send Receipt on WhatsApp
          </a>

          <Link to="/dashboard" className="block w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-2.5 rounded-lg transition-colors text-sm">
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
        <SpotlightCard className="p-8 h-fit shadow-lg">
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
        </SpotlightCard>

        {/* Payment Instructions */}
        <SpotlightCard className="p-8 shadow-lg">
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

          <form onSubmit={handleSubmitPayment} className="space-y-6">
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Upload Payment Receipt <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-background hover:bg-surface/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-foreground-muted" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          {uploading ? (
                            <p className="mb-2 text-sm text-foreground-muted">Uploading...</p>
                          ) : receiptUrl ? (
                            <p className="mb-2 text-sm text-green-500 font-medium">Receipt Uploaded Successfully!</p>
                          ) : (
                            <p className="mb-2 text-sm text-foreground-muted"><span className="font-semibold text-gold-500">Click to upload</span> or drag and drop</p>
                          )}
                          <p className="text-xs text-foreground-muted">PNG, JPG or PDF</p>
                      </div>
                      <input id="dropzone-file" type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                  </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting || uploading || !receiptUrl}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {submitting ? 'Submitting...' : 'I have made the payment'}
            </button>
          </form>
        </SpotlightCard>

      </div>
    </div>
  );
}
