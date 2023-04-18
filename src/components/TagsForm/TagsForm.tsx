import { useState, useEffect } from 'react';
import nextId from "react-id-generator";

import { tagsType } from '../../types/type';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { filterRecepiesByTag } from '../Filters/FiltersSlice';

import type { Recepie } from '../../types/type';

import './TagsForm.scss';

const TagsForm = () => {
    const [inputByTag, setInputByTag] = useState<string>('');
    const [createdTags, setCreatedTags] = useState<tagsType[]>([]);
    const dispatch = useAppDispatch();
    const {recepies} = useAppSelector(state => state.recepies);

    useEffect(() => {
        const tags = createdTags.map(createdTag => createdTag.tagText);
        dispatch(filterRecepiesByTag({recepies, tags}));
    }, [createdTags]);

    const handleChangeTag = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputByTag(value);

        if (value.indexOf(',') > 0) {

            setCreatedTags(() => [
                ...createdTags,
                {
                    id: nextId("createdTag"), 
                    tagText: value.slice(0, value.length - 1)
                }
            ]);
            setInputByTag(() => '');
            
        }
    }

    const handleKeyPress = (e :React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && inputByTag.length > 0) {
            setCreatedTags(() => [
                ...createdTags,
                {
                    id: nextId("createdTag"), 
                    tagText: inputByTag
                }
            ]);
            setInputByTag(() => '');
        }
        
    }

    const delBtnClicked = (id: string | number) => {
        const tagsAfterDelete = createdTags.filter(tag => tag.id !== id);
        setCreatedTags(tagsAfterDelete);
    }

    const handleSearch = (recepies: Recepie[], createdTags: tagsType[]) => {
        const tags = createdTags.map(createdTag => createdTag.tagText);
        dispatch(filterRecepiesByTag({recepies, tags}));
    }

    const deleteAllTags = () => {
        setCreatedTags([]);
    }

    const createNewTag = (tags: tagsType[]) => {
        const renderResult = tags.map(tag => {
            const {id, tagText} = tag;

            return (
                <li className="tagsForm__createdTag" key={id}>
                    {tagText}
                    <button 
                        className="tagsForm__closeTag"
                        onClick={() => delBtnClicked(id)}>
                    </button>
                </li>
            )
        })
        return renderResult;
    }

    const renderedTags = createdTags.length > 0 ? createNewTag(createdTags) : null;

    return (
        <fieldset className="tagsForm">          
            <legend className="tagsForm__header">Введите названия ингредиентов через запятую:</legend>
            <div className="tagsForm__top-wrapper">
                <input 
                className="tagsForm__tagName"
                type="text" 
                value={inputByTag} 
                onChange={(e) => {handleChangeTag(e)}}
                onKeyDown={handleKeyPress}/>
                <button 
                    className="tagsForm__search-btn"
                    onClick={() => handleSearch(recepies, createdTags)}>
                        Поиск</button>
                <button 
                    className="tagsForm__delAll-btn"
                    onClick={() => deleteAllTags()}>
                        Удалить теги</button>
            </div>
            
            <ul className="tagsForm__tagList">
                {renderedTags}
            </ul>
        </fieldset>
    )
    
}

export default TagsForm;
