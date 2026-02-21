import React from 'react'

const FooterComponent = () => {
    return (
        <div style={{ marginTop: 'auto' }}>
            <footer className='footer py-3 text-center'
                style={{
                    backgroundColor: 'white',
                    color: 'var(--text-secondary)',
                    borderTop: '1px solid #eee',
                    fontSize: '0.9rem'
                }}>
                <div className="container">
                    <span>&copy; {new Date().getFullYear()} Student Management System. Built with Spring & React.</span>
                </div>
            </footer>
        </div>
    )
}

export default FooterComponent
