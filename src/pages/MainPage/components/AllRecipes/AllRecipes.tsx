import RecipeList from "../../../../shared-components/RecipeList/RecipeLIst";
import {useEffect} from 'react';
import { useAppSelector, useAppDispatch } from "../../../../hooks/hooks";
import { fetchRecepies } from "./AllRecipesSlice";

const AllRecipes = () => {
    const { recepies, error, loading } = useAppSelector(state => state.allRecipes);
    const dispatch = useAppDispatch();

    const localUser = localStorage.getItem('user');
    const localUserParsedId = localUser && JSON.parse(localUser)["uid"];

    useEffect(() => {
        dispatch(fetchRecepies(localUserParsedId));
    }, [dispatch]);


    return (
        <RecipeList fetchedRecipes={recepies} loadStatus={loading}/>
    )
}

export default AllRecipes;