import Header from "../../shared-components/Header/Header";
import FavoriteRecipeList from "./components/FavoritesRecipes/FavoriteRecipeList";

const FavoritesPage = () => {
    return (
        <>
            <Header isSearch={true} />
            <section className="favorites">
                <div className="container">
                    <FavoriteRecipeList />
                </div>
            </section>
        </>
    )
};

export default FavoritesPage;
