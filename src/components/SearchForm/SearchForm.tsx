import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { filterRecepiesByName, addSearchTag } from '../Filters/FiltersSlice';

import type { Recepies } from '../../types/type';

import './SearchForm.scss';

import nextId from "react-id-generator";

const SearchForm = () => {
    const recepies = useAppSelector(state => state.recepies);
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    
    const handleSearchClick = (value: string, recepies: Recepies) => {
        dispatch(filterRecepiesByName({...recepies, value}));
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        !event.target.value && dispatch(filterRecepiesByName({...recepies, value: ""}))
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if ((event.code === 'Comma' || event.code === 'Slash') && inputValue !== '') {
            event.preventDefault();
            dispatch(addSearchTag({
                id: nextId("createdTag"), 
                tagText: inputValue
            }));
            setInputValue('');
        } 
        if (event.code === 'Enter' && inputValue !== '') {
            const value = inputValue;
            dispatch(filterRecepiesByName({...recepies, value}));
        } 
    }

    return (
        <div className="searchForm">
            <div className="searchForm__input-wrapper">
                <input className="searchForm__searchByName" 
                    type="text" 
                    value={inputValue} 
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите название блюда..." />
                <button className="searchForm__searchBtn"
                    onClick={() => handleSearchClick(inputValue, recepies)}>
                    <svg className="searchForm__searchBtn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15zm-3.847-8.699a2 2 0 1 0 2.646 2.646 4 4 0 1 1-2.646-2.646z"/></svg>
                </button>
            </div>
        </div>
    )
}

export default SearchForm;
