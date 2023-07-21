import { useEffect, FC } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import RecipeListItem from '../RecipeListItem/RecipeListItem';
import { setFavoriteRecipes, setCurrentRecipes } from '../../store/reducers/RecipesListSlice';
import { manageFavoritesRecipes } from '../../store/reducers/FavoritesRecipesSlice';
import nextId from "react-id-generator";
import { useLocation } from 'react-router-dom';
import type { Recepie } from '../../types/type';
import './RecipeLIst.scss';
interface RecipeListProps {
    fetchedRecipes: Recepie[];
    loadStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const RecipeList: FC<RecipeListProps> = ({fetchedRecipes, loadStatus}) => {

    const { error } = useAppSelector(state => state.recipes);
    const { loadingRecipeIdToFirebase, currentFavoriteId } = useAppSelector(state => state.favoriteRecipes);
    const { filteredRecepies } = useAppSelector(state => state.filters);
    const { uid } = useAppSelector(state => state.authentication.user);

    const dispatch = useAppDispatch();
    const currentLink = useLocation().pathname;

    useEffect(() => {
        if (currentLink === '/favorites' && loadingRecipeIdToFirebase === 'succeeded') {
            const removedItem = filteredRecepies.filter(item => item.id !== currentFavoriteId);
            dispatch(setCurrentRecipes(removedItem));
        }
    }, [loadingRecipeIdToFirebase]);

    const handleAddFavorite = (recepieId: string | number | null, item: Recepie) => {
        dispatch(manageFavoritesRecipes({recepieId, uid}));
        dispatch(setFavoriteRecipes({recipeId: recepieId, isFavorite: !item.favorites}));
    };

    const renderItems = (items: Recepie[]) => {
        if (items) {
            const renderedList = items.map((item) => {
                return(
                    <li key={nextId("recipe-card-")} className="recipe-list__item">
                        <RecipeListItem recipe={item} addToFavorite={handleAddFavorite}/>
                    </li>
                )
            })
            return renderedList;
        }
    }
    
    return (
        <ul className='recipe-list'>
            {renderItems(filteredRecepies)}
        </ul>
    )
}

export default RecipeList;
