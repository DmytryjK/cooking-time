import { useParams } from 'react-router-dom';
import {useEffect, useState} from 'react';

import nextId from "react-id-generator";
import sanitizeHtml from 'sanitize-html';

import { fetchRecipe } from '../../store/reducers/RecipesListSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';
import EditRecipeForm from './components/EditRecipeForm/EditRecipeForm';

import './AboutRecipePage.scss';
import { Recipe } from '../../types/type';

const AboutRecipePage = () => {
    const recepieId = useParams();
    const { recipe } = useAppSelector(state => state.recipes);
    const dispatch = useAppDispatch();
    const [isEditActive, setIsEditActive] = useState<boolean>(false);
    const [currentRecipeToEdit, setCurrentRecipeToEdit] = useState<Recipe | null>(null);

    const [attentionWindowOpen, setAttentionWindowOpen] = useState<boolean>(false);

    const handleCloseAttantionWindow = () => {
        setAttentionWindowOpen(false);
        setIsEditActive(true);
    }

    useEffect(() => {
        dispatch(fetchRecipe(recepieId.id));
    }, []);

    const handleEditRecipe = (fetchedRecepieInfo: Recipe) => {
        setIsEditActive(true);
        setCurrentRecipeToEdit(fetchedRecepieInfo);
    }

    const renderedInfo = () => {
        let result;
        if (recipe) {
            const {title, ingredients, img, description} = recipe;
            const sanitizedHtml = description && sanitizeHtml(description);

            result = <>
                        <button 
                            className="recepie-page__edit"
                            title="редактировать"
                            onClick={() => handleEditRecipe(recipe)}>
                        </button>
                        <h2 className="recepie-page__title">{title}</h2>
                        <img className="recepie-page__photo" src={img} alt="фото" />
                        <div className="recepie-page__ingredients">
                            <h3 className="recepie-page__ingredients-title">Ингредиенты:</h3>
                            <ul className="recepie-page__ingredients-list">

                                {ingredients?.map(ingredient => {
                                    return(
                                        <li 
                                        key={nextId("ingredient-")}
                                        className="recepie-page__ingredients-item">{ingredient}</li>
                                    )
                                })}

                            </ul>
                        </div>
                        <div className="recepie-page__cooking-descr">
                            <h3 className="recepie-page__subtitle">Процесс приготовления:</h3>
                            <div 
                                className="recepie-page__descr" 
                                dangerouslySetInnerHTML={{ __html: sanitizedHtml ? sanitizedHtml : '' }} />
                        </div>
                    </>
        }
        return result;
    }
    
    return(
        <>
            <Header isSearch={false} />
            <section className="about-recipe">
                <div className="container">
                    
                    <div className={attentionWindowOpen ? "success-window active" : "success-window"}> 
                        <div className="success-window__block">
                            <h2 className="success-window__title">Вы уверены, что хотите закрыть редактор? Все изменения будут отменены.</h2>
                            <div className="success-window__links">
                                <button 
                                    className="success-window__back-main">Закрыть редактор</button>
                                <button 
                                    className="success-window__back">Вернуться</button>
                            </div>
                            <button          
                                className="success-window__close"
                            ></button>
                        </div>
                    </div>
                    <main className="recepie-page">
                        {isEditActive && currentRecipeToEdit ? <EditRecipeForm recipe={currentRecipeToEdit} setIsAttentionOpen={setAttentionWindowOpen}/> : renderedInfo()}
                    </main>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default AboutRecipePage;