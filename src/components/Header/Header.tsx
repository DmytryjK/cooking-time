import AddRecipeBtn from '../AddRecipeBtn/AddRecipeBtn';
import Tags from '../Tags/Tags';
import SearchForm from "../SearchForm/SearchForm";
import Authentication from '../Authentication/Authentication';

import './Header.scss';
import { Recepie } from '../../types/type';

const Header = ({isSearch, recepies}:{isSearch:boolean, recepies:Recepie[]}) => {

    return (
        <header className="header">
            <div className="header__top">
                <a className="header__logo" href="/">Главная</a>
                {isSearch ? <SearchForm recepies={recepies}/> : undefined}
                <AddRecipeBtn text={"Добавить рецепт"}/>
                <Authentication/>
            </div>
            <Tags recepies={recepies}/>
        </header>
    )
}

export default Header;
