import Header from "../components/Header/Header";
import RecipeLIst from "../components/RecipeList/RecipeLIst";

import {useEffect} from 'react';
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { fetchRecepies } from "../components/RecipeList/RecepieListSlice";

const Main = () => {
    const { recepies, error, loading } = useAppSelector(state => state.recepies);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchRecepies());
    }, [dispatch]);

    return (
        <div>
            <div className="container">
                <Header isSearch={true} recepies={recepies}/> 
                <RecipeLIst fetchedRecipes={recepies} loadStatus={loading}/>
            </div>
        </div>
    )
}

export default Main;