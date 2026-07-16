import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Loader2 } from 'lucide-react'

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
const ProfileSettings = React.lazy(() => import('./pages/dashboard/ProfileSettings'))
const StudentSettings = React.lazy(() => import('./pages/dashboard/StudentSettings'))
const WishlistPage = React.lazy(() => import('./pages/dashboard/WishlistPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

// Global loading fallback
const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Loader2 className="size-8 animate-spin text-primary/60" />
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'USER']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'USER']}><StudentSettings /></ProtectedRoute>} />
            <Route path="/dashboard/wishlist" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'USER']}><WishlistPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProfileSettings />} />
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
