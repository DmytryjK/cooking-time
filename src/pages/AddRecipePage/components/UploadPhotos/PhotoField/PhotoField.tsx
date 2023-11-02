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
        dataType,
    } 
        : 
    {
        id: string; 
        name: string; 
        maxSize?: string; 
        dataType: string;
    }) => {

    const {loadedPhotosInfo, setLoadedPhotosInfo} = useContext(LoadedPhotoContext);
    // const [loadingStatus, setLoadingStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
    // const [loadedPhotoSrc, setLoadedPhotoSrc] = useState<string>('');
    // const [uploadInputValue, setUploadInputValue] = useState<string>('');
    // const [uploadFile, setUploadFile] = useState<uploadFileType | any>({});

    const [loadingStatus, setLoadingStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
    const [loadedPhotoSrc, setLoadedPhotoSrc] = useState<string | any>('');
    const [uploadInputValue, setUploadInputValue] = useState<string>('');
    // const [uploadFile, setUploadFile] = useState<uploadFileType | any>({});

    // useEffect(() => {
        // if (!uploadFile.name) return;
        // if (loadedPhotosInfo.length < 1) return;
        // const imageRef = ref(storage, `${uploadFile.name}${id}`);
        // uploadBytes(imageRef, uploadFile)
        //     .then((snapshot) => {
        //         setLoadingStatus('success');
        //         getDownloadURL(snapshot.ref)
        //             .then(ref => {
        //                 if (!setLoadedPhotosInfo) return;
        //                 setLoadedPhotosInfo((prev) => {
        //                     return [...prev, {
        //                             id: id,
        //                             imageRefFromStorage: ref,
        //                         }]
        //                 })
        //                 setLoadedPhotoSrc(ref);
        //             })
        // });
    // }, [uploadFile]);

    useEffect(() => {
        if (loadedPhotoSrc) {
            setLoadingStatus('idle');
            setLoadedPhotosInfo(prev => (
                {
                    ...prev,
                    uploadFile: {},
                }
            ));
            // setUploadFile({});
        }
    }, [loadedPhotosInfo]);

    useEffect(() => {
        console.log(loadedPhotoSrc);
    }, [loadedPhotoSrc]);

    // useEffect(() => {
    //     console.log(loadedPhotosInfo);
    //     if (loadedPhotosInfo.length !== 0 && loadedPhotosInfo.every(item => item.imageRefFromStorage !== '')) {
    //         setLoadingStatus('success');
    //         setUploadFile({
    //             name: 'loadedPhoto'
    //         });
            
    //         if (dataType === 'preview') {
    //             setLoadedPhotoSrc(loadedPhotosInfo[0].imageRefFromStorage)
    //         } else {
    //             setLoadedPhotoSrc(loadedPhotosInfo[1].imageRefFromStorage)
    //         }
    //     }
    // }, []);

    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        if (files && files.length > 0) {
            if (files[0].type.indexOf("image") >= 0) {
                const currentSizeOfImg = files[0].size / 1000;
                if (maxSize && currentSizeOfImg > +maxSize) {
                    alert(`Виберіть файл до ${maxSize} кБ`);
                } else {
                    const reader = new FileReader();
                    reader.readAsDataURL(files[0]);

                    reader.onloadend = function () {
                        setLoadedPhotoSrc(reader.result?.toString() || '');
                        setLoadedPhotosInfo(prev => (
                            {
                                ...prev,
                                uploadFile: files[0],
                            }
                        ));
                        setLoadingStatus('success');
                        if (!setLoadedPhotosInfo) return;
                        setLoadedPhotosInfo((prev) => {
                            return [...prev, {
                                    id,
                                    imageRefFromStorage: reader.result?.toString() || '',
                                }]
                        })
                    };
                    // setUploadFile(files[0]);
                }
            } else {
                alert('виберіть інший тип файлу для зображення');
            }
        }
    }

    const handleRemovePhoto = () => {
        // const imageRef = ref(storage, loadedPhotoSrc);
        // deleteObject(imageRef)
        //     .then(() => {
        //         setLoadedPhotoSrc('');
        //         setUploadInputValue('');
        //         setLoadingStatus('idle');
        //         setUploadFile({});
        //         if (setLoadedPhotosInfo) {
        //             setLoadedPhotosInfo((prev) => {
        //                 return prev.filter(item => item.imageRefFromStorage !== loadedPhotoSrc)
        //             })
        //         }
        //     }).catch((error) => {
        //         alert('something went wrong');
        //     });
        setLoadedPhotoSrc('');
        setUploadInputValue('');
        setLoadingStatus('idle');
    };

    let uploadInfo;
    if (loadingStatus === 'pending') {
        uploadInfo = 'loading...'
    }
    else if (loadingStatus === 'success' && loadedPhotoSrc) {
        uploadInfo = loadedPhotosInfo[0].uploadFile;
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