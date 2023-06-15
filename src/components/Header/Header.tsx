import {FC} from 'react';
import AddRecipeBtn from '../AddRecipeBtn/AddRecipeBtn';
import Tags from '../Tags/Tags';
import SearchForm from "../SearchForm/SearchForm";
import Authentication from '../Authentication/Authentication';

import './Header.scss';
import { Recepie } from '../../types/type';
import { NavLink } from "react-router-dom";
import { useAppSelector } from '../../hooks/hooks';

import logo from '../../resources/icons/logo.svg';

const Header: FC<{isSearch:boolean, recepies:Recepie[]}> = ({isSearch, recepies}) => {

    const {uid} = useAppSelector(state => state.authentication.user);

    return (
        <header className="header">
            <div className="header__wrapper">
                <div className="header__left">
                    <NavLink to="/" 
                        reloadDocument
                        className={({ isActive }) => isActive ? "header__logo active" : "header__nav-link"}>
                            <img width={100} height={54} src={logo} alt="" />
                    </NavLink>
                    <nav className="header__nav">
                        <ul className="header__nav-list">
                            <li className="header__nav-item">
                                <NavLink to="/" 
                                    className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}>Головна 
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/favorites"
                                    className={({isActive}) => isActive ? "header__nav-link active" : "header__nav-link"}>Обране
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/add-recepie" 
                                    className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}>Додати рецепт
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="header__right">
                    <SearchForm recepies={recepies}/>
                    {/* <Authentication/> */}
                    <NavLink 
                        className="auth-page" 
                        to="/auth" 
                        reloadDocument > Увійти | Зареєструватись 
                    </NavLink>
                    {/* {   uid ? 
                            <NavLink 
                                className="auth-page" 
                                to="/auth" 
                                reloadDocument > Увійти | Зареєструватись 
                            </NavLink>
                        :
                            <button className="logout__btn">Вихід</button>
                    } */}
                </div>
            </div>
            <Tags recepies={recepies}/>
        </header>
    )
}

export default Header;
