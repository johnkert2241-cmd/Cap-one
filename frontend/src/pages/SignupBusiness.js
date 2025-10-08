import React from 'react'

import Content from '../components/BusinessAccount/SignupContent'
import Nav from '../components/BusinessAccount/SignupNav'

const Signup = () => {

    return (

        <div>
            <div className="container BusinessContent ">
                <Nav />
                <div className="pt-5">
                    <Content />
                </div>
            </div>
        </div>
    )
}

export default Signup;