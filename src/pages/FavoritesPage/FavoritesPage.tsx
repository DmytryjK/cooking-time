import { useAppSelector } from "../../hooks/hooks";
import Header from "../../shared-components/Header/Header";
import FavoritesRecipes from "./components/FavoritesRecipes/FavoritesRecipes";

const FavoritesPage = () => {
    const recepies = useAppSelector(state=> state.favoriteRecipes.favoriteRecipes);

    return (
        <div>
            <div className="container">
                <Header isSearch={true} recepies={recepies}/>
                <FavoritesRecipes />
            </div>
        </div>
    )
}

export default FavoritesPage;