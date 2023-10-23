import PhotoField from './PhotoField/PhotoField';
import nextId from 'react-id-generator';

const UploadPhotos = () => {
    return (
        <fieldset className="form__upload-photo upload-photo">
            <PhotoField id={nextId('photo-id')} name="Фотографія мініатюри" maxSize="200"/>
            <PhotoField id={nextId('photo-id')} name="Основне фото" />
        </fieldset>
    );
}

export default UploadPhotos;
