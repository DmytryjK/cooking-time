import { useEffect } from 'react';
import RecipeList from './RecipeList/RecipeLIst';
import { useAppDispatch } from '../../hooks/hooks';
import { fetchRecipes } from '../../store/reducers/RecipesListSlice';
import Filters from '../../shared-components/Filters/Filters';
import './MainPage.scss';

const MainPage = () => {
    const dispatch = useAppDispatch();
    const localUser = localStorage.getItem('user');
    const localUserParsedId = localUser && JSON.parse(localUser).uid;

    useEffect(() => {
        dispatch(fetchRecipes(localUserParsedId));
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
