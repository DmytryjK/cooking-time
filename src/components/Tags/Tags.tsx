import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { filterRecepiesByTag, deleteSearchTag, deleteAllTags } from '../Filters/FiltersSlice';

import { tagsType } from '../../types/type';
import './Tags.scss';

const Tags = () => {
    const recepies = useAppSelector(state => state.recepies);
    const searchTags = useAppSelector(state => state.filters.searchTags);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log(searchTags);
        const tags = searchTags.map(createdTag => createdTag.tagText);
        dispatch(filterRecepiesByTag({...recepies, tags}));
    }, [searchTags]);

    const createNewTag = (tags: tagsType[]) => {
        const renderResult = tags.map(tag => {
            const {id, tagText} = tag;

            return (
                <li className="tagsForm__createdTag" key={id}>
                    {tagText}
                    <button 
                        className="tagsForm__closeTag"
                        onClick={() => dispatch(deleteSearchTag(id))}>
                    </button>
                </li>
            )
        })
        return renderResult;
    }

    const renderedTags = searchTags.length > 0 ? createNewTag(searchTags) : null;

    return (
        renderedTags ?
        <fieldset className="tagsForm">          
            <button 
                className="tagsForm__delAll-btn"
                onClick={() => dispatch(deleteAllTags())}>
                Удалить теги
            </button>
            <ul className="tagsForm__tagList">
                {renderedTags}
            </ul>
        </fieldset> : null
    )
}

export default Tags;