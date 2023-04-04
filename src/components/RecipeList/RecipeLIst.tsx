import {useEffect, useState} from 'react';
import './RecipeLIst.scss';
import { useAppSelector, useAppDispatch
 } from '../../hooks/hooks';
 import { addNewRecepie, deleteRecepie } from './RecepieListSlice';
 import { fetchRecepies } from './RecepieListSlice';

const RecipeLIst = () => {
    const recepies = useAppSelector(state => state.recepies.recepies);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchRecepies());
    }, [])

    useEffect (() => {
        console.log(recepies);
    }, [recepies])

    return (
        <ul className='recipe-list'>
            <li className="recipe-list__item">
                <div className="recipe-list__top">
                    <h2 className="recipe-list__title">Алкогольный коктейль</h2>
                    <span className="recipe-list__timer">20 мин.</span>
                </div>
                <ul className="recipe-list__product-tags product-tags">
                    <li className="product-tags__item-header">
                        <h3 className="recipe-list__subtitle">Ингредиенты:</h3>
                    </li>
                    <li className="product-tags__item">Лимон</li>
                    <li className="product-tags__item">Апельсин</li>
                    <li className="product-tags__item">Лайм</li>
                    <li className="product-tags__item">Вода</li>
                </ul>
                <div className="recipe-list__img-wrapper">
                    <img className="recipe-list__image" src="https://c4.wallpaperflare.com/wallpaper/153/359/713/coctail-lime-carambola-wallpaper-preview.jpg" alt="" />
                </div>
                <button className="recipe-list__more">Подробнее...</button>
            </li>
            <li className="recipe-list__item">
                <div className="recipe-list__top">
                    <h2 className="recipe-list__title">Алкогольный коктейль</h2>
                    <span className="recipe-list__timer">20 мин.</span>
                </div>
                <ul className="recipe-list__product-tags product-tags">
                    <li className="product-tags__item-header">
                        <h3 className="recipe-list__subtitle">Ингредиенты:</h3>
                    </li>
                    <li className="product-tags__item">Лимон</li>
                    <li className="product-tags__item">Апельсин</li>
                    <li className="product-tags__item">Лайм</li>
                    <li className="product-tags__item">Вода</li>
                </ul>
                <div className="recipe-list__img-wrapper">
                    <img className="recipe-list__image" src="https://c4.wallpaperflare.com/wallpaper/153/359/713/coctail-lime-carambola-wallpaper-preview.jpg" alt="" />
                </div>
                <button className="recipe-list__more">Подробнее...</button>
            </li>
            <li className="recipe-list__item">
                <div className="recipe-list__top">
                    <h2 className="recipe-list__title">Алкогольный коктейль</h2>
                    <span className="recipe-list__timer">20 мин.</span>
                </div>
                <ul className="recipe-list__product-tags product-tags">
                    <li className="product-tags__item-header">
                        <h3 className="recipe-list__subtitle">Ингредиенты:</h3>
                    </li>
                    <li className="product-tags__item">Лимон</li>
                    <li className="product-tags__item">Апельсин</li>
                    <li className="product-tags__item">Лайм</li>
                    <li className="product-tags__item">Вода</li>
                </ul>
                <div className="recipe-list__img-wrapper">
                    <img className="recipe-list__image" src="https://c4.wallpaperflare.com/wallpaper/153/359/713/coctail-lime-carambola-wallpaper-preview.jpg" alt="" />
                </div>
                <button className="recipe-list__more">Подробнее...</button>
            </li>
        </ul>
    )
}

export default RecipeLIst;

