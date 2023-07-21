import {FC, useEffect, useState} from 'react';
import Tags from './Tags/Tags';
import SearchForm from "./SearchForm/SearchForm";
import { getAuth, signOut } from "firebase/auth";
import { createUser } from '../../store/reducers/AuthenticationSlice';
import { Recepie } from '../../types/type';
import { NavLink } from "react-router-dom";
import { cloneRecepies } from '../../store/reducers/FiltersSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import logo from '../../assets/icons/logo.svg';
import './Header.scss';

const Header: FC<{isSearch:boolean, recipes:Recepie[]}> = ({isSearch, recipes}) => {
    const {uid} = useAppSelector(state => state.authentication.user);
    const [userAuthToLocalStorage, setUserAuthToLocalStorage] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const auth = getAuth();
    const savedUser = localStorage.getItem('user');

    useEffect(() => {
        setUserAuthToLocalStorage(savedUser);
    }, [savedUser]);

    useEffect(() => {
        if (!uid && savedUser) {
            dispatch(createUser(JSON.parse(savedUser)));
        }
    }, [uid, savedUser, dispatch]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('logout success');
                localStorage.clear();
                setUserAuthToLocalStorage(null);
                dispatch(createUser({uid: '', email: ''}));
            }).catch((error) => {
                console.log('error when u try sign out')
            });
    }

    return (
        <header className="header">
            <div className="container">
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
                                    <NavLink to="/add-recipe" 
                                        className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}>Додати рецепт
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="header__right">
                        {isSearch ? <SearchForm recipes={recipes}/> : null}
                        {userAuthToLocalStorage ? 
                            <button 
                                onClick={handleLogout} 
                                className="logout__btn">Вихід</button>
                                :
                            <NavLink 
                                className="auth-page" 
                                to="/auth" 
                                reloadDocument > Увійти | Зареєструватись 
                            </NavLink>
                        }
                    </div>
                </div>
                <Tags recipes={recipes}/>
            </div>
        </header>
    )
}

export default Header;
