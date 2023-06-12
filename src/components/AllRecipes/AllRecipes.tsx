import RecipeLIst from "../RecipeList/RecipeLIst";
import {useEffect} from 'react';
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { fetchRecepies } from "./AllRecipesSlice";

const AllRecipes = () => {
    const { recepies, error, loading } = useAppSelector(state => state.allRecipes);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchRecepies());
    }, [dispatch]);

    return (
        <RecipeLIst fetchedRecipes={recepies} loadStatus={loading}/>
    )
}

export default AllRecipes;