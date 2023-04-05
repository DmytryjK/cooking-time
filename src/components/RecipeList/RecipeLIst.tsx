import {useEffect, useState} from 'react';
import './RecipeLIst.scss';
import { useAppSelector, useAppDispatch
 } from '../../hooks/hooks';

import { fetchRecepies, delRecepie, postRecepie, addNewRecepie } from './RecepieListSlice';
import { cloneRecepies } from '../Filters/FiltersSlice';

import type { Recepie } from './RecepieListSlice';
import nextId from "react-id-generator";

const RecipeLIst = () => {
    const {recepies, error, loading} = useAppSelector(state => state.recepies);
    const {filteredRecepies} = useAppSelector(state => state.filters);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchRecepies());
    }, [dispatch]);

    useEffect(() => {
        if (loading === 'succeeded') {
            dispatch(cloneRecepies(recepies));
        }
    }, [loading])

    const handleClickDelete = (id: string | number) => {
        dispatch(delRecepie(id));
    }

    const addSomeone = () => {
        dispatch(postRecepie(
            {
                id: 10, 
                title: "Fry potato", 
                time: 30, 
                ingredients: ["potato", "oil"], 
                img: "https://www.allrecipes.com/thmb/-Qlhx70a3HwawPd51kSIiGj-hpE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4488416-0627cab55d4e44ec80f974fbc67befb7.jpg"
            }
        ));
    }

    const renderItems = (items: Recepie[]) => {
        if (items) {
            const renderedList = items.map(item => {
                const {ingredients, id, title, time, img} = item;

                const renderedTags = ingredients?.map(item => {
                    return (
                        <li key={nextId("tag-id-")} className="product-tags__item">{item}</li>
                    )
                });

                return(
                    <li key={id} className="recipe-list__item">
                        <div className="recipe-list__top">
                            <h2 className="recipe-list__title">{title}</h2>
                            <span className="recipe-list__timer">{time ? time : null}</span>
                        </div>
                        <ul className="recipe-list__product-tags product-tags">
                            <li className="product-tags__item-header">
                                <h3 className="recipe-list__subtitle">Ингредиенты:</h3>
                            </li>
                            {renderedTags ? renderedTags : null}
                        </ul>
                        <div className="recipe-list__img-wrapper">
                            <img className="recipe-list__image" src={img} alt={title} />
                        </div>
                        <button 
                            className="recipe-list__more"
                            onClick={() => handleClickDelete(id)}
                        >Подробнее...</button>
                        <button className="recipe-list__more"
                        onClick={addSomeone}>add recepie</button>
                    </li>
                )
            })
            return renderedList;
        }

    }
    
    
    const render = renderItems(filteredRecepies);

    return (
        <ul className='recipe-list'>
            {render}
        </ul>
    )
}

export default RecipeLIst;

