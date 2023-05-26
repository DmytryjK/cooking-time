import Header from "../components/Header/Header";
import RecipeLIst from "../components/RecipeList/RecipeLIst";
import FavoritesRecipes from "../components/FavoritesRecipes/FavoritesRecipes";
import { useAppSelector } from "../hooks/hooks";

const Favorites = () => {
    const recepies = useAppSelector(state=> state.favoriteRecipes.favoriteRecipes)
    const {uid} = useAppSelector(state => state.authentication.user);

    return (
        <div>
            <div className="container">
                <Header isSearch={true} recepies={recepies}/>
                <FavoritesRecipes />
            </div>
        </div>
    )
}

export default Favorites;