import {useState, useEffect, useContext} from 'react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../../firebase/firebase';
import { deleteObject } from 'firebase/storage';
import { LoadedPhotoContext } from '../../AddingRecipesForm/AddingRecipesForm';
import { uploadFileType } from '../../../../../types/type';
import './PhotoField.scss';

const PhotoField = (
    {   
        id, 
        name, 
        maxSize,
    } 
        : 
    {
        id: string; 
        name: string; 
        maxSize?: string; 
    }) => {

    const {loadedPhotosInfo, setLoadedPhotosInfo} = useContext(LoadedPhotoContext);
    const [loadingStatus, setLoadingStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
    const [loadedPhotoSrc, setLoadedPhotoSrc] = useState<string>('');
    const [uploadInputValue, setUploadInputValue] = useState<string>('');
    const [uploadFile, setUploadFile] = useState<uploadFileType | any>({});

    useEffect(() => {
        if (!uploadFile.name) return;
        const imageRef = ref(storage, `${uploadFile.name}${id}`);
        uploadBytes(imageRef, uploadFile)
            .then((snapshot) => {
                setLoadingStatus('success');
                getDownloadURL(snapshot.ref)
                    .then(ref => {
                        if (!setLoadedPhotosInfo) return;
                        setLoadedPhotosInfo((prev) => {
                            return [...prev, {
                                    id: id,
                                    imageRefFromStorage: ref,
                                }]
                        })
                        setLoadedPhotoSrc(ref);
                    })
        });
    }, [uploadFile]);

    useEffect(() => {
        if (loadedPhotosInfo.length === 0) {
            setLoadingStatus('idle');
            setUploadFile({});
        }
    }, [loadedPhotosInfo]);

    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        if (files && files.length > 0) {
            if (files[0].type.indexOf("image") >= 0) {
                const currentSizeOfImg = files[0].size / 1000;
                if (maxSize && currentSizeOfImg > +maxSize) {
                    alert(`Виберіть файл до ${maxSize} кБ`);
                } else {
                    setUploadFile(files[0]);
                }
            } else {
                alert('виберіть інший тип файлу для зображення');
            }
        }
    }

    const handleRemovePhoto = () => {
        const imageRef = ref(storage, loadedPhotoSrc);
        deleteObject(imageRef)
            .then(() => {
                setLoadedPhotoSrc('');
                setUploadInputValue('');
                setLoadingStatus('idle');
                setUploadFile({});
                if (setLoadedPhotosInfo) {
                    setLoadedPhotosInfo((prev) => {
                        return prev.filter(item => item.imageRefFromStorage !== loadedPhotoSrc)
                    })
                }
            }).catch((error) => {
                alert('something went wrong');
            });
    };

    let uploadInfo;
    if (loadingStatus === 'pending') {
        uploadInfo = 'loading...'
    }
    else if (loadingStatus === 'success' && uploadFile) {
        uploadInfo = uploadFile.name;
    } else if (loadingStatus === 'failed') {
        uploadInfo = 'Sorry, try to load another type of image file' 
    }

  return (
    <div className="upload-photo__wrapper">
        <h3 className="upload-photo__title form__label">{name}</h3>
        <label className="upload-photo__label">
            <input 
                className="upload-photo__input" 
                type="file"
                onChange={handleUploadPhoto}
                value={uploadInputValue}
                disabled = {loadingStatus === 'success' ? true : false}
                />
            <div className="upload-photo__info">
                {uploadInfo ? 
                    loadedPhotoSrc ? <img className="upload-photo__preview" src={loadedPhotoSrc} alt="" /> : '' 
                : 'Завантажити фото'}
            </div>
            <button 
                className={`upload-photo__reset-photo ${loadedPhotoSrc ? 'active' : ''} `} 
                type="button" 
                aria-label="видалити фото" 
                onClick={handleRemovePhoto}/>
        </label>
        {maxSize ? <span className="upload-photo__max-size">*Розмір до {maxSize} кБ</span> : ''}
    </div>
  )
}

export default PhotoField