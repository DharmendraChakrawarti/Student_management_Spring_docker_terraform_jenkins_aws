import React, { useEffect, useState } from 'react'
import { createCourse, getCourse, updateCourse } from '../services/CourseService'
import { useNavigate, useParams } from 'react-router-dom'

const CourseComponent = () => {

    const [title, setTitle] = useState('')
    const [credits, setCredits] = useState('')

    const { id } = useParams();
    const [errors, setErrors] = useState({
        title: '',
        credits: ''
    })

    const navigator = useNavigate();

    useEffect(() => {
        if (id) {
            getCourse(id).then((response) => {
                setTitle(response.data.title);
                setCredits(response.data.credits);
            }).catch(error => {
                console.error(error);
            })
        }
    }, [id])

    function saveOrUpdateCourse(e) {
        e.preventDefault();

        if (validateForm()) {

            const course = { title, credits }
            console.log(course)

            if (id) {
                updateCourse(id, course).then((response) => {
                    console.log(response.data);
                    navigator('/courses');
                }).catch(error => {
                    console.error(error);
                })
            } else {
                createCourse(course).then((response) => {
                    console.log(response.data);
                    navigator('/courses')
                }).catch(error => {
                    console.error(error);
                })
            }
        }
    }

    function validateForm() {
        let valid = true;

        const errorsCopy = { ...errors }

        if (title.trim()) {
            errorsCopy.title = '';
        } else {
            errorsCopy.title = 'Title is required';
            valid = false;
        }

        if (credits) {
            errorsCopy.credits = '';
        } else {
            errorsCopy.credits = 'Credits are required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    function pageTitle() {
        if (id) {
            return <h2 className='text-center mb-4'>Update Course</h2>
        } else {
            return <h2 className='text-center mb-4'>Add Course</h2>
        }
    }

    return (
        <div className='container py-5'>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card card-custom shadow p-4'>
                        {pageTitle()}
                        <div className='card-body'>
                            <form>
                                <div className='form-group mb-3'>
                                    <label className='form-label fw-bold'>Course Title:</label>
                                    <input
                                        type='text'
                                        placeholder='Enter Course Title'
                                        name='title'
                                        value={title}
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        onChange={(e) => setTitle(e.target.value)}
                                    >
                                    </input>
                                    {errors.title && <div className='invalid-feedback'> {errors.title} </div>}
                                </div>

                                <div className='form-group mb-4'>
                                    <label className='form-label fw-bold'>Credits:</label>
                                    <input
                                        type='number'
                                        placeholder='Enter Credits'
                                        name='credits'
                                        value={credits}
                                        className={`form-control ${errors.credits ? 'is-invalid' : ''}`}
                                        onChange={(e) => setCredits(e.target.value)}
                                    >
                                    </input>
                                    {errors.credits && <div className='invalid-feedback'> {errors.credits} </div>}
                                </div>

                                <div className="d-grid gap-2">
                                    <button className='btn btn-success' onClick={saveOrUpdateCourse}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseComponent
