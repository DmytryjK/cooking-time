import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';
import FavoriteRecipeList from './components/FavoritesRecipes/FavoriteRecipeList';
import Filters from '../../shared-components/Filters/Filters';
import './FavoritesPage.scss';
import { useAppSelector } from '../../hooks/hooks';

const FavoritesPage = () => {
    const uid = useAppSelector((store) => store.authentication.user.uid);
    const favoriteRecipes = useAppSelector(
        (store) => store.favoriteRecipes.favoriteRecipes
    );
    return (
        <>
            <Header isSearch />
            <section className="favorites">
                <div className="container">
                    {uid && favoriteRecipes.length > 0 && (
                        <Filters title="Мої обрані" />
                    )}
                    <FavoriteRecipeList />
                </div>
            </section>
            <Footer />
        </>
    );
};

export default FavoritesPage;
