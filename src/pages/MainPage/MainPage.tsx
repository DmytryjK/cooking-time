import Header from "../../shared-components/Header/Header";
import RecipeList from "./RecipeList/RecipeLIst";
import {useEffect} from 'react';
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchRecipes, setCurrentFilteredRecipes } from '../../store/reducers/RecipesListSlice';
import Filters from "../../shared-components/Filters/Filters";
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
                    <Filters />
                    <RecipeList />
                </div>
            </section>
        </>
    )
}

export default MainPage;
