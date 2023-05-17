import AddRecipeBtn from '../AddRecipeBtn/AddRecipeBtn';
import Tags from '../Tags/Tags';
import SearchForm from "../SearchForm/SearchForm";
import Authentication from '../Authentication/Authentication';

import './Header.scss';

const Header = () => {
    return (
        <header className="header">
            <div className="header__top">
                <SearchForm/>
                <AddRecipeBtn text={"Добавить рецепт"}/>
                <Authentication/>
            </div>
            <Tags/>
        </header>
    )
}

export default Header;
