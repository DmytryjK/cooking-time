import { useState } from 'react';
import nextId from "react-id-generator";

import { createdTags } from '../../types/types';

import './TagsForm.scss';

const TagsForm = () => {
    const [inputByTag, setInputByTag] = useState<string>('');
    const [createdTags, setCreatedTags] = useState<createdTags[]>([]);

    const handleChangeTag = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputByTag(value);

        if (value.indexOf(',') > 0) {

            setCreatedTags(() => [
                ...createdTags,
                {
                    id: nextId("createdTag"), 
                    text: value.slice(0, value.length - 1)
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
                    text: inputByTag
                }
            ]);
            setInputByTag(() => '');

        }
        
    }

    const closeBtnClicked = (id: string | number) => {
        setCreatedTags(createdTags.filter(tag => tag.id !== id))
    }

    const createNewTag = (tags :createdTags[]) => {
        const renderResult = tags.map(tag => {
            const {id, text} = tag;

            return (
                <li className="tagsForm__createdTag" key={id}>
                    {text}
                    <button 
                        className="tagsForm__closeTag"
                        onClick={() => closeBtnClicked(id)}>
                    </button>
                </li>
            )
        })
        return renderResult;
    }

    const renderedTags = createdTags.length > 0 ? createNewTag(createdTags) : null

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
                    onClick={() => console.log('click')}>
                        Поиск</button>
                <button 
                    className="tagsForm__delAll-btn"
                    onClick={() => setCreatedTags([])}>
                        Удалить теги</button>
            </div>
            
            <ul className="tagsForm__tagList">
                {renderedTags}
            </ul>
        </fieldset>
    )
    
}

export default TagsForm;
