import { FC, SetStateAction } from 'react';
import { Recipe, uploadFileType, IngredientsType } from '../../../../types/type';
import AddingRecipesForm from '../../../AddRecipePage/components/AddingRecipesForm/AddingRecipesForm';
import 'react-quill/dist/quill.snow.css';
import './EditRecipeForm.scss';

const EditRecipeForm: FC<{recipe: Recipe, setIsAttentionOpen: React.Dispatch<SetStateAction<boolean>>}> = ({recipe, setIsAttentionOpen}) => {
    const {title, ingredients, img, description, category, time, previewImg} = recipe;
    return (
        <>
            <button 
                className="edit-recipe__back-btn"
                title="Повернутись назад"
                onClick={() => setIsAttentionOpen(true)} 
                aria-label="відмінити зміни"/>
            {/* <AddingRecipesForm 
                name={title} 
                category={category} 
                timer={{hours: time.hours.replace(' год.', ''), minutes: time.minutes.replace(' хв.', '')}} 
                descr={description} 
                ingredients={ingredients}
                loadedPhotos={[
                    {
                        id: 'photo-id-1',
                        imageRefFromStorage: '',
                    },
                    {
                        id: 'photo-id-2',
                        imageRefFromStorage: '',
                    },

                ]}
            /> */}
        </>
        
    )
}

export default EditRecipeForm;