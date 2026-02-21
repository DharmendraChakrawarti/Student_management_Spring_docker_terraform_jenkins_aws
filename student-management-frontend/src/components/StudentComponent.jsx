import React, { useEffect, useState } from 'react'
import { getStudent, updateStudent, registerStudent } from '../services/StudentService'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllAcademicYears, getAllSections, getAllStandards } from '../services/AcademicService';

const StudentComponent = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [academicYearId, setAcademicYearId] = useState('')
    const [standardId, setStandardId] = useState('')
    const [sectionId, setSectionId] = useState('')
    const [gender, setGender] = useState('')
    const [dob, setDob] = useState('')
    const [guardianName, setGuardianName] = useState('')
    const [guardianPhone, setGuardianPhone] = useState('')

    const [years, setYears] = useState([])
    const [standards, setStandards] = useState([])
    const [sections, setSections] = useState([])

    const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '' })
    const [apiError, setApiError] = useState('')

    const { id } = useParams();
    const navigator = useNavigate();

    useEffect(() => {
        getAllAcademicYears().then(res => setYears(res.data)).catch(err => console.error(err));
        getAllStandards().then(res => setStandards(res.data)).catch(err => console.error(err));
        getAllSections().then(res => setSections(res.data)).catch(err => console.error(err));

        if (id) {
            getStudent(id).then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setGender(response.data.gender || '');
                setDob(response.data.dob || '');
                setGuardianName(response.data.guardianName || '');
                setGuardianPhone(response.data.guardianPhone || '');
                setAcademicYearId(response.data.academicYearId || '');
                setStandardId(response.data.standardId || '');
                setSectionId(response.data.sectionId || '');
            }).catch(error => {
                console.error(error);
                setApiError('Failed to load student data.');
            })
        }
    }, [id])

    function saveOrUpdateStudent(e) {
        e.preventDefault();
        setApiError('');

        if (validateForm()) {
            const student = {
                firstName, lastName, email,
                username, password,
                academicYearId: academicYearId || null,
                standardId: standardId || null,
                sectionId: sectionId || null,
                gender, dob, guardianName, guardianPhone
            }

            const apiCall = id ? updateStudent(id, student) : registerStudent(student);

            apiCall.then((response) => {
                console.log(response.data);
                navigator('/students');
            }).catch(error => {
                console.error(error);
                const msg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
                setApiError(msg);
                window.scrollTo(0, 0);
            })
        }
    }

    function validateForm() {
        let valid = true;
        const errorsCopy = { firstName: '', lastName: '', email: '' };

        if (!firstName.trim()) { errorsCopy.firstName = 'First name is required'; valid = false; }
        if (!lastName.trim()) { errorsCopy.lastName = 'Last name is required'; valid = false; }
        if (!email.trim()) { errorsCopy.email = 'Email is required'; valid = false; }

        setErrors(errorsCopy);
        return valid;
    }

    function pageTitle() {
        return <h2 className='text-center'>{id ? 'Update Student' : 'Add Student'}</h2>
    }

    return (
        <div className='container'>
            <br /><br />
            <div className='row'>
                <div className='card col-md-8 offset-md-2'>
                    {pageTitle()}
                    <div className='card-body'>
                        {apiError && <div className='alert alert-danger'>{apiError}</div>}
                        <form>
                            {/* Personal Details */}
                            <h5 className="mb-3 text-primary">Personal Details</h5>
                            <div className='row mb-3'>
                                <div className="col-md-6">
                                    <label className='form-label'>First Name</label>
                                    <input type='text' placeholder='Enter First Name' value={firstName}
                                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                        onChange={(e) => setFirstName(e.target.value)} />
                                    {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className='form-label'>Last Name</label>
                                    <input type='text' placeholder='Enter Last Name' value={lastName}
                                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                        onChange={(e) => setLastName(e.target.value)} />
                                    {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className="col-md-6">
                                    <label className='form-label'>Email</label>
                                    <input type='email' placeholder='Enter Email' value={email}
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        onChange={(e) => setEmail(e.target.value)} />
                                    {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className='form-label'>Date of Birth</label>
                                    <input type='date' value={dob} className='form-control'
                                        onChange={(e) => setDob(e.target.value)} />
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className="col-md-6">
                                    <label className='form-label'>Gender</label>
                                    <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className='form-label'>Guardian Name</label>
                                    <input type='text' className='form-control' value={guardianName}
                                        onChange={e => setGuardianName(e.target.value)} />
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className="col-md-6">
                                    <label className='form-label'>Guardian Phone</label>
                                    <input type='text' className='form-control' value={guardianPhone}
                                        onChange={e => setGuardianPhone(e.target.value)} />
                                </div>
                            </div>

                            {/* Account Details - Only for new students */}
                            {!id && (
                                <>
                                    <h5 className="mb-3 text-primary mt-4">Account Details</h5>
                                    <div className='row mb-3'>
                                        <div className="col-md-6">
                                            <label className='form-label'>Username</label>
                                            <input type='text' className='form-control' value={username}
                                                onChange={e => setUsername(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className='form-label'>Password</label>
                                            <input type='password' className='form-control' value={password}
                                                onChange={e => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Academic Details */}
                            <h5 className="mb-3 text-primary mt-4">Academic Details</h5>
                            <div className='row mb-3'>
                                <div className="col-md-4">
                                    <label className='form-label'>Academic Year</label>
                                    <select className="form-select" value={academicYearId} onChange={e => setAcademicYearId(e.target.value)}>
                                        <option value="">Select Year</option>
                                        {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className='form-label'>Class</label>
                                    <select className="form-select" value={standardId} onChange={e => setStandardId(e.target.value)}>
                                        <option value="">Select Class</option>
                                        {standards.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className='form-label'>Section</label>
                                    <select className="form-select" value={sectionId} onChange={e => setSectionId(e.target.value)}>
                                        <option value="">Select Section</option>
                                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className='btn btn-success' onClick={saveOrUpdateStudent}>Submit</button>
                                <button type="button" className='btn btn-secondary' onClick={() => navigator('/students')}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentComponent
