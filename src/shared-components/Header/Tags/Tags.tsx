import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { filterRecepiesByTag, deleteSearchTag, deleteAllTags, cloneRecepies } from '../../../store/reducers/FiltersSlice';

import { tagsType, Recepie } from '../../../types/type';
import './Tags.scss';

const Tags = ({recipes}:{recipes:Recepie[]}) => {
    const { filteredRecepies } = useAppSelector(state => state.filters); 
    const searchTags = useAppSelector(state => state.filters.searchTags);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(cloneRecepies(recipes));
    }, [recipes]); 

    useEffect(() => {
        const tags = searchTags.map(createdTag => createdTag.tagText);
        dispatch(filterRecepiesByTag({recipes: filteredRecepies, tags}));

        if (tags.length === 0) dispatch(filterRecepiesByTag({recipes: recipes, tags}));
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