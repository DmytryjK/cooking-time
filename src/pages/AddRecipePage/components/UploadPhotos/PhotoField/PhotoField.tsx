import {useState, useEffect, useContext} from 'react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../../firebase/firebase';
import { LoadedPhotoContext } from '../../AddingRecipesForm/AddingRecipesForm';
import { uploadFileType } from '../../../../../types/type';

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
                setUploadFile(files[0]);
            } else {
                alert('виберіть інший тип файлу для зображення');
            }
        }
    }

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
                name={name}
                onChange={handleUploadPhoto}
                disabled = {loadingStatus === 'success' ? true : false}
                />
            <span className="upload-photo__info">{uploadInfo ? uploadInfo : 'Завантажити фото'}</span>
        </label>
        {maxSize ? <span className="upload-photo__max-size">*Розмір до {maxSize}</span> : ''}
    </div>
  )
}

export default PhotoField