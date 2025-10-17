import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import InstructorDashboardPage from './pages/InstructorDashboardPage'
import CourseEditorPage from './pages/CourseEditorPage'
import LessonPlayerPage from './pages/LessonPlayerPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import CertificatesPage from './pages/CertificatesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import QuizPage from './pages/QuizPage'
import { ROUTES } from './lib/urls'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.LOGIN.substring(1)} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER.substring(1)} element={<RegisterPage />} />
        <Route path={ROUTES.COURSES.substring(1)} element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPlayerPage />} />
        <Route path="quiz/:quizId" element={<QuizPage />} />
        <Route path={ROUTES.ABOUT.substring(1)} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT.substring(1)} element={<ContactPage />} />
        <Route path={ROUTES.DASHBOARD.substring(1)} element={<DashboardPage />} />
        <Route path={ROUTES.PROFILE.substring(1)} element={<ProfilePage />} />
        <Route path={ROUTES.CERTIFICATES.substring(1)} element={<CertificatesPage />} />
        <Route path={ROUTES.INSTRUCTOR.DASHBOARD.substring(1)} element={<InstructorDashboardPage />} />
        <Route path={ROUTES.INSTRUCTOR.COURSES.NEW.substring(1)} element={<CourseEditorPage />} />
        <Route path="instructor/courses/edit/:id" element={<CourseEditorPage />} />
        <Route path={ROUTES.ADMIN.DASHBOARD.substring(1)} element={<AdminDashboardPage />} />
        {/* 404 Not Found - Must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
