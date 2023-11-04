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
    const [loadedPhotoSrc, setLoadedPhotoSrc] = useState<string>('');
    const [uploadInputValue, setUploadInputValue] = useState<string>('');

    useEffect(() => {
        if (loadedPhotosInfo.length === 0) {
            setUploadInputValue('');
            setLoadedPhotoSrc('');
        }
    }, [loadedPhotosInfo]);

    useEffect(() => {
        if (!loadedPhotosInfo || loadedPhotosInfo.length === 0) return;
        const foundIndexOfPhoto = loadedPhotosInfo.findIndex(photo => photo.id === id);
        if (foundIndexOfPhoto === -1) return;
        setLoadedPhotoSrc(loadedPhotosInfo[foundIndexOfPhoto].localSrc);
    }, [loadedPhotosInfo]);

    const readFile = (file: uploadFileType) => {
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
                setLoadedPhotosInfo((prev) => {
                    return [
                        ...prev.filter(prevItem => prevItem.id !== id), 
                        {
                            id,
                            localSrc: fr.result?.toString() || '',
                            loadedSrc: '',
                            uploadFile: file,
                        }]
                })
            
            };
            fr.onerror = reject;
            fr.readAsDataURL(file as any);
        });
    }

    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        if (files && files.length > 0) {
            if (files[0].type.indexOf("image") >= 0) {
                const currentSizeOfImg = files[0].size / 1000;
                if (maxSize && currentSizeOfImg > +maxSize) {
                    alert(`Виберіть файл до ${maxSize} кБ`);
                } else {
                    readFile(files[0]);
                }
            } else {
                alert('виберіть інший тип файлу для зображення');
            }
        }
    }

    const handleRemovePhoto = () => {
        setLoadedPhotosInfo((prev) => {
            return [
                ...prev.filter(item => item.id !== id),
            ]
        });
        setLoadedPhotoSrc('');
    };

  return (
    <div className="upload-photo__wrapper">
        <h3 className="upload-photo__title form__label">{name}</h3>
        <label className="upload-photo__label">
            <input 
                className="upload-photo__input" 
                type="file"
                onChange={handleUploadPhoto}
                value={uploadInputValue}
                disabled = {loadedPhotoSrc ? true : false}
                />
            <div className="upload-photo__info">
                {loadedPhotoSrc ? <img className="upload-photo__preview" src={loadedPhotoSrc} alt="" /> : 'Завантажити фото' }
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