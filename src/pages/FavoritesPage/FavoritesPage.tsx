import { useAppSelector } from "../../hooks/hooks";
import Header from "../../shared-components/Header/Header";
import FavoritesRecipes from "./components/FavoritesRecipes/FavoritesRecipes";

const FavoritesPage = () => {
    const {favoriteRecipes} = useAppSelector(state=> state.favoriteRecipes);

    return (
        <>
            <Header isSearch={true} recipes={favoriteRecipes}/>
            <section className="favorites">
                <div className="container">
                    <FavoritesRecipes />
                </div>
            </section>
        </>
    )
}

export default FavoritesPage;
