import { Link } from 'react-router-dom'
import logo from '../../assets/images/logomain.png'


const  SignupNav = () => {

    
    return (

            <div className="Signcontent mt-5 d-flex border-bottom pb-3">
                <Link className="logolink" to="/Home"><img className="logomain" alt="img" src = { logo } />
                    <span className="fs-5 SignlogoLink">ARCoolingPH</span>
                </Link>
                <div className="Signuplink ">
                    <ul className="Signupbutton">
                        <li className="SignupLogin">
                            <Link to="/Businesslogin">Login</Link>
                        </li>
                        <li className="linkbutton">
                            <Link to="/Contact">Contact</Link>
                        </li>
                        <li className="linkbutton">
                            <Link to="/About">About </Link>
                        </li>
                    </ul>
                </div>
            </div>
       
    )
}

export default SignupNav;