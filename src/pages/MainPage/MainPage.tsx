import Header from "../../shared-components/Header/Header";
import RecipeList from "../../shared-components/RecipeList/RecipeLIst";
import {useEffect} from 'react';
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { fetchRecipes } from '../../store/reducers/RecipesListSlice';
import './MainPage.scss';

const MainPage = () => {
    const {recipes, loadingRecipes} = useAppSelector(state => state.recipes);
    const dispatch = useAppDispatch();
    const localUser = localStorage.getItem('user');
    const localUserParsedId = localUser && JSON.parse(localUser)["uid"];

    useEffect(() => {
        dispatch(fetchRecipes(localUserParsedId));
    }, [dispatch]);

    return (
        <>
            <Header isSearch={true} recipes={recipes}/> 
            <section className="main">
                <div className="container">
                    <RecipeList />
                </div>
            </section>
        </>
    )
}

export default MainPage;
