import {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import nextId from "react-id-generator";
import { fetchRecipe, setFavoriteRecipes } from '../../store/reducers/RecipesListSlice';
import { manageFavoritesRecipes, fetchFavoritesRecipe } from '../../store/reducers/FavoritesRecipesSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';
import EditRecipeForm from './components/EditRecipeForm/EditRecipeForm';
import { Recipe } from '../../types/type';
import iconsSprite from '../../assets/icons/about-recipe/sprite.svg';
import timerIcon from '../../assets/icons/timer-line2.svg';
import parse from 'html-react-parser';
import renderServerData from '../../helpers/renderServerData';
import './AboutRecipePage.scss';

const AboutRecipePage = () => {
    const recepieId = useParams();
    const { recipe, loadingRecipe, error } = useAppSelector(state => state.recipes);
    const favoriteRecipe = useAppSelector(state => state.favoriteRecipes.favoriteRecipes).filter(recipe => recipe.id === recepieId.id);
    const loadingRecipesToFirebase = useAppSelector(state => state.favoriteRecipes.loadingRecipeIdToFirebase);
    const { uid } = useAppSelector(state => state.authentication.user);
    const dispatch = useAppDispatch();
    const [isEditActive, setIsEditActive] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [currentRecipeToEdit, setCurrentRecipeToEdit] = useState<Recipe | null>(null);
    const [isShowEditBtn, setIsShowEditBtn] = useState(false);
    const [attentionWindowOpen, setAttentionWindowOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!recipe) return;
        if (recipe.author === uid) {
            setIsShowEditBtn(true);
        } else {
            setIsShowEditBtn(false);
        }
    }, [uid, recipe]);

    useEffect(() => {
        if (favoriteRecipe.length === 0) {
            setIsFavorite(false);
        } else {
            setIsFavorite(true);
        }
    }, [favoriteRecipe]);

    useEffect(() => {
        if(!recepieId.id) return;
        dispatch(fetchRecipe(recepieId.id));
        if (!uid) return;
        dispatch(fetchFavoritesRecipe(uid));
    }, [uid]);

    useEffect(() => {
        if (loadingRecipesToFirebase !== 'succeeded') return;
        dispatch(fetchFavoritesRecipe(uid));
    }, [loadingRecipesToFirebase]);

    const handleCloseAttantionWindow = () => {
        setAttentionWindowOpen(false);
        setIsEditActive(true);
    }

    const handleEditRecipe = (fetchedRecepieInfo: Recipe) => {
        setIsEditActive(true);
        setCurrentRecipeToEdit(fetchedRecepieInfo);
    }

    const handleAddFavorite = (recepieId: string | number | null, item: Recipe) => {
        dispatch(manageFavoritesRecipes({recepieId, uid}));
        dispatch(setFavoriteRecipes({recipeId: recepieId, isFavorite: !item.favorites}));
    };

    // const renderedInfo = () => {
    //     if (!recipe) return '';
    //     const {title, ingredients, img, description, category, id, time} = recipe;
    //     const parsedDescr = parse(description || '');
    //     return (
    //         <>
    //             <div className="recipe-page__top">
    //                 <div className="recipe-page__top-btns">
    //                     {isShowEditBtn ? <button className="recipe-page__edit-btn"
    //                         title="редактировать"
    //                         onClick={() => handleEditRecipe(recipe)}>
    //                             <svg 
    //                                 width="20" 
    //                                 height="20" 
    //                                 viewBox="0 0 20 20"
    //                             >
    //                                 <use href={`${iconsSprite}/#edit`}></use>
    //                             </svg>
    //                     </button> : ''}
    //                     <button className={`recipe-page__favorite-btn ${isFavorite ? 'btn-active' : ''}`}
    //                         title="в обране"
    //                         onClick={() => handleAddFavorite(id, recipe)}>
    //                             <svg 
    //                                 width="22" 
    //                                 height="22" 
    //                                 viewBox="0 0 22 22"
    //                             >
    //                                 <use href={`${iconsSprite}#heart`}></use>
    //                             </svg>

    //                     </button>
    //                 </div>
    //                 <div className="recipe-page__top-wrapper">
    //                     <h2 className="recipe-page__title">{title}</h2>
    //                     <span className="recipe-page__categories">{category}</span>
    //                 </div>
    //                 <div className="recipe-page__photo-wrapper">
    //                     <img className="recipe-page__photo" src={img} alt="фото" />
    //                 </div>
    //             </div>
    //             <div className="recipe-page__content">
    //                 <div className="recipe-page__left-col">
    //                     <div className="recipe-page__left-fixed">
    //                         <div className="recipe-page__cooking-time">
    //                             <h3 className="recipe-page__ingredients-title recipe-titles">Час приготування</h3>
    //                             <div className="recipe-page__time-inner">
    //                                 <img className="recipe-page__time-icon" src={timerIcon} alt="час" />
    //                                 <span className="recipe-page__time-text">{time.hours} {time.minutes}</span>
    //                             </div>
    //                         </div>
    //                         <div className="recipe-page__ingredients">
    //                             <h3 className="recipe-page__ingredients-title recipe-titles">Інгредієнти</h3>
    //                             <ul className="recipe-page__ingredients-list">
    //                                 {ingredients?.map(ingredient => {
    //                                     return(
    //                                         <li 
    //                                         key={nextId("ingredient-")}
    //                                         className="recipe-page__ingredients-item">
    //                                             <span className="ingredients-item__character">
    //                                             {ingredient.tagText}
    //                                             </span>
    //                                             <span className="ingredients-item__quantity">
    //                                             {ingredient.tagQuantityWithUnit} {ingredient.tagUnit}
    //                                             </span>
    //                                         </li>
    //                                     )
    //                                 })}

    //                             </ul>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div className="recipe-page__cooking-descr">
    //                     <h3 className="recipe-page__descr-title recipe-titles">Процес приготування</h3>
    //                     <div className="recipe-page__descr">{parsedDescr}</div>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }
    
    return(
        <>
            <Header isSearch={false} />
            <section className="about-recipe">
                <div className="container">
                    {/* <main className="recipe-page">
                        {isEditActive && currentRecipeToEdit ? <EditRecipeForm recipe={currentRecipeToEdit} setIsAttentionOpen={setAttentionWindowOpen}/> : renderServerData({
                                error,
                                errorText: 'Упс, щось пішло не так :( Спробуйте оновити сторінку!',
                                loading: loadingRecipe,
                                content: renderedInfo,
                        })}
                    </main> */}
                    <div className={attentionWindowOpen ? "success-window active" : "success-window"}> 
                        <div className="success-window__block">
                            <h2 className="success-window__title">Ви впевнені, що хочете закрити редактор? Зміни не буде збережено.</h2>
                            <div className="success-window__links">
                                <button 
                                    className="success-window__back-main"
                                    onClick={() => navigate(0)}
                                >Так, закрити</button>
                                    
                                <button 
                                    className="success-window__back"
                                    onClick={() => setAttentionWindowOpen(false)}
                                >Продовжити зміни</button>
                            </div>
                            <button          
                                className="success-window__close"
                                onClick={() => setAttentionWindowOpen(false)}
                            >X</button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default AboutRecipePage;
