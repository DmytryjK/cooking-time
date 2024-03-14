import { FC, useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import {
    setCurrentFilteredRecipes,
    setCurrentRecipes,
} from '../../../../store/reducers/RecipesListSlice';
import {
    fetchFavoritesRecipe,
    manageFavoritesRecipes,
} from '../../../../store/reducers/FavoritesRecipesSlice';
import EmptyFavoriteList from '../EmptyFavoriteList/EmptyFavoriteList';
import UnauthorizedFavoriteList from '../UnauthorizedFavoriteList/UnauthorizedFavoriteList';
import renderServerData from '../../../../helpers/renderServerData';
import RecipeListItem from '../../../../shared-components/RecipeListItem/RecipeListItem';
import { Recipe } from '../../../../types/type';
import './FavoriteRecipeList.scss';

const FavoriteRecipeList: FC = () => {
    const favoriteRecipes = useAppSelector(
        (state) => state.favoriteRecipes.favoriteRecipes
    );
    const loading = useAppSelector(
        (state) => state.favoriteRecipes.loadingRecipesById
    );
    const error = useAppSelector((state) => state.favoriteRecipes.error);
    const filteredRecipes: Recipe[] = useAppSelector(
        (state) => state.recipes.filteredRecipes
    );
    const { uid } = useAppSelector((state) => state.authentication.user);
    const [isAnimate, setIsAnimate] = useState<{
        id: string | number | null;
        animate: boolean;
    }>({ id: null, animate: false });
    const [animateOnLoading, setAnimateOnLoading] = useState(false);

    const dispatch = useAppDispatch();
    const nodeRef = useRef(null);

    useEffect(() => {
        if (uid) {
            dispatch(fetchFavoritesRecipe(uid));
        }
    }, [uid]);

    useEffect(() => {
        if (loading !== 'succeeded') return;
        dispatch(setCurrentRecipes(favoriteRecipes));
        dispatch(setCurrentFilteredRecipes(favoriteRecipes));
    }, [loading, favoriteRecipes]);

    useEffect(() => {
        if (loading !== 'succeeded') {
            setAnimateOnLoading(false);
            return;
        }
        setTimeout(() => {
            setAnimateOnLoading(true);
        }, 200);
    }, [loading]);

    const registerAttention = () => {
        return <UnauthorizedFavoriteList />;
    };

    const handleAddFavorite = (recepieId: string | number | null) => {
        dispatch(manageFavoritesRecipes({ recepieId, uid }));
    };

    const renderItems = () => {
        if (loading === 'succeeded' && favoriteRecipes.length === 0) {
            return <EmptyFavoriteList />;
        }
        return filteredRecipes.map((item) => {
            return (
                <CSSTransition
                    key={`favorites-${item.id}`}
                    className={`recipe-list__item ${
                        animateOnLoading ? '' : 'recipe-list__item_not-show'
                    }`}
                    in={animateOnLoading}
                    nodeRef={nodeRef.current}
                    timeout={400}
                >
                    <li className="recipe-list__item" ref={nodeRef.current}>
                        <RecipeListItem
                            recipe={item}
                            addToFavorite={handleAddFavorite}
                            isAnimate={isAnimate}
                            setIsAnimate={setIsAnimate}
                        />
                    </li>
                </CSSTransition>
            );
        });
    };

    return (
        <ul className="recipe-list-favorites">
            <TransitionGroup className="recipe-list">
                {uid
                    ? renderServerData({
                          loading,
                          error,
                          errorText: 'Щось пішло не так, спробуйте ще раз',
                          content: renderItems,
                      })
                    : registerAttention()}
            </TransitionGroup>
        </ul>
    );
};

export default FavoriteRecipeList;
