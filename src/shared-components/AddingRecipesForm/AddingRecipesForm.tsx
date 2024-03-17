import {
    useState,
    useEffect,
    createContext,
    Dispatch,
    SetStateAction,
    useMemo,
} from 'react';
import {
    getDownloadURL,
    ref,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import ImageCompress from 'quill-image-compress';
import nextId from 'react-id-generator';
import Compressor from 'compressorjs';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { storage } from '../../firebase/firebase';
import Ingredients from '../../pages/AddRecipePage/components/Ingredients/Ingredients';
import UploadPhotos from '../../pages/AddRecipePage/components/UploadPhotos/UploadPhotos';
import CustomSelect from '../CustomSelect/CustomSelect';
import PopUp from '../../pages/AddRecipePage/components/PopUp/PopUp';
import { UploadFileType, IngredientsType, Loading } from '../../types/type';
import {
    postRecipe,
    updateRecipe,
    resetLoadingForm,
    fetchRecipes,
    resetRecipes,
} from '../../store/reducers/RecipesListSlice';
import {
    clearAllTags,
    getCategories,
} from '../../store/reducers/CreateRecipeFormSlice';
import './AddingRecipesForm.scss';
import 'react-quill/dist/quill.snow.css';
import { resetFavoriteRecipes } from '../../store/reducers/FavoritesRecipesSlice';

type Props = {
    id: string | number | null;
    isFavorite?: boolean;
    title?: string;
    categoryName?: string;
    timer?: { hours: string; minutes: string };
    descr?: string;
    loadedPhotos?: LoadedPhotoType[];
    ingredients?: IngredientsType[] | undefined;
    method: 'POST' | 'UPDATE';
    text?: string;
};

type LoadedPhotoType = {
    id: string;
    loadedSrc: string;
    localSrc: string;
    srcForRemove?: string;
    uploadFile?: UploadFileType | any;
};

type LoadedPhotoContextType = {
    loadedPhotosInfo: LoadedPhotoType[];
    setLoadedPhotosInfo: Dispatch<SetStateAction<LoadedPhotoType[]>>;
};

export const LoadedPhotoContext = createContext<LoadedPhotoContextType>({
    loadedPhotosInfo: [],
    setLoadedPhotosInfo: () => {},
});

ReactQuill.Quill.register('modules/imageCompress', ImageCompress);

const AddingRecipesForm = (props: Props) => {
    const {
        id,
        title,
        categoryName,
        timer,
        descr,
        loadedPhotos,
        ingredients,
        isFavorite,
        method,
        text,
    } = props;

    const { error, loadingForm } = useAppSelector((state) => state.recipes);
    const [nameValue, setNameValue] = useState(title || '');
    const [categoryValue, setCategoryValue] = useState(categoryName || '');
    const [timerValue, setTimerValue] = useState(
        timer || { hours: '', minutes: '' }
    );
    const [description, setDescription] = useState(descr || '');
    const [loadedPhotosInfo, setLoadedPhotosInfo] = useState<LoadedPhotoType[]>(
        loadedPhotos || []
    );
    const [uploadPhotoLoading, setUploadPhotoLoading] =
        useState<Loading>('idle');

    const tags = useAppSelector((state) => state.createRecipeForm.tags);
    const { categories } = useAppSelector((state) => state.createRecipeForm);
    const { uid } = useAppSelector((state) => state.authentication.user);

    const navigate = useNavigate();

    const [isSuccessPopUpShow, setIsSuccessPopUpShow] =
        useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            dispatch(resetLoadingForm());
            setIsSuccessPopUpShow(true);
            dispatch(resetRecipes());
            dispatch(resetFavoriteRecipes());
        }
    }, [loadingForm]);

    useEffect(() => {
        if (isSuccessPopUpShow && method === 'UPDATE') {
            setTimeout(() => {
                if (isSuccessPopUpShow) {
                    navigate(0);
                    setIsSuccessPopUpShow(false);
                }
            }, 1000);
        }
    }, [isSuccessPopUpShow]);

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            setNameValue('');
            setCategoryValue('');
            dispatch(clearAllTags());
            setLoadedPhotosInfo([]);
            setDescription('');
            setTimerValue({ hours: '', minutes: '' });
        }
    }, [loadingForm]);

    const uploadPhotos = async (loadedPhotosInfo: LoadedPhotoType[]) => {
        setUploadPhotoLoading('pending');
        const data: LoadedPhotoType[] = [];
        const uploadPhotoPromises = loadedPhotosInfo.map(async (item) => {
            const { id, loadedSrc, uploadFile, srcForRemove } = item;
            if (srcForRemove) {
                const imageRef = ref(storage, `${item.srcForRemove}`);
                const url = await getDownloadURL(imageRef);
                if (url) {
                    const imageRef = ref(storage, `${item.srcForRemove}`);
                    const removePhoto = await deleteObject(imageRef);
                }
            }
            if (uploadFile) {
                let compressedFile: any;
                const compressImage = async () => {
                    return new Promise((resolve, reject) => {
                        const compressor = new Compressor(uploadFile, {
                            quality: 0.9,
                            maxWidth: id === 'main' ? 800 : 450,
                            maxHeight: id === 'main' ? 600 : 370,
                            success(result) {
                                compressedFile = result;
                                resolve(result);
                            },
                            error(err) {
                                console.log(err.message);
                                reject(err.message);
                            },
                        });
                    });
                };
                const image = await compressImage();
                const imageRef = ref(
                    storage,
                    `recipes/${nextId(`photo-${id}`)}-${compressedFile.name}`
                );
                const snapshot = await uploadBytes(imageRef, compressedFile);
                const reflink = await getDownloadURL(snapshot.ref);
                data.push({
                    id,
                    loadedSrc: reflink,
                    localSrc: '',
                    srcForRemove: '',
                });
            } else {
                data.push({
                    id,
                    loadedSrc,
                    localSrc: '',
                    srcForRemove: '',
                });
            }

            return Promise.resolve();
        });

        return Promise.all(uploadPhotoPromises).then(() => {
            setUploadPhotoLoading('succeeded');
            return data;
        });
    };

    const handleSubmitForm = async (method: string) => {
        if (!nameValue) {
            alert('Введіть назву страви');
            return;
        }
        if (!categoryValue) {
            alert('Виберіть категорію страви');
            return;
        }
        if (tags.length === 0) {
            alert('Додайте інгредієнти');
            return;
        }
        if (!timerValue.hours && !timerValue.minutes) {
            alert('Вкажіть час приготування страви');
            return;
        }
        if (loadedPhotosInfo.length < 2) {
            alert('Завантажте 2 фото');
            return;
        }
        if (!description) {
            alert('Опишіть процес приготування страви');
            return;
        }

        try {
            const updatedPhotosInfo = await uploadPhotos(loadedPhotosInfo);
            if (!updatedPhotosInfo) return;
            if (method === 'POST') {
                dispatch(
                    postRecipe({
                        id: '',
                        authorId: uid || '',
                        title: nameValue,
                        time: {
                            hours: timerValue.hours
                                ? `${timerValue.hours}`
                                : '',
                            minutes: timerValue.minutes
                                ? `${timerValue.minutes}`
                                : '',
                        },
                        ingredients: tags,
                        description,
                        imgDto: [
                            {
                                id: updatedPhotosInfo[0].id,
                                src: updatedPhotosInfo[0].loadedSrc,
                            },
                            {
                                id: updatedPhotosInfo[1].id,
                                src: updatedPhotosInfo[1].loadedSrc,
                            },
                        ],
                        favorites: false,
                        category: categoryValue,
                    })
                );
            } else if (method === 'UPDATE') {
                dispatch(
                    updateRecipe({
                        id,
                        authorId: uid || '',
                        title: nameValue,
                        time: {
                            hours: timerValue.hours
                                ? `${timerValue.hours}`
                                : '',
                            minutes: timerValue.minutes
                                ? `${timerValue.minutes}`
                                : '',
                        },
                        ingredients: tags,
                        description,
                        imgDto: [
                            {
                                id: updatedPhotosInfo[0].id,
                                src: updatedPhotosInfo[0].loadedSrc,
                            },
                            {
                                id: updatedPhotosInfo[1].id,
                                src: updatedPhotosInfo[1].loadedSrc,
                            },
                        ],
                        favorites: isFavorite || false,
                        category: categoryValue,
                    })
                );
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
        }
    };

    const options = [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        ['link', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
    ];

    return (
        <>
            <form
                className="form add-recepie__form"
                onKeyDown={(e) => e.code === 'Enter' && e.preventDefault()}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitForm(method);
                }}
            >
                <div className="form__fields-wrapper">
                    <label className="form__name-label form__label">
                        <span>Назва страви</span>
                        <input
                            className="form__name-recepie form__input"
                            type="text"
                            name="Назва страви"
                            required
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                        />
                    </label>
                    <div className="form__field-category">
                        <label className="form__name-label form__label">
                            <span>Категорія</span>
                        </label>
                        <CustomSelect
                            value={categoryValue}
                            initialCheckedValue={categoryValue}
                            setValue={setCategoryValue}
                            fieldValues={categories}
                            selectTitle="Виберіть категорію"
                        />
                    </div>
                </div>
                <div className="form__fields-wrapper">
                    <Ingredients localingredients={ingredients} />
                    <fieldset className="form__timer-fiedls timer">
                        <legend className="form__label">
                            Час приготування
                        </legend>
                        <div className="timer__wrapper">
                            <label className="timer__label-hours">
                                <input
                                    className="timer__input-hours form__input"
                                    type="number"
                                    name="години"
                                    value={timerValue.hours}
                                    placeholder="00"
                                    onChange={(e) => {
                                        let { value } = e.target;
                                        if (+value < 0) {
                                            value = '0';
                                        }
                                        setTimerValue((prev) => {
                                            return {
                                                minutes: prev?.minutes || '',
                                                hours: value,
                                            };
                                        });
                                    }}
                                />
                                <span>годин</span>
                            </label>
                            <label className="timer__label-minutes">
                                <input
                                    className="timer__input-minutes form__input"
                                    type="number"
                                    name="хвилини"
                                    value={timerValue.minutes}
                                    placeholder="00"
                                    onChange={(e) => {
                                        let { value } = e.target;
                                        if (+value > 59) {
                                            value = '59';
                                        } else if (+value < 0) {
                                            value = '0';
                                        }
                                        setTimerValue((prev) => {
                                            return {
                                                hours: prev?.hours || '',
                                                minutes: value,
                                            };
                                        });
                                    }}
                                />
                                <span>хвилин</span>
                            </label>
                        </div>
                    </fieldset>
                </div>
                <div className="form__fields-wrapper">
                    <LoadedPhotoContext.Provider
                        value={useMemo(() => {
                            return {
                                loadedPhotosInfo,
                                setLoadedPhotosInfo,
                            };
                        }, [loadedPhotosInfo, setLoadedPhotosInfo])}
                    >
                        <UploadPhotos />
                    </LoadedPhotoContext.Provider>
                </div>
                <div className="form__fields-wrapper form-descr">
                    <span className="form-descr__title form__label">
                        Процес приготування
                    </span>
                    <ReactQuill
                        className="form-descr__editor"
                        placeholder="Опишіть процес приготування..."
                        theme="snow"
                        modules={{
                            toolbar: {
                                container: options,
                            },
                            imageCompress: {
                                quality: 0.6,
                                maxWidth: 400,
                                maxHeight: 300,
                                imageType: 'image/jpeg',
                                debug: true,
                                suppressErrorLogging: false,
                                insertIntoEditor: undefined,
                            },
                        }}
                        value={description}
                        onChange={setDescription}
                    />
                </div>
                <button
                    className={`form__submit addRecipe-btn ${
                        loadingForm === 'pending' ||
                        uploadPhotoLoading === 'pending'
                            ? 'loading'
                            : ''
                    }`}
                    type="submit"
                >
                    {method === 'POST' ? 'Додати рецепт' : 'Оновити рецепт'}
                    {loadingForm === 'pending' ||
                    uploadPhotoLoading === 'pending' ? (
                        <span className="addRecipe-btn__loading-dots">
                            <span className="addRecipe-btn__loading-dot" />
                            <span className="addRecipe-btn__loading-dot" />
                            <span className="addRecipe-btn__loading-dot" />
                        </span>
                    ) : (
                        ''
                    )}
                </button>
            </form>
            <PopUp
                isPopUpShow={isSuccessPopUpShow}
                setIsPopUpShow={setIsSuccessPopUpShow}
                text={text}
                method={method}
            />
        </>
    );
};

export default AddingRecipesForm;
