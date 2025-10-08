import React from 'react'
import SignupNav from '../components/loginSignup/loginSignupNav'
import AuthRes from '../Auth/Signup'


const Signform = () => {


    return (
        

            <div className="resmain container">
                <SignupNav />
                <div>
                    <AuthRes />
                </div>
            </div>
    )
}

export default Signform;