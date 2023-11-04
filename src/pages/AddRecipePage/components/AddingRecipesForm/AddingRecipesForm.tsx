import { useState, useEffect, createContext, Dispatch, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../firebase/firebase';
import ReactQuill from 'react-quill';
import Ingredients from '../Ingredients/Ingredients';
import UploadPhotos from '../UploadPhotos/UploadPhotos';
import CustomSelect from '../../../../shared-components/CustomSelect/CustomSelect';
import PopUp from '../PopUp/PopUp';
import { uploadFileType } from '../../../../types/type';
import nextId from 'react-id-generator';
import { postRecipe, resetLoadingForm } from '../../../../store/reducers/RecipesListSlice';
import { clearAllTags, getCategories } from '../../../../store/reducers/CreateRecipeFormSlice';
import './AddingRecipesForm.scss';
import 'react-quill/dist/quill.snow.css';

type LoadedPhotoType = {
    id: string;
    loadedSrc: string;
    localSrc: string;
    uploadFile?: uploadFileType | any;
}

type LoadedPhotoContextType = {
    loadedPhotosInfo: LoadedPhotoType[];
    setLoadedPhotosInfo: Dispatch<SetStateAction<LoadedPhotoType[]>>;
}

export const LoadedPhotoContext = createContext<LoadedPhotoContextType>({
    loadedPhotosInfo: [],
    setLoadedPhotosInfo: () => {},
});

const AddingRecipesForm = () => {
    const { error, loadingForm } = useAppSelector(state => state.recipes);
    const [nameValue, setNameValue] = useState('');
    const [categoryValue, setCategoryValue] = useState('');
    const [timerValue, setTimerValue] = useState({hours: '', minutes: ''});
    const [description, setDescription] = useState('');
    const [loadedPhotosInfo, setLoadedPhotosInfo] = useState<LoadedPhotoType[]>([]);
    
    const tags = useAppSelector(state => state.createRecipeForm.tags);
    const { categories } = useAppSelector(state => state.createRecipeForm);

    const [isSuccessPopUpShow, setIsSuccessPopUpShow] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            setIsSuccessPopUpShow(true);
            dispatch(resetLoadingForm());
        }
    }, [loadingForm]);

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            setNameValue('');
            setCategoryValue('');
            dispatch(clearAllTags());
            setLoadedPhotosInfo([]);
            setDescription('');
            setTimerValue({hours: '', minutes: ''});
        }
    }, [loadingForm])

    const uploadPhotos = async(loadedPhotosInfo: LoadedPhotoType[]) => {
        const data: LoadedPhotoType[] = [];
        const uploadPhotoPromises = loadedPhotosInfo.map(async (item) => {
            const { uploadFile, id } = item;
            if (!uploadFile || item.loadedSrc) return;

            const imageRef = ref(storage, `recipes/${nextId(`photo-${id}`)}-${uploadFile.name}`);
            const snapshot = await uploadBytes(imageRef, uploadFile);
            const reflink = await getDownloadURL(snapshot.ref);

            data.push ({
                id: item.id,
                loadedSrc: reflink,
                localSrc: '',
            });
        })
        
        return Promise.all(uploadPhotoPromises)
            .then(() => {
            return data;
        });
    }

    const handleSubmitForm = async () => {
        if (loadedPhotosInfo.length < 2) {
            alert('Завантажте 2 фото');
            return;
        };
        if (!nameValue || tags.length === 0 || !description) {
            alert('Всі поля мають бути заповнені');
            return;
        }
    
        try {
            const updatedPhotosInfo = await uploadPhotos(loadedPhotosInfo);
            if (!updatedPhotosInfo) return;

            dispatch(postRecipe({
                id: '',
                title: nameValue,
                time: {
                    hours: timerValue.hours ? timerValue.hours + ' год.' : '',
                    minutes: timerValue.minutes ? timerValue.minutes + ' хв.' : '',
                },
                ingredients: tags,
                description: description,
                previewImg: updatedPhotosInfo[0].loadedSrc,
                img: updatedPhotosInfo[1].loadedSrc,
                favorites: false,
                category: categoryValue,
            }));

        } catch(error) {
            console.error('Error uploading photos:', error);
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
                    <div className="form__field-category">
                        <label className="form__name-label form__label">
                            <span>Категорія</span>
                        </label>
                        <CustomSelect 
                            setValue={setCategoryValue} 
                            fieldValues={categories}
                            selectTitle="Виберіть категорію"
                        />
                    </div>
                    
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
            <PopUp 
                isPopUpShow={isSuccessPopUpShow} 
                setIsPopUpShow={setIsSuccessPopUpShow} />
        </>
        
    )
}

export default AddingRecipesForm;
