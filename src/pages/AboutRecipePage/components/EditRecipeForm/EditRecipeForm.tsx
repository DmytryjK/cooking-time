import { FC, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Recipe, uploadFileType, IngredientsType } from '../../../../types/type';

import 'react-quill/dist/quill.snow.css';
import './EditRecipeForm.scss';

const EditRecipeForm: FC<{recipe: Recipe, setIsAttentionOpen: React.Dispatch<SetStateAction<boolean>>}> = ({recipe, setIsAttentionOpen}) => {

    const {title, ingredients, img, description} = recipe ;

    const [titleValue, setTitleValue] = useState<string>(title);
    const [uploadFile, setUploadFile] = useState<uploadFileType | any>({});
    const [statusUploadedPhoto, setStatusUploadedPhoto] = useState<'' | 'error' | 'success' | 'pending'>('');
    const [imageRefFromStorage, setImageRefFromStorage] = useState<string>('');
    const [tagsValue, setTagsValue] = useState<IngredientsType[] | undefined>(ingredients);
    const [descriptionValue, setDescriptionValue] = useState<string | undefined>(description);

    const [attentionWindowOpen, setAttentionWindowOpen] = useState<boolean>(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value);
    }

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();

        setTagsValue(prevTags => {
            if (prevTags) {
                const updatedTags = [...prevTags];
                // updatedTags[index] = e.target.value;
                return updatedTags;
            }
        })

    };

    const handleSubmitEditing = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // if (titleValue && tags.length > 0 && description) {
        //     dispatch(postRecepie({
        //             id: '',
        //             title: titleValue,
        //             time: timerValue ? timerValue : null,
        //             ingredients: tags.map(tag => tag.tagText),
        //             description: description,
        //             img: imageRefFromStorage,
        //             favorites: false
        //         }));
        //     if (!error) {
        //         setNameValue('');
        //         setTagName('');
        //         setTags([]);
        //         setUploadFile({});
        //         setImageRefFromStorage('');
        //         setStatusUploadedPhoto('');
        //         setDescription('');
        //     }
            
        // } else {
        //     alert('all fields must be fills');
        // }
        
    }

    // const attention = attentionWindowOpen && (
    //     <div className="success-window">
    //         <div className="success-window__block">
    //             <h2 className="success-window__title">Вы уверены, что хотите закрыть редактор? Все изменения не будут сохранены.</h2>
    //             <div className="success-window__links">
    //                 <button 
    //                     className="success-window__back-main" 
    //                     onClick={() => setEditorOpen(false)}>Да, закрыть</button>
    //                 <button 
    //                     className="success-window__back"
    //                     onClick={handleCloseAttantionWindow}>Отменить</button>
    //             </div>
    //             <button          
    //                 className="success-window__close"
    //                 onClick={handleCloseAttantionWindow}
    //             ></button>
    //         </div>
    //     </div>
    // )

    return (
        <>
            <button 
                className="edit-recipe__back-btn"
                title="отменить изменения"
                onClick={() => setIsAttentionOpen(true)}></button>
            <form className="edit-recipe__form" action="">
            <label className="form__name-label">
                <span>Заголовок</span>
                <input  className="form__name-recepie" 
                        type="text" 
                        required
                        onChange={handleTitleChange}
                        value={titleValue}/>
            </label>
            <label className="form__upload-label">
                <span>Фото</span>
                <input 
                    className="form__upload-photo" 
                    type="file"
                    />
                <span 
                    className="form__upload-label-name" 
                    style={img? {background: `url(${img}) center center/cover no-repeat`} : {backgroundColor: "red"}}>
                        {img ? null : 'Загрузить фото блюда'}
                </span>
            </label>
            <ul className="recepie-page__ingredients-list">
                {ingredients?.map((ingredient, index) => {
                    return(
                        <li 
                        key={index}
                        className="recepie-page__ingredients-item">
                            <input type="text"
                                // value={tagsValue && tagsValue[index]} 
                                onChange={(e) => handleTagChange(e, index)}/>
                        </li>
                    )
                })}
            </ul>
            <div>
                <span>Описание</span>
                <ReactQuill 
                    className="edit-recipe__description"
                    theme="snow" 
                    value={descriptionValue} 
                    onChange={setDescriptionValue} />
            </div>
            
            <button 
                className="edit-recipe__submit-btn"
                onSubmit={handleSubmitEditing}>Подтвердить изменения</button>
            </form>
        </>
        
    )
}

export default EditRecipeForm;