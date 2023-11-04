import nextId from 'react-id-generator';
import PhotoField from './PhotoField/PhotoField';

type PhotoFieldType = {
    name: string;
    maxSize?: string;
    id: string;
};

const UploadPhotos = () => {
    const photoFields: PhotoFieldType[] = [
        {
            name: 'Фотографія мініатюри',
            maxSize: '350',
            id: 'previewImg',
        },
        {
            name: 'Основна фотографія',
            id: 'main',
        },
    ];
    return (
        <fieldset className="form__upload-photo upload-photo">
            {photoFields.map((photo) => {
                const { name, maxSize, id } = photo;
                return (
                    <PhotoField
                        key={`${id}`}
                        id={`${id}`}
                        name={name}
                        maxSize={maxSize}
                    />
                );
            })}
        </fieldset>
    );
};

export default UploadPhotos;
