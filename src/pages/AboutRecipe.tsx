import { useParams } from 'react-router-dom';
import {useEffect, useState} from 'react';

import nextId from "react-id-generator";
import sanitizeHtml from 'sanitize-html';

import { fetchRecepie } from '../components/RecipeList/RecepieListSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

import Header from '../components/Header/Header';
import EditRecipeForm from '../components/EditRecipeForm/EditRecipeForm';

import './AboutRecipe.scss';
import { Recepie } from '../types/type';

const AboutRecipe = () => {
    const recepieId = useParams();
    const {fetchedRecepieInfo} = useAppSelector(state => state.recepies);
    const dispatch = useAppDispatch();
    const [isEditActive, setIsEditActive] = useState<boolean>(false);
    const [currentRecipeToEdit, setCurrentRecipeToEdit] = useState<Recepie | null>(null);

    const [attentionWindowOpen, setAttentionWindowOpen] = useState<boolean>(false);

    const handleCloseAttantionWindow = () => {
        setAttentionWindowOpen(false);
        setIsEditActive(true);
    }

    useEffect(() => {
        dispatch(fetchRecepie(recepieId.id));
    }, []);

    const handleEditRecipe = (fetchedRecepieInfo: Recepie) => {
        setIsEditActive(true);
        setCurrentRecipeToEdit(fetchedRecepieInfo);
    }

    const renderedInfo = () => {
        let result;
        if (fetchedRecepieInfo) {
            const {title, ingredients, img, description} = fetchedRecepieInfo;
            const sanitizedHtml = description && sanitizeHtml(description);

            result = <>
                        <button 
                            className="recepie-page__edit"
                            title="редактировать"
                            onClick={() => handleEditRecipe(fetchedRecepieInfo)}>
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
        <div className="about-recipe">
            <div className="container">
                <Header isSearch={false} recepies={[]}/>

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
                    <div className="container">
                        {isEditActive && currentRecipeToEdit ? <EditRecipeForm recipe={currentRecipeToEdit} setIsAttentionOpen={setAttentionWindowOpen}/> : renderedInfo()}
                    </div>
                </main>
            </div>
        </div>
        
    )
}

export default AboutRecipe;