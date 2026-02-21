import React, { useState } from 'react'
import { registerAPICall } from '../services/AuthService'
import { useNavigate, Link } from 'react-router-dom';

const RegisterComponent = () => {

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('STUDENT')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const navigator = useNavigate();

    function handleRegistrationForm(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const register = { name, username, email, password, role }

        registerAPICall(register).then((response) => {
            console.log(response.data);
            setSuccess("User registered successfully! Redirecting to login...");
            setError('');
            setTimeout(() => {
                navigator('/login');
            }, 2000);
        }).catch(error => {
            console.error(error);
            setError(error.response?.data?.message || "Registration failed! Try again.");
            setSuccess('');
            setLoading(false);
        })
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card shadow-sm' style={{ borderRadius: '16px', border: 'none' }}>
                        <div className='card-header text-center py-4'
                            style={{ background: 'linear-gradient(135deg, #00b09b, #96c93d)', borderRadius: '16px 16px 0 0' }}>
                            <h2 className='text-white mb-0 fw-bold'>📝 Create Account</h2>
                            <p className='text-white-50 mb-0 mt-1'>Join the Student Management System</p>
                        </div>

                        <div className='card-body p-4'>
                            {
                                success && <div className='alert alert-success'> {success} </div>
                            }
                            {
                                error && <div className='alert alert-danger'> {error} </div>
                            }
                            <form onSubmit={handleRegistrationForm}>
                                <div className='mb-3'>
                                    <label className='form-label fw-semibold'>Full Name</label>
                                    <input
                                        type='text'
                                        name='name'
                                        className='form-control form-control-lg'
                                        placeholder='Enter your full name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label fw-semibold'>Username</label>
                                    <input
                                        type='text'
                                        name='username'
                                        className='form-control form-control-lg'
                                        placeholder='Choose a username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label fw-semibold'>Email</label>
                                    <input
                                        type='email'
                                        name='email'
                                        className='form-control form-control-lg'
                                        placeholder='Enter email address'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label fw-semibold'>Password</label>
                                    <input
                                        type='password'
                                        name='password'
                                        className='form-control form-control-lg'
                                        placeholder='Create a password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={4}
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>

                                <div className='mb-4'>
                                    <label className='form-label fw-semibold'>Register as</label>
                                    <div className='d-flex gap-3'>
                                        {['STUDENT', 'TEACHER'].map(r => (
                                            <div key={r}
                                                className={`flex-fill text-center py-2 px-3 rounded-3 border ${role === r ? 'text-white' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    background: role === r ? 'var(--primary-gradient)' : 'white',
                                                    fontWeight: role === r ? '600' : '400',
                                                    transition: 'all 0.2s ease',
                                                    borderColor: role === r ? 'transparent' : '#dee2e6'
                                                }}
                                                onClick={() => setRole(r)}>
                                                {r === 'STUDENT' && '🎓 '}{r === 'TEACHER' && '👨‍🏫 '}
                                                {r.charAt(0) + r.slice(1).toLowerCase()}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className='d-grid mb-3'>
                                    <button
                                        type='submit'
                                        className='btn btn-lg fw-semibold text-white'
                                        style={{ background: 'linear-gradient(135deg, #00b09b, #96c93d)', border: 'none', borderRadius: '10px', padding: '12px' }}
                                        disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating Account...
                                            </>
                                        ) : 'Create Account'}
                                    </button>
                                </div>

                                <div className='text-center'>
                                    <span className='text-muted'>Already have an account? </span>
                                    <Link to='/login' className='fw-semibold' style={{ color: 'var(--primary-color)' }}>Sign in</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterComponent
