import Authentication from "../components/Authentication/Authentication";

import { NavLink } from "react-router-dom";
import Logo from '../resources/icons/logo.svg';
import './AuthorizationPage.scss';

const AuthorizationPage = () => {
    return (
        <section className="authorization">
            <div className="authorization__image"></div>
            <div className="authorization__content">
                <NavLink className="authorization__logo" 
                    to="/">
                    <img src={Logo} alt="" />
                </NavLink>
                <Authentication />
            </div>
        </section>
    )
}

export default AuthorizationPage;