import { useState, FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { filterRecepiesByName, addSearchTag } from '../Filters/FiltersSlice';

import type { Recepie } from '../../types/type';

import './SearchForm.scss';

import nextId from "react-id-generator";

const SearchForm: FC<{recepies:Recepie[]}> = ({recepies}) => {
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    
    const handleSearchClick = (value: string, recepies: Recepie[]) => {
        dispatch(filterRecepiesByName({recepies, value}));
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        !event.target.value && dispatch(filterRecepiesByName({recepies, value: ""}))
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
            dispatch(filterRecepiesByName({recepies, value}));
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
                    <svg className="searchForm__searchBtn-icon" width="18" height="18" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.8">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.25 3.5C5.3505 3.5 3 5.8505 3 8.75C3 11.6495 5.3505 14 8.25 14C11.1495 14 13.5 11.6495 13.5 8.75C13.5 5.8505 11.1495 3.5 8.25 3.5ZM1.5 8.75C1.5 5.02208 4.52208 2 8.25 2C11.9779 2 15 5.02208 15 8.75C15 12.4779 11.9779 15.5 8.25 15.5C4.52208 15.5 1.5 12.4779 1.5 8.75Z" fill="#303030"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.957 12.457C12.2499 12.1641 12.7247 12.1641 13.0176 12.457L16.2801 15.7195C16.573 16.0124 16.573 16.4872 16.2801 16.7801C15.9872 17.073 15.5124 17.073 15.2195 16.7801L11.957 13.5176C11.6641 13.2247 11.6641 12.7499 11.957 12.457Z" fill="#303030"/>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default SearchForm;
