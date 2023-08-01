import Header from "../../shared-components/Header/Header";
import FavoriteRecipeList from "./components/FavoritesRecipes/FavoriteRecipeList";
import Filters from "../../shared-components/Filters/Filters";
import './FavoritesPage.scss';
import { useAppSelector } from "../../hooks/hooks";

const FavoritesPage = () => {
    const uid = useAppSelector(store => store.authentication.user.uid);
    const favoriteRecipes = useAppSelector(store => store.favoriteRecipes.favoriteRecipes);
    return (
        <>
            <Header isSearch={true} />
            <section className="favorites">
                <div className="container">
                    {uid && favoriteRecipes.length > 0 && <Filters />}
                    <FavoriteRecipeList />
                </div>
            </section>
        </>
    )
};

export default FavoritesPage;
