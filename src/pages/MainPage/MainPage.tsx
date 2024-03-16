import { useEffect } from 'react';
import RecipeList from './RecipeList/RecipeLIst';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchRecipes } from '../../store/reducers/RecipesListSlice';
import { fetchFavoritesRecipes } from '../../store/reducers/FavoritesRecipesSlice';
import Filters from '../../shared-components/Filters/Filters';
import './MainPage.scss';

const MainPage = () => {
    const dispatch = useAppDispatch();
    const localUser = localStorage.getItem('user');
    const localUserParsedId = localUser && JSON.parse(localUser).uid;
    const recipes = useAppSelector((state) => state.recipes.recipes);
    const loadingRecipes = useAppSelector(
        (state) => state.recipes.loadingRecipes
    );
    const loadingFavorites = useAppSelector(
        (state) => state.favoriteRecipes.loadingRecipesById
    );
    const uid = useAppSelector((state) => state.authentication.user.uid);

    useEffect(() => {
        if (recipes.length === 0 && loadingRecipes === 'idle') {
            dispatch(fetchRecipes(localUserParsedId));
            if (loadingFavorites !== 'succeeded') {
                dispatch(fetchFavoritesRecipes(uid));
            }
        }
    }, []);

    return (
        <section className="main">
            <div className="container">
                <Filters title="Всі рецепти" />
                <RecipeList />
            </div>
        </section>
    );
};

export default MainPage;
