import { useState, useEffect } from 'react';
import nextId from 'react-id-generator';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { postRecepie } from '../RecipeList/RecepieListSlice';
import { tagsType } from '../Filters/FiltersSlice';

import './AddingRecepiesForm.scss';

const AddingRecepiesForm = () => {

    interface uploadFileType {
        lastModified?: number;
        lastModifiedDate?: Date;
        name?: string;
        size?: number;
        type?: string;
        webkitRelativePath?: string;
    }

    const [nameValue, setNameValue] = useState<string>('');
    const [tagName, setTagName] = useState<string>('');
    const [tags, setTags] = useState<tagsType[]>([]);
    const [description, setDescription] = useState<string>('');
    const [uploadFile, setUploadFile] = useState<uploadFileType>({});
    const [statusUploadedPhoto, setStatusUploadedPhoto] = useState<'' | 'error' | 'success'>('');

    const dispatch = useAppDispatch();

    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        setStatusUploadedPhoto('');

        if (files && files.length > 0) {
            if (files[0].type.indexOf("image") >= 0) {
                setUploadFile(files[0]);
                setStatusUploadedPhoto('success');
            } else {
                setStatusUploadedPhoto('error');
                alert('виберіть інший тип файлу для зображення')
            }
        }
        
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameValue(e.target.value);
    }

    const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagName(event.target.value);
    }

    const handlePlusBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        changeTagsStatesOnEvent();
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            changeTagsStatesOnEvent();
        }
    }

    const delBtnClicked = (id: string | number) => {
        setTags(tags.filter(tag => tag.id !== id));
    }

    const handleDescrChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }   

    const changeTagsStatesOnEvent = () => {
        if (tagName.length > 0) {
            setTagName("");
            setTags(
                [...tags, 
                    {
                        id: nextId("ingredient-"), 
                        tagText: tagName
                    }
                ]
            )
        }
    }

    const handleSubmitForm = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        dispatch(postRecepie(
            {
                id: nextId(),
                title: nameValue,
                time: 0,
                ingredients: tags.map(tag => tag.tagText),
                description: description,
                img: ""
            }
        ));
        setNameValue('');
        setTagName('');
        setTags([]);
        setDescription('');
    }

    const tagsRender = (tags: tagsType[]) => {
        if (tags.length > 0) {
            const result = tags.map(tag => {
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
            return result;
        }
    }

    const renderedTags = tagsRender(tags);
    
    let uploadInfo;
    if (statusUploadedPhoto === 'success' && uploadFile) {
        uploadInfo = uploadFile.name;
    } else if (statusUploadedPhoto === 'error') {
        uploadInfo = 'Sorry, try to load another type of image file' 
    }

    return(
        <form className="form add-recepie__form">
            <label className="form__name-label">
                <span>Название блюда</span>
                <input  className="form__name-recepie" 
                        type="text" 
                        required
                        value={nameValue}
                        onChange={handleNameChange}/>
            </label>
            <fieldset className="tagsForm">          
                <legend className="tagsForm__header">Ингредиенты</legend>
                <div className="tagsForm__top-wrapper">
                    <input 
                    className="tagsForm__tagName"
                    type="text"
                    value={tagName}
                    onChange={handleTagChange}
                    onKeyDown={handleKeyDown}/>
                    <button 
                        className="tagsForm__search-btn"
                        onClick={handlePlusBtn}
                        >+</button>
                </div>
                <ul className="tagsForm__tagList">
                    {renderedTags}
                </ul>
            </fieldset>
            <label className="form__upload-label">
                <input 
                    className="form__upload-photo" 
                    type="file"
                    onChange={handleUploadPhoto}
                    disabled = {statusUploadedPhoto === 'success' ? true : false}/>
                <span className="form__upload-label-name">{uploadInfo ? uploadInfo : 'Загрузить фото блюда'}</span>
            </label>
            <label className="form__descr-label">
                <span>Описание</span>
                <textarea 
                    className="form__descr" 
                    name="description-dishes" 
                    rows={20} 
                    required
                    value={description}
                    onChange={handleDescrChange}></textarea>
            </label>
            <input 
                className="form__submit addRecipe-btn" 
                type="submit"
                onClick={handleSubmitForm}/>
        </form>
    )
}

export default AddingRecepiesForm;