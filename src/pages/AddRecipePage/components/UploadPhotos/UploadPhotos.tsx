import PhotoField from './PhotoField/PhotoField';
import nextId from 'react-id-generator';

type PhotoField = {
    name: string;
    maxSize?: string; 
    dataType: string;
};

const UploadPhotos = () => {
    const photoFields: PhotoField[] = [
        {
            name: "Фотографія мініатюри",
            maxSize: '200',
            dataType: 'previewImg',
        },
        {
            name: "Основна фотографія",
            dataType: 'previewImg',
        },
    ];
    return (
        <fieldset className="form__upload-photo upload-photo">
            {/* {photoFields.map((photoField) => {
                const {name, maxSize, dataType} = photoField;

                return <PhotoField 
                    id={nextId('photo-id')} 
                    name={name}
                    maxSize={maxSize}
                    dataType={dataType}
                />
            })} */}
        </fieldset>
    );
}

export default UploadPhotos;
