import {useEffect, useState} from 'react';
import './RecipeLIst.scss';
import { useAppSelector, useAppDispatch
 } from '../../hooks/hooks';

import { fetchRecepies } from './RecepieListSlice';
import { cloneRecepies } from '../Filters/FiltersSlice';

import type { Recepie } from '../../types/type';
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

    const renderItems = (items: Recepie[]) => {
        
        if (items) {
            const renderedList = items.map(item => {
                
                const {ingredients, id, title, time, img, description} = item;
                const substrDescr = description ? description?.substring(0, 250) + '...' : '';
                const timerClass = time ? "recipe-list__timer active" : "recipe-list__timer";
                const renderedTags = ingredients?.map(item => {
                    return (
                        <li key={nextId("tag-id-")} className="product-tags__item">{item}</li>
                    )
                });
                
                return(
                    <li key={id} className="recipe-list__item">
                        <div className="recipe-list__img-wrapper">
                            <img 
                                className="recipe-list__image"
                                src={img} 
                                alt={title} />
                        </div>
                        <div className="recipe-list__content-wrapper">
                            <div className="recipe-list__content-text">
                                <h2 className="recipe-list__title" title={title}>{title.length > 42 ? (title.substring(0, 42) + '...') : title}</h2>
                                <span className={timerClass}>{time ? time + 'min' : null}</span>
                                <ul className="recipe-list__product-tags product-tags">
                                    {/* <li className="product-tags__item-header">
                                        <h3 className="recipe-list__subtitle">Ингредиенты:</h3>
                                    </li> */}
                                    {renderedTags ? renderedTags : null}
                                </ul>
                                {/* <div className="recipe-list__content-descr">
                                    {substrDescr.substring(0, 50) + '...'}
                                </div> */}
                            </div>
                            <div className="recipe-list__more">
                                <a 
                                    className="recipe-list__more-link" 
                                    href={`/about-recepie/${id}`}>
                                    Подробнее...</a>
                            </div>
                            
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
