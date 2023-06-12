import {FC} from 'react';
import AddRecipeBtn from '../AddRecipeBtn/AddRecipeBtn';
import Tags from '../Tags/Tags';
import SearchForm from "../SearchForm/SearchForm";
import Authentication from '../Authentication/Authentication';

import './Header.scss';
import { Recepie } from '../../types/type';
import { NavLink } from "react-router-dom";
import { useAppSelector } from '../../hooks/hooks';

const Header: FC<{isSearch:boolean, recepies:Recepie[]}> = ({isSearch, recepies}) => {

    const {uid} = useAppSelector(state => state.authentication.user);

    return (
        <header className="header">
            <div className="header__wrapper">
                <div className="header__nav">
                    <NavLink to="/" reloadDocument className={({ isActive }) => isActive ? "header__logo active" : "header__logo"}>Головна </NavLink>
                    <NavLink className={({isActive}) => isActive ? "authentication__favorites active" : "authentication__favorites"} to="/favorites" reloadDocument >Обране</NavLink>
                    <AddRecipeBtn text={"Додати рецепт"}/>
                </div>
                <div className="header__right">
                    <SearchForm recepies={recepies}/>
                    <Authentication/>
                    {/* {   uid ? 
                            <NavLink 
                                className="auth-page" 
                                to="/auth" 
                                reloadDocument > Увійти | Зареєструватись 
                            </NavLink>
                        :
                            <button>Вихід</button>
                    } */}
                </div>
            </div>
            <Tags recepies={recepies}/>
        </header>
    )
}

export default Header;
