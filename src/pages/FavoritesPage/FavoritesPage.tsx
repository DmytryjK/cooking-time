import { useAppSelector } from "../../hooks/hooks";
import Header from "../../shared-components/Header/Header";
import FavoritesRecipes from "./components/FavoritesRecipes/FavoritesRecipes";

const FavoritesPage = () => {
    const {favoriteRecipes} = useAppSelector(state=> state.favoriteRecipes);

    return (
        <div>
            <div className="container">
                <Header isSearch={true} recipes={favoriteRecipes}/>
                <FavoritesRecipes />
            </div>
        </div>
    )
}

export default FavoritesPage;