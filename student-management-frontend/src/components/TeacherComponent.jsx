import React, { useEffect, useState } from 'react';
import { registerTeacher, getAllTeachers, updateTeacher, deleteTeacher } from '../services/TeacherService';
import { getAllSubjects } from '../services/AcademicService';
import { useNavigate } from 'react-router-dom';

const TeacherComponent = () => {

    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [qualification, setQualification] = useState('');
    const [experience, setExperience] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigator = useNavigate();

    useEffect(() => {
        loadTeachers();
        getAllSubjects().then(res => setSubjects(res.data)).catch(err => console.error(err));
    }, []);

    function loadTeachers() {
        getAllTeachers().then(res => setTeachers(res.data)).catch(err => {
            console.error(err);
            setErrorMessage('Failed to load teachers.');
        });
    }

    function resetForm() {
        setFirstName(''); setLastName(''); setEmail('');
        setQualification(''); setExperience('');
        setUsername(''); setPassword('');
        setSelectedSubjects([]);
        setEditingId(null);
    }

    function handleSubjectToggle(id) {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        setMessage(''); setErrorMessage('');

        const teacher = {
            firstName, lastName, email, qualification, experience,
            username: editingId ? undefined : username,
            password: editingId ? undefined : password,
            subjectIds: selectedSubjects.map(Number)
        };

        const apiCall = editingId
            ? updateTeacher(editingId, teacher)
            : registerTeacher(teacher);

        apiCall.then(() => {
            setMessage(editingId ? 'Teacher updated successfully!' : 'Teacher registered successfully!');
            setShowForm(false);
            resetForm();
            loadTeachers();
        }).catch(err => {
            console.error(err);
            setErrorMessage(err.response?.data?.message || err.message || 'Operation failed.');
        });
    }

    function handleEdit(teacher) {
        setEditingId(teacher.id);
        setFirstName(teacher.firstName);
        setLastName(teacher.lastName);
        setEmail(teacher.email);
        setQualification(teacher.qualification || '');
        setExperience(teacher.experience || '');
        setSelectedSubjects(teacher.subjectIds ? [...teacher.subjectIds] : []);
        setShowForm(true);
    }

    function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            deleteTeacher(id).then(() => {
                setMessage('Teacher deleted successfully.');
                loadTeachers();
            }).catch(err => {
                setErrorMessage(err.response?.data?.message || 'Delete failed.');
            });
        }
    }

    return (
        <div className='container py-4'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h2>Teachers</h2>
                <button className='btn btn-success' onClick={() => { resetForm(); setShowForm(!showForm); }}>
                    {showForm ? 'Cancel' : '+ Add Teacher'}
                </button>
            </div>

            {message && <div className='alert alert-success'>{message}</div>}
            {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

            {showForm && (
                <div className='card mb-4'>
                    <div className='card-header'>
                        <strong>{editingId ? 'Edit Teacher' : 'Register Teacher'}</strong>
                    </div>
                    <div className='card-body'>
                        <form onSubmit={handleSubmit}>
                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <label className='form-label'>First Name *</label>
                                    <input className='form-control' value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                </div>
                                <div className='col-md-6'>
                                    <label className='form-label'>Last Name</label>
                                    <input className='form-control' value={lastName} onChange={e => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <label className='form-label'>Email *</label>
                                    <input type='email' className='form-control' value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className='col-md-6'>
                                    <label className='form-label'>Qualification</label>
                                    <input className='form-control' value={qualification} onChange={e => setQualification(e.target.value)} />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <label className='form-label'>Experience</label>
                                    <input className='form-control' placeholder='e.g. 5 years' value={experience} onChange={e => setExperience(e.target.value)} />
                                </div>
                            </div>

                            {!editingId && (
                                <div className='row mb-3'>
                                    <div className='col-md-6'>
                                        <label className='form-label'>Username *</label>
                                        <input className='form-control' value={username} onChange={e => setUsername(e.target.value)} required />
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label'>Password *</label>
                                        <input type='password' className='form-control' value={password} onChange={e => setPassword(e.target.value)} required />
                                    </div>
                                </div>
                            )}

                            <div className='mb-3'>
                                <label className='form-label'>Assign Subjects</label>
                                <div className='d-flex flex-wrap gap-2'>
                                    {subjects.map(s => (
                                        <div key={s.id} className='form-check'>
                                            <input
                                                type='checkbox'
                                                className='form-check-input'
                                                id={`sub-${s.id}`}
                                                checked={selectedSubjects.includes(s.id)}
                                                onChange={() => handleSubjectToggle(s.id)}
                                            />
                                            <label className='form-check-label' htmlFor={`sub-${s.id}`}>{s.name}</label>
                                        </div>
                                    ))}
                                    {subjects.length === 0 && <small className='text-muted'>No subjects available. Add subjects in Academic Management first.</small>}
                                </div>
                            </div>

                            <button type='submit' className='btn btn-primary me-2'>
                                {editingId ? 'Update Teacher' : 'Register Teacher'}
                            </button>
                            <button type='button' className='btn btn-secondary' onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            <div className='table-responsive'>
                <table className='table table-bordered table-hover'>
                    <thead className='table-dark'>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Qualification</th>
                            <th>Experience</th>
                            <th>Subjects</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.length === 0 ? (
                            <tr><td colSpan='7' className='text-center text-muted'>No teachers registered yet.</td></tr>
                        ) : (
                            teachers.map((t, idx) => (
                                <tr key={t.id}>
                                    <td>{idx + 1}</td>
                                    <td>{t.firstName} {t.lastName}</td>
                                    <td>{t.email}</td>
                                    <td>{t.qualification || '-'}</td>
                                    <td>{t.experience || '-'}</td>
                                    <td>
                                        {t.subjectIds && t.subjectIds.length > 0
                                            ? t.subjectIds.map(sid => {
                                                const sub = subjects.find(s => s.id === sid);
                                                return sub ? <span key={sid} className='badge bg-primary me-1'>{sub.name}</span> : null;
                                            })
                                            : <span className='text-muted'>None</span>
                                        }
                                    </td>
                                    <td>
                                        <button className='btn btn-sm btn-warning me-2' onClick={() => handleEdit(t)}>Edit</button>
                                        <button className='btn btn-sm btn-danger' onClick={() => handleDelete(t.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherComponent;
