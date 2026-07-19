import React, { Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Loader2 } from 'lucide-react'
import { GlobalBanner } from './components/GlobalBanner'
import MaintenancePage from './components/MaintenancePage'

// Lazy loaded routes for code-splitting
const LandingPage = React.lazy(() => import('./pages/LandingPage'))
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'))
const VerifyEmail = React.lazy(() => import('./pages/auth/VerifyEmail'))
const StudentDashboard = React.lazy(() => import('./pages/dashboard/StudentDashboard'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'))
const AdminCourses = React.lazy(() => import('./pages/admin/AdminCourses'))
const AdminCourseDetails = React.lazy(() => import('./pages/admin/AdminCourseDetails'))
const AdminStudents = React.lazy(() => import('./pages/admin/AdminStudents'))
const AdminPayments = React.lazy(() => import('./pages/admin/AdminPayments'))
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'))
const CourseCatalog = React.lazy(() => import('./pages/dashboard/CourseCatalog'))
const CourseCheckout = React.lazy(() => import('./pages/dashboard/CourseCheckout'))
const LessonViewer = React.lazy(() => import('./pages/dashboard/LessonViewer'))
const StudentSettings = React.lazy(() => import('./pages/dashboard/StudentSettings'))
const WishlistPage = React.lazy(() => import('./pages/dashboard/WishlistPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))
const DeveloperPortal = React.lazy(() => import('./pages/developer/DeveloperPortal'))

// Global loading fallback
const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Loader2 className="size-8 animate-spin text-primary/60" />
  </div>
)

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api/v1';
        const res = await fetch(`${apiUrl}/developer/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.maintenanceMode === 'true') {
            setMaintenanceMode(true);
            setMaintenanceMessage(data.maintenanceMessage);
          }
        }
      } catch (e) {
        console.error('Failed to check system status');
      } finally {
        setIsLoadingStatus(false);
      }
    };
    checkStatus();
  }, []);

  if (isLoadingStatus) {
    return <div className="min-h-dvh flex items-center justify-center bg-black"><span className="text-white">Loading system...</span></div>;
  }

  // Allow developer portal to bypass maintenance mode
  const isDevPortal = window.location.pathname === '/dev-portal';
  
  if (maintenanceMode && !isDevPortal) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <GlobalBanner />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/dev-portal" element={<DeveloperPortal />} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'USER']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'USER']}><StudentSettings /></ProtectedRoute>} />
            <Route path="/dashboard/wishlist" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'USER']}><WishlistPage /></ProtectedRoute>} />
            <Route path="/catalog" element={<CourseCatalog />} />
            <Route path="/checkout/:id" element={<CourseCheckout />} />
            <Route path="/learn/:id" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'USER']}><LessonViewer /></ProtectedRoute>} />
            
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/:id" element={<AdminCourseDetails />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
