import { useEffect, FC } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import RecipeListItem from '../RecipeListItem/RecipeListItem';
import { setFavoriteRecipes, setCurrentRecipes } from '../../store/reducers/RecipesListSlice';
import { manageFavoritesRecipes } from '../../store/reducers/FavoritesRecipesSlice';
import Loader from '../Loader/Loader';
import nextId from "react-id-generator";
import { useLocation } from 'react-router-dom';
import type { Recepie } from '../../types/type';
import './RecipeLIst.scss';
import ErrorMesage from '../ErrorMesage/ErrorMesage';

const RecipeList: FC = () => {

    const { error, loadingRecipes } = useAppSelector(state => state.recipes);
    const { loadingRecipeIdToFirebase, currentFavoriteId, loadingRecipesById } = useAppSelector(state => state.favoriteRecipes);
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
        return items.map((item) => {
            return(
                <li key={nextId("recipe-card-")} className="recipe-list__item">
                    <RecipeListItem recipe={item} addToFavorite={handleAddFavorite}/>
                </li>
            )
        })
    }
    
    const renderCards = () => {
        let render = null;
        if (error) {
            render = <ErrorMesage text={'Щось пішло не так, спробуйте ще раз'} />;
        } else if ( 
            (
                loadingRecipes === 'succeeded' && 
                loadingRecipesById === 'succeeded' ) && 
                filteredRecepies.length === 0
            ) {
            render = <ErrorMesage text={'За вашим запитом нічого не знайдено'} />
        } else if (filteredRecepies.length !== 0) {
            render = renderItems(filteredRecepies);
        } else {
            render = <Loader />;
        }
        return render;
    }
    
    return (
        <ul className='recipe-list'>
            {renderCards()}
        </ul>
    )
}

export default RecipeList;
