import {FC} from 'react';
import AddRecipeBtn from '../AddRecipeBtn/AddRecipeBtn';
import Tags from '../Tags/Tags';
import SearchForm from "../SearchForm/SearchForm";
import Authentication from '../Authentication/Authentication';

import './Header.scss';
import { Recepie } from '../../types/type';
import { NavLink } from "react-router-dom";

const Header: FC<{isSearch:boolean, recepies:Recepie[]}> = ({isSearch, recepies}) => {

    return (
        <header className="header">
            <div className="header__top">
                <NavLink to="/" className={({ isActive }) => isActive ? "header__logo active" : "header__logo"}>Главная</NavLink>
                {isSearch ? <SearchForm recepies={recepies}/> : undefined}
                <AddRecipeBtn text={"Добавить рецепт"}/>
                <Authentication/>
            </div>
            {isSearch ? <Tags recepies={recepies}/> : undefined}
        </header>
    )
}

export default Header;
