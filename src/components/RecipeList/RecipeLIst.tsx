import {useEffect, useState} from 'react';
import './RecipeLIst.scss';
import { useAppSelector, useAppDispatch
 } from '../../hooks/hooks';

import { fetchRecepies, delRecepie } from './RecepieListSlice';
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
    }, [loading, recepies]);

    const handleClickDelete = (id: string | number) => {
        dispatch(delRecepie(id));
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
                        <div className="recipe-list__content-wrapper">
                            <div className="recipe-list__img-wrapper">
                                <img className="recipe-list__image" src={img} alt={title} />
                            </div>
                            <button className="recipe-list__more">Подробнее...</button>
                        </div>
                        
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

