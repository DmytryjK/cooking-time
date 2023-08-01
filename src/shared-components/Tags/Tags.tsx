import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { deleteSearchTag, deleteAllTags } from '../../store/reducers/FiltersSlice';
import { tagsType } from '../../types/type';
import './Tags.scss';

const Tags = () => {
    const { searchTags } = useAppSelector(state => state.filters);
    const dispatch = useAppDispatch();


    const createNewTag = (tags: tagsType[]) => {
        const renderResult = tags.map(tag => {
            const {id, tagText} = tag;

            return (
                <li className="tagsForm__item" key={id}>
                    {tagText}
                    <button 
                        className="tagsForm__item-close"
                        onClick={() => dispatch(deleteSearchTag(id))}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Icons/close" clipPath="url(#clip0_909_820)">
                            <path id="Vector (Stroke)" fillRule="evenodd" clipRule="evenodd" d="M0.79214 0.79214C1.01499 0.569287 1.37631 0.569287 1.59916 0.79214L9.20786 8.40084C9.43071 8.62369 9.43071 8.98501 9.20786 9.20786C8.98501 9.43071 8.62369 9.43071 8.40084 9.20786L0.79214 1.59916C0.569287 1.37631 0.569287 1.01499 0.79214 0.79214Z" fill="#D24A34"/>
                            <path id="Vector (Stroke)_2" fillRule="evenodd" clipRule="evenodd" d="M9.20786 0.79214C9.43071 1.01499 9.43071 1.37631 9.20786 1.59916L1.59916 9.20786C1.37631 9.43071 1.01499 9.43071 0.79214 9.20786C0.569287 8.98501 0.569287 8.62369 0.79214 8.40084L8.40084 0.79214C8.62369 0.569287 8.98501 0.569287 9.20786 0.79214Z" fill="#D24A34"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_909_820">
                            <rect width="10" height="10" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
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
            <ul className="tagsForm__list">
                {renderedTags}
            </ul>
            <button 
                className="tagsForm__clear-btn"
                onClick={() => dispatch(deleteAllTags())}>
                Удалить теги
            </button>
        </fieldset> : null
    )
}

export default Tags;