import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logomain.png'


const login = () => {


    return (
        
            <div className="Navform mt-5 d-flex border-bottom pb-3 ">
                <Link className="loginlink" to="/Home"><img className="logomain"alt="Companylogo"  src={logo} />
                    <span className="fs-5 m-3">ARCoolingPH</span>
                </Link>
                <div className="link">
                    <ul>
                        <li className="links">
                            <a href = "/Home#Contact" >Contact</a>
                        </li>
                        <li className="linkbutton">
                            <a href = "/Home#About">About Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        
    )
}

export default login;