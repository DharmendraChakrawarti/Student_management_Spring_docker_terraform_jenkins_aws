import React, { useEffect, useState } from 'react'
import { deleteCourse, listCourses } from '../services/CourseService'
import { useNavigate } from 'react-router-dom'
import { isAdminUser, isTeacherUser } from '../services/AuthService'

const ListCourseComponent = () => {

    const [courses, setCourses] = useState([])
    const navigator = useNavigate();
    const isAdmin = isAdminUser();
    const isTeacher = isTeacherUser();
    const canManage = isAdmin || isTeacher;

    useEffect(() => {
        getAllCourses();
    }, [])

    function getAllCourses() {
        listCourses().then((response) => {
            setCourses(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    function addNewCourse() {
        navigator('/add-course')
    }

    function updateCourse(id) {
        navigator(`/edit-course/${id}`)
    }

    function removeCourse(id) {
        if (window.confirm("Are you sure you want to delete this course?")) {
            deleteCourse(id).then((response) => {
                getAllCourses();
            }).catch(error => {
                console.error(error);
            })
        }
    }

    return (
        <div className='container py-5'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className='fw-bold text-primary'>Course List</h2>
                {canManage && (
                    <button className='btn btn-primary-custom shadow-sm' onClick={addNewCourse}>
                        <i className="bi bi-plus-circle-fill me-2"></i> Add Course
                    </button>
                )}
            </div>

            <div className='card card-custom shadow p-4'>
                {courses.length > 0 ? (
                    <div className="table-responsive">
                        <table className='table table-hover align-middle'>
                            <thead className='table-light'>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Credits</th>
                                    {canManage && <th className="text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    courses.map(course =>
                                        <tr key={course.id}>
                                            <td className="fw-bold text-muted">#{course.id}</td>
                                            <td>
                                                <div className="fw-bold">{course.title}</div>
                                            </td>
                                            <td>{course.credits}</td>
                                            {canManage && (
                                                <td className="text-center">
                                                    <button className='btn btn-light text-primary btn-sm me-2'
                                                        onClick={() => updateCourse(course.id)}
                                                        title="Edit">
                                                        ✏️
                                                    </button>
                                                    {isAdmin && (
                                                        <button className='btn btn-light text-danger btn-sm'
                                                            onClick={() => removeCourse(course.id)}
                                                            title="Delete">
                                                            🗑️
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <span className="display-1 text-muted opacity-25">📚</span>
                        <p className="mt-3 text-muted">No courses found. {canManage ? 'Start by adding one!' : ''}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListCourseComponent
