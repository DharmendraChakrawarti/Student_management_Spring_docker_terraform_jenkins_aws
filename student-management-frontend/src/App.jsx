import './App.css'
import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import ListStudentComponent from './components/ListStudentComponent'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StudentComponent from './components/StudentComponent'
import ListCourseComponent from './components/ListCourseComponent'
import CourseComponent from './components/CourseComponent'
import LoginComponent from './components/LoginComponent'
import RegisterComponent from './components/RegisterComponent'
import { isUserLoggedIn } from './services/AuthService'
import AcademicManagementComponent from './components/AcademicManagementComponent'
import TeacherComponent from './components/TeacherComponent'
import DashboardComponent from './components/DashboardComponent'

function App() {

  function AuthenticatedRoute({ children }) {
    const isAuth = isUserLoggedIn();

    if (isAuth) {
      return children;
    }

    return <Navigate to="/login" />
  }

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LoginComponent />}></Route>
          <Route path='/register' element={<RegisterComponent />}></Route>
          <Route path='/login' element={<LoginComponent />}></Route>

          {/* Dashboard */}
          <Route path='/dashboard' element={
            <AuthenticatedRoute>
              <DashboardComponent />
            </AuthenticatedRoute>
          }></Route>

          {/* Student Routes */}
          <Route path='/students' element={
            <AuthenticatedRoute>
              <ListStudentComponent />
            </AuthenticatedRoute>
          }></Route>

          <Route path='/add-student' element={
            <AuthenticatedRoute>
              <StudentComponent />
            </AuthenticatedRoute>
          }></Route>

          <Route path='/edit-student/:id' element={
            <AuthenticatedRoute>
              <StudentComponent />
            </AuthenticatedRoute>
          }></Route>

          {/* Course Routes */}
          <Route path='/courses' element={
            <AuthenticatedRoute>
              <ListCourseComponent />
            </AuthenticatedRoute>
          }></Route>

          <Route path='/add-course' element={
            <AuthenticatedRoute>
              <CourseComponent />
            </AuthenticatedRoute>
          }></Route>

          <Route path='/edit-course/:id' element={
            <AuthenticatedRoute>
              <CourseComponent />
            </AuthenticatedRoute>
          }></Route>

          {/* Academic Management */}
          <Route path='/academic' element={
            <AuthenticatedRoute>
              <AcademicManagementComponent />
            </AuthenticatedRoute>
          }></Route>

          {/* Teacher Management */}
          <Route path='/teachers' element={
            <AuthenticatedRoute>
              <TeacherComponent />
            </AuthenticatedRoute>
          }></Route>

        </Routes>

        <FooterComponent />
      </BrowserRouter>
    </>
  )
}

export default App
