import React, { useState } from 'react'
import { loginAPICall, saveLoggedInUser, storeToken } from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';

const LoginComponent = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigator = useNavigate();

    async function handleLoginForm(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        await loginAPICall(username, password).then((response) => {
            console.log(response.data);

            const token = response.data.accessToken;
            const role = response.data.role;

            storeToken(token);
            saveLoggedInUser(username, role);
            navigator('/dashboard');

            window.location.reload(false);
        }).catch(error => {
            console.error(error);
            const msg = error.response?.data?.message || "Invalid username or password";
            setError(msg);
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
                            style={{ background: 'var(--primary-gradient)', borderRadius: '16px 16px 0 0' }}>
                            <h2 className='text-white mb-0 fw-bold'>🔐 Sign In</h2>
                            <p className='text-white-50 mb-0 mt-1'>Welcome back to Student Management System</p>
                        </div>

                        <div className='card-body p-4'>
                            {
                                error && <div className='alert alert-danger'> {error} </div>
                            }
                            <form onSubmit={handleLoginForm}>

                                <div className='mb-3'>
                                    <label className='form-label fw-semibold'>Username or Email</label>
                                    <input
                                        type='text'
                                        name='username'
                                        className='form-control form-control-lg'
                                        placeholder='Enter username or email'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>

                                <div className='mb-4'>
                                    <label className='form-label fw-semibold'>Password</label>
                                    <input
                                        type='password'
                                        name='password'
                                        className='form-control form-control-lg'
                                        placeholder='Enter password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px' }}
                                    />
                                </div>

                                <div className='d-grid mb-3'>
                                    <button
                                        type='submit'
                                        className='btn btn-lg fw-semibold text-white'
                                        style={{ background: 'var(--primary-gradient)', border: 'none', borderRadius: '10px', padding: '12px' }}
                                        disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Signing in...
                                            </>
                                        ) : 'Sign In'}
                                    </button>
                                </div>

                                <div className='text-center'>
                                    <span className='text-muted'>Don't have an account? </span>
                                    <Link to='/register' className='fw-semibold' style={{ color: 'var(--primary-color)' }}>Register here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent
