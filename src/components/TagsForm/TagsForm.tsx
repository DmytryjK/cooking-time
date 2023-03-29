import { useState, useEffect } from 'react';
import './TagsForm.scss';

const TagsForm = () => {
    const [inputByTag, setInputByTag] = useState<string>('');
    const [createdTags, setCreatedTags] = useState<string[] | []>([]);

    const handleChangeTag = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputByTag(value);

        if (value.indexOf(',') > 0) {
            setCreatedTags((): string[] => [...createdTags, value]);
            setInputByTag(() => '');
        }
    }

    const createNewTag = (tags :string[]) => {
        const renderResult = tags.map((tag, i) => {
            return <li className="tagsForm__createdTag" key={i}>
                {tag}
                <button className="tagsForm__closeTag"></button>
            </li>
        })
        return renderResult;
    }

    const renderedTags = createdTags.length > 0 ? createNewTag(createdTags) : null

    return (
        <fieldset className="tagsForm">          
            <legend className="tagsForm__header">Введите названия ингредиентов через запятую:</legend>
            <input 
            className="tagsForm__tagName"
            type="text" 
            value={inputByTag} 
            onChange={(e) => {handleChangeTag(e)}}/>
            <ul className="tagsForm__tagList">
                {renderedTags}
            </ul>
        </fieldset>
    )
    
}

export default TagsForm;