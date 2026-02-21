import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { isUserLoggedIn, logout, isAdminUser, isTeacherUser, getUserRole } from '../services/AuthService'

const HeaderComponent = () => {

    const isAuth = isUserLoggedIn();
    const isAdmin = isAdminUser();
    const isTeacher = isTeacherUser();
    const role = getUserRole();
    const navigator = useNavigate();

    function handleLogout() {
        logout();
        navigator('/login')
    }

    return (
        <div>
            <header>
                <nav className='navbar navbar-expand-lg navbar-dark'
                    style={{
                        background: 'var(--primary-gradient)',
                        boxShadow: 'var(--shadow-sm)',
                        padding: '1rem 2rem'
                    }}>
                    <div className="container-fluid">
                        <a className="navbar-brand fw-bold text-uppercase" href="/"
                            style={{ letterSpacing: '1px', fontSize: '1.5rem' }}>
                            🎓 Student Sys
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto align-items-center">

                                {isAuth && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link fw-semibold text-uppercase" to="/dashboard">Dashboard</NavLink>
                                    </li>
                                )}

                                {/* Students - visible to ADMIN and TEACHER only */}
                                {isAuth && (isAdmin || isTeacher) && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link fw-semibold text-uppercase" to="/students">Students</NavLink>
                                    </li>
                                )}

                                {/* Courses - visible to all authenticated users */}
                                {isAuth && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link fw-semibold text-uppercase" to="/courses">Courses</NavLink>
                                    </li>
                                )}

                                {/* Academic - visible to ADMIN only */}
                                {isAuth && isAdmin && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link fw-semibold text-uppercase" to="/academic">Academic</NavLink>
                                    </li>
                                )}

                                {/* Teachers - visible to ADMIN only */}
                                {isAuth && isAdmin && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link fw-semibold text-uppercase" to="/teachers">Teachers</NavLink>
                                    </li>
                                )}

                                {!isAuth && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link fw-semibold text-uppercase" to="/register">Register</NavLink>
                                    </li>
                                )}

                                {!isAuth && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link fw-semibold text-uppercase" to="/login">Login</NavLink>
                                    </li>
                                )}

                                {isAuth && (
                                    <>
                                        <li className="nav-item ms-2">
                                            <span className="badge rounded-pill"
                                                style={{
                                                    background: role === 'ADMIN' ? '#dc3545' : role === 'TEACHER' ? '#198754' : '#0d6efd',
                                                    padding: '6px 12px',
                                                    fontSize: '0.75rem'
                                                }}>
                                                {role === 'ADMIN' && '👑 '}{role === 'TEACHER' && '👨‍🏫 '}{role === 'STUDENT' && '🎓 '}
                                                {role}
                                            </span>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link fw-semibold text-uppercase" to="/login" onClick={handleLogout}>Logout</NavLink>
                                        </li>
                                    </>
                                )}

                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default HeaderComponent
