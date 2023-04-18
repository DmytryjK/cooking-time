import { useParams } from 'react-router-dom';
import {useEffect} from 'react';
import nextId from "react-id-generator";

import { fetchRecepie } from '../components/RecipeList/RecepieListSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

import './RecepieMore.scss';

const RecepieMore = () => {
    const recepieId = useParams();
    const {fetchedRecepieInfo} = useAppSelector(state => state.recepies);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchRecepie(recepieId.id));
    }, []);

    const renderedInfo = () => {
        let result;
        if (fetchedRecepieInfo) {
            const {title, ingredients, img, description} = fetchedRecepieInfo;
            result = <>
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
                            <div className="recepie-page__descr">{description}</div>
                        </div>
                    </>
        }
        return result;
    }
    

    return(
        <main className="recepie-page">
            <div className="container">
            {renderedInfo()} 
            </div>
        </main>
    )
}

export default RecepieMore;