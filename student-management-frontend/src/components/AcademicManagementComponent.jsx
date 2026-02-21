import React, { useEffect, useState } from 'react'
import { createAcademicYear, createSection, createStandard, createSubject, getAllAcademicYears, getAllSections, getAllStandards, getAllSubjects } from '../services/AcademicService';

const AcademicManagementComponent = () => {

    // State for Lists
    const [years, setYears] = useState([]);
    const [standards, setStandards] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // State for Forms
    const [yearName, setYearName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [standardName, setStandardName] = useState('');
    const [sectionName, setSectionName] = useState('');

    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        refreshAll();
    }, [])

    function refreshAll() {
        getAllAcademicYears().then(res => setYears(res.data));
        getAllStandards().then(res => setStandards(res.data));
        getAllSections().then(res => setSections(res.data));
        getAllSubjects().then(res => setSubjects(res.data));
    }

    // Handlers
    // Handlers
    function handleAddYear(e) {
        e.preventDefault();
        const year = { name: yearName, startDate, endDate, active: true };
        createAcademicYear(year).then(() => {
            setYearName(''); setStartDate(''); setEndDate('');
            setMessage('Academic Year added successfully');
            setErrorMessage('');
            refreshAll();
        }).catch(err => {
            console.error(err);
            setErrorMessage('Failed to add Academic Year');
            setMessage('');
        });
    }

    function handleAddStandard(e) {
        e.preventDefault();
        const std = { name: standardName };
        createStandard(std).then(() => {
            setStandardName('');
            setMessage('Standard added successfully');
            setErrorMessage('');
            refreshAll();
        }).catch(err => {
            console.error(err);
            setErrorMessage('Failed to add Standard');
            setMessage('');
        });
    }

    function handleAddSection(e) {
        e.preventDefault();
        const sec = { name: sectionName };
        createSection(sec).then(() => {
            setSectionName('');
            setMessage('Section added successfully');
            setErrorMessage('');
            refreshAll();
        }).catch(err => {
            console.error(err);
            setErrorMessage('Failed to add Section');
            setMessage('');
        });
    }

    function handleAddSubject(e) {
        e.preventDefault();
        const sub = { name: subjectName, code: subjectCode };
        createSubject(sub).then(() => {
            setSubjectName(''); setSubjectCode('');
            setMessage('Subject added successfully');
            setErrorMessage('');
            refreshAll();
        }).catch(err => {
            console.error(err);
            setErrorMessage('Failed to add Subject');
            setMessage('');
        });
    }

    return (
        <div className='container py-4'>
            <h2 className='text-center mb-4'>Academic Management</h2>
            {message && <div className='alert alert-success'>{message}</div>}
            {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

            <div className="row">
                {/* Academic Years */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">Academic Years</div>
                        <div className="card-body">
                            <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {years.map(y => <li key={y.id} className="list-group-item">{y.name} ({y.startDate} - {y.endDate})</li>)}
                            </ul>
                            <form onSubmit={handleAddYear}>
                                <div className="input-group mb-2">
                                    <input type="text" className="form-control" placeholder="Name (e.g. 2024-25)" value={yearName} onChange={e => setYearName(e.target.value)} required />
                                </div>
                                <div className="row mb-2">
                                    <div className="col"><input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required /></div>
                                    <div className="col"><input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required /></div>
                                </div>
                                <button className="btn btn-sm btn-primary w-100">Add Year</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Standards */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">Classes (Standards)</div>
                        <div className="card-body">
                            <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {standards.map(s => <li key={s.id} className="list-group-item">{s.name}</li>)}
                            </ul>
                            <form onSubmit={handleAddStandard}>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Name (e.g. Grade 10)" value={standardName} onChange={e => setStandardName(e.target.value)} required />
                                    <button className="btn btn-success">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-warning text-dark">Sections</div>
                        <div className="card-body">
                            <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {sections.map(s => <li key={s.id} className="list-group-item">{s.name}</li>)}
                            </ul>
                            <form onSubmit={handleAddSection}>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Name (e.g. A, B)" value={sectionName} onChange={e => setSectionName(e.target.value)} required />
                                    <button className="btn btn-warning">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Subjects */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white">Subjects</div>
                        <div className="card-body">
                            <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {subjects.map(s => <li key={s.id} className="list-group-item">{s.name} ({s.code})</li>)}
                            </ul>
                            <form onSubmit={handleAddSubject}>
                                <div className="input-group mb-2">
                                    <input type="text" className="form-control" placeholder="Name (e.g. Math)" value={subjectName} onChange={e => setSubjectName(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Code (e.g. MATH101)" value={subjectCode} onChange={e => setSubjectCode(e.target.value)} required />
                                    <button className="btn btn-info text-white">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AcademicManagementComponent
