import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminUser, isTeacherUser, isStudentUser, getLoggedInUser, getUserRole } from '../services/AuthService';
import { listStudents } from '../services/StudentService';
import { getAllTeachers } from '../services/TeacherService';
import { listCourses } from '../services/CourseService';

const DashboardComponent = () => {

    const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
    const [loading, setLoading] = useState(true);
    const navigator = useNavigate();
    const username = getLoggedInUser();
    const isAdmin = isAdminUser();
    const isTeacher = isTeacherUser();
    const isStudent = isStudentUser();
    const role = getUserRole();

    useEffect(() => {
        const promises = [listCourses()];

        // Students & Teachers lists — only fetch for ADMIN and TEACHER
        if (isAdmin || isTeacher) {
            promises.push(listStudents());
        }
        if (isAdmin) {
            promises.push(getAllTeachers());
        }

        Promise.allSettled(promises).then((results) => {
            const coursesResult = results[0];
            const studentsResult = results[1];
            const teachersResult = results[2];

            setStats({
                courses: coursesResult?.status === 'fulfilled' ? coursesResult.value.data.length : 0,
                students: studentsResult?.status === 'fulfilled' ? studentsResult.value.data.length : 0,
                teachers: teachersResult?.status === 'fulfilled' ? teachersResult.value.data.length : 0,
            });
            setLoading(false);
        });
    }, []);

    // Build cards based on role
    const cards = [];

    if (isAdmin || isTeacher) {
        cards.push({
            title: 'Students',
            count: stats.students,
            icon: '🎓',
            color: '#4e54c8',
            gradient: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
            path: '/students'
        });
    }

    if (isAdmin) {
        cards.push({
            title: 'Teachers',
            count: stats.teachers,
            icon: '👨‍🏫',
            color: '#00b09b',
            gradient: 'linear-gradient(135deg, #00b09b, #96c93d)',
            path: '/teachers'
        });
    }

    cards.push({
        title: 'Courses',
        count: stats.courses,
        icon: '📚',
        color: '#f7971e',
        gradient: 'linear-gradient(135deg, #f7971e, #ffd200)',
        path: '/courses'
    });

    // Build quick actions based on role
    const quickActions = [];
    if (isAdmin) {
        quickActions.push({ label: '🎓 Add Student', path: '/add-student' });
        quickActions.push({ label: '👨‍🏫 Add Teacher', path: '/teachers' });
        quickActions.push({ label: '📚 Add Course', path: '/add-course' });
        quickActions.push({ label: '🏫 Academic Setup', path: '/academic' });
    } else if (isTeacher) {
        quickActions.push({ label: '📚 Add Course', path: '/add-course' });
        quickActions.push({ label: '🎓 View Students', path: '/students' });
    }

    const roleLabel = role === 'ADMIN' ? '👑 Administrator' : role === 'TEACHER' ? '👨‍🏫 Teacher' : '🎓 Student';

    return (
        <div className='container py-5'>
            {/* Welcome Section */}
            <div className='mb-5'>
                <h1 className='fw-bold' style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
                    Welcome back, <span style={{ color: 'var(--primary-color)' }}>{username}</span>! 👋
                </h1>
                <p className='text-muted fs-5'>
                    Logged in as <strong>{roleLabel}</strong>.
                    {isAdmin && ' You have full access to manage the system.'}
                    {isTeacher && ' You can view students and manage courses.'}
                    {isStudent && ' You can browse available courses.'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className='row g-4 mb-5'>
                {cards.map((card, idx) => (
                    <div key={idx} className={`col-md-${Math.min(12 / cards.length, 6)}`}>
                        <div className='card border-0 shadow-sm h-100'
                            style={{
                                borderRadius: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                overflow: 'hidden'
                            }}
                            onClick={() => navigator(card.path)}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                            }}>
                            <div style={{ background: card.gradient, padding: '2rem' }}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        <p className='text-white mb-1 fw-semibold text-uppercase'
                                            style={{ fontSize: '0.85rem', letterSpacing: '1px', opacity: 0.9 }}>
                                            {card.title}
                                        </p>
                                        <h2 className='text-white fw-bold mb-0' style={{ fontSize: '2.8rem' }}>
                                            {loading ? '...' : card.count}
                                        </h2>
                                    </div>
                                    <span style={{ fontSize: '3rem', opacity: 0.7 }}>{card.icon}</span>
                                </div>
                            </div>
                            <div className='card-body py-3 d-flex align-items-center justify-content-between'>
                                <span className='text-muted fw-medium'>View Details</span>
                                <span style={{ color: card.color, fontSize: '1.2rem' }}>→</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions — only for roles with actions */}
            {quickActions.length > 0 && (
                <div className='card border-0 shadow-sm p-4' style={{ borderRadius: '16px' }}>
                    <h5 className='fw-bold mb-4'>
                        <span style={{ color: 'var(--primary-color)' }}>⚡</span> Quick Actions
                    </h5>
                    <div className='row g-3'>
                        {quickActions.map((action, idx) => (
                            <div key={idx} className='col-md-3 col-6'>
                                <button className='btn w-100 py-3 fw-semibold border'
                                    style={{ borderRadius: '12px', transition: 'all 0.2s ease' }}
                                    onClick={() => navigator(action.path)}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                    {action.label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Student specific message */}
            {isStudent && (
                <div className='card border-0 shadow-sm p-4 mt-4' style={{ borderRadius: '16px' }}>
                    <div className='text-center py-3'>
                        <span style={{ fontSize: '3rem' }}>📖</span>
                        <h5 className='fw-bold mt-3'>Welcome, Student!</h5>
                        <p className='text-muted'>
                            Browse available courses from the <strong>Courses</strong> section above.
                            Contact your teacher or admin for any academic queries.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardComponent;
