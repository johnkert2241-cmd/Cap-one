import React from 'react'
import LoginContent from '../Auth/Login'
import LoginNav from '../components/loginSignup/loginSignupNav'


const Loginform = () => {

    
    return (
    
            <div className ="container">
                <LoginNav />
                <div>
                    <LoginContent />
                </div>
            </div>
       
    )
}

export default Loginform