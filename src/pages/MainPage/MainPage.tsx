import Header from "../../shared-components/Header/Header";
import RecipeList from "./RecipeList/RecipeLIst";
import SortByCategories from "../../shared-components/SortByCategories/SortByCategories";
import Tags from "../../shared-components/Tags/Tags";
import {useEffect} from 'react';
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchRecipes, setCurrentFilteredRecipes } from '../../store/reducers/RecipesListSlice';
import './MainPage.scss';

const MainPage = () => {
    const dispatch = useAppDispatch();
    const localUser = localStorage.getItem('user');
    const localUserParsedId = localUser && JSON.parse(localUser)["uid"];

    useEffect(() => {
        dispatch(fetchRecipes(localUserParsedId));
    }, [dispatch]);

    return (
        <>
            <Header isSearch={true} /> 
            <section className="main">
                <div className="container">
                    <div className="main__top">
                        <Tags />
                        <SortByCategories />
                    </div>
                    <RecipeList />
                </div>
            </section>
        </>
    )
}

export default MainPage;
