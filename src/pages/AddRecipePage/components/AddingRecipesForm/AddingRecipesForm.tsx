import { useState, useEffect, useContext, createContext, Dispatch, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { postRecipe } from '../../../../store/reducers/RecipesListSlice';
import ReactQuill from 'react-quill';
import { clearAllTags } from '../../../../store/reducers/CreateRecipeFormSlice';
import Ingredients from '../Ingredients/Ingredients';
import UploadPhotos from '../UploadPhotos/UploadPhotos';
import PopUp from '../PopUp/PopUp';
import './AddingRecipesForm.scss';
import 'react-quill/dist/quill.snow.css';

type LoadedPhotoType = {
    id: string,
    imageRefFromStorage: string,
}

type LoadedPhotoContextType = {
    loadedPhotosInfo: LoadedPhotoType[];
    setLoadedPhotosInfo: Dispatch<SetStateAction<LoadedPhotoType[]>> | null;
}

export const LoadedPhotoContext = createContext<LoadedPhotoContextType>({
    loadedPhotosInfo: [],
    setLoadedPhotosInfo: null,
});

const AddingRecipesForm = () => {
    const {error, loadingForm} = useAppSelector(state => state.recipes);
    const [nameValue, setNameValue] = useState<string>('');
    const [categoryValue, setCategoryValue] = useState<string>('');
    const tags = useAppSelector(state => state.createRecipeForm.tags);
    const [timerValue, setTimerValue] = useState<{hours: string, minutes: string}>({hours: '', minutes: ''});
    const [loadedPhotosInfo, setLoadedPhotosInfo] = useState<LoadedPhotoType[]>([]);
    const [description, setDescription] = useState<string>('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            const popUp = document.querySelector('.success-window');
            popUp?.classList.add('active');
        }
    }, [loadingForm]);

    const handleSubmitForm = () => {
        if (nameValue && tags.length > 0 && description) {
            dispatch(postRecipe({
                    id: '',
                    title: nameValue,
                    time: {
                        hours: timerValue.hours ? timerValue.hours + ' год.' : '',
                        minutes: timerValue.minutes ? timerValue.minutes + ' хв.' : '',
                    },
                    ingredients: tags,
                    description: description,
                    previewImg: loadedPhotosInfo[0].imageRefFromStorage,
                    img: loadedPhotosInfo[1].imageRefFromStorage,
                    favorites: false,
                    category: categoryValue,
                }));
            if (!error) {
                setNameValue('');
                setCategoryValue('');
                dispatch(clearAllTags());
                setLoadedPhotosInfo([]);
                setDescription('');
                setTimerValue({hours: '', minutes: ''});
            };
            
        } else {
            alert('all fields must be fills');
        }
    }

    return(
        <>
            <form className="form add-recepie__form" 
                onKeyDown={(e) => e.code === 'Enter' && e.preventDefault()}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitForm();
                }}>
                <div className="form__fields-wrapper">
                    <label className="form__name-label form__label">
                        <span>Назва страви</span>
                        <input  className="form__name-recepie form__input" 
                                type="text" 
                                name="Назва страви"
                                required
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}/>
                    </label>
                    <label className="form__name-label form__label">
                        <span>Категорія</span>
                        <input  className="form__name-recepie form__input" 
                                type="text" 
                                name="Категорія"
                                required
                                value={categoryValue}
                                onChange={(e) => setCategoryValue(e.target.value)}/>
                    </label>
                </div>
                <div className="form__fields-wrapper">
                    <Ingredients />
                    <fieldset className="form__timer-fiedls timer">
                        <legend className="form__label">Час приготування</legend>
                        <div className="timer__wrapper">
                            <label className="timer__label-hours">
                                <input className="timer__input-hours form__input" 
                                    type="number"
                                    name="години"
                                    value={timerValue.hours}
                                    placeholder="00"
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (+value < 0) {
                                            value = '0';
                                        }
                                        setTimerValue((prev) => {
                                            return {
                                                minutes: prev?.minutes || '',
                                                hours: value,
                                            }
                                        })
                                    }}/>
                                <span>годин</span>
                            </label>
                            <label className="timer__label-minutes">
                                <input className="timer__input-minutes form__input" 
                                    type="number"
                                    name="хвилини"
                                    value={timerValue.minutes}
                                    placeholder="00"
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (+value > 59) {
                                            value = '59';
                                        } else if (+value < 0) {
                                            value = '0';
                                        }
                                        setTimerValue((prev) => {
                                            return {
                                                hours: prev?.hours || '',
                                                minutes: value,
                                            }
                                        })
                                    }}/>
                                <span>хвилин</span>
                            </label>
                        </div>
                    </fieldset>
                </div>
                <div className="form__fields-wrapper">
                    <LoadedPhotoContext.Provider value={{loadedPhotosInfo, setLoadedPhotosInfo}}>
                        <UploadPhotos />
                    </LoadedPhotoContext.Provider>
                </div>
                <div className="form__fields-wrapper form-descr">
                    <span className="form-descr__title form__label">Процес приготування</span>
                    <ReactQuill 
                        className="form-descr__editor"
                        placeholder= "Опишіть процес приготування..."
                        theme="snow"
                        value={description} 
                        onChange={setDescription} />
                </div>
                <button className="form__submit addRecipe-btn" type="submit">Додати рецепт</button>
            </form>
            {PopUp()}
        </>
        
    )
}

export default AddingRecipesForm;
