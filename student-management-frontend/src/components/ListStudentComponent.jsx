import React, { useEffect, useState } from 'react'
import { deleteStudent, listStudents } from '../services/StudentService'
import { useNavigate } from 'react-router-dom'
import { isAdminUser } from '../services/AuthService'

const ListStudentComponent = () => {

    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigator = useNavigate();

    useEffect(() => {
        getAllStudents();
    }, [])

    function getAllStudents() {
        setLoading(true);
        listStudents().then((response) => {
            setStudents(response.data);
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setError('Failed to load students. Please try again.');
            setLoading(false);
        })
    }

    function addNewStudent() {
        navigator('/add-student')
    }

    function updateStudent(id) {
        navigator(`/edit-student/${id}`)
    }

    function removeStudent(id) {
        if (window.confirm("Are you sure you want to delete this student?")) {
            deleteStudent(id).then(() => {
                getAllStudents();
            }).catch(error => {
                console.error(error);
                setError('Failed to delete student.');
            })
        }
    }

    return (
        <div className='container py-5'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className='fw-bold text-primary'>
                    <i className="bi bi-people-fill me-2"></i>Students
                </h2>
                {isAdminUser() && (
                    <button className='btn btn-primary shadow-sm' onClick={addNewStudent}>
                        <i className="bi bi-person-plus-fill me-2"></i> Add Student
                    </button>
                )}
            </div>

            {error && <div className='alert alert-danger alert-dismissible'>
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>}

            <div className='card shadow-sm'>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading students...</p>
                    </div>
                ) : students.length > 0 ? (
                    <div className="table-responsive">
                        <table className='table table-hover align-middle mb-0'>
                            <thead className='table-dark'>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Roll No.</th>
                                    <th>Gender</th>
                                    <th>Guardian</th>
                                    {isAdminUser() && <th className="text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, idx) => (
                                    <tr key={student.id}>
                                        <td className="fw-bold text-muted">{idx + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                                                    style={{ width: 38, height: 38, fontSize: 14 }}>
                                                    {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{student.firstName} {student.lastName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{student.email}</td>
                                        <td><span className="badge bg-secondary">{student.rollNumber || '—'}</span></td>
                                        <td>{student.gender || '—'}</td>
                                        <td>{student.guardianName || '—'}</td>
                                        {isAdminUser() && (
                                            <td className="text-center">
                                                <button className='btn btn-sm btn-outline-primary me-2'
                                                    onClick={() => updateStudent(student.id)} title="Edit">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className='btn btn-sm btn-outline-danger'
                                                    onClick={() => removeStudent(student.id)} title="Delete">
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-folder2-open display-1 text-muted opacity-25"></i>
                        <p className="mt-3 text-muted">No students found. Start by adding one!</p>
                        {isAdminUser() && (
                            <button className='btn btn-primary mt-2' onClick={addNewStudent}>
                                <i className="bi bi-person-plus-fill me-2"></i>Add First Student
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListStudentComponent
