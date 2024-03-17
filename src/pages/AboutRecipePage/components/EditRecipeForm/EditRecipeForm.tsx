import { FC, SetStateAction } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Recipe } from '../../../../types/type';
import AddingRecipesForm from '../../../../shared-components/AddingRecipesForm/AddingRecipesForm';
import 'react-quill/dist/quill.snow.css';
import './EditRecipeForm.scss';

const EditRecipeForm: FC<{
    recipe: Recipe;
    setIsAttentionOpen: React.Dispatch<SetStateAction<boolean>>;
}> = ({ recipe, setIsAttentionOpen }) => {
    const {
        title,
        ingredients,
        imgDto,
        description,
        category,
        time,
        id,
        favorites,
    } = recipe;

    const loadedPhotos = imgDto.map((img) => {
        return {
            id: img.id,
            loadedSrc: img.src,
            localSrc: img.src,
        };
    });

    return (
        <>
            <button
                className="edit-recipe__back-btn"
                title="Відминити зміни"
                type="button"
                aria-label="Відминити зміни"
                onClick={() => setIsAttentionOpen(true)}
            />
            <LazyMotion features={domAnimation} strict>
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: {
                            duration: 0.5,
                            delay: 0,
                        },
                    }}
                    exit={{
                        opacity: 0,
                        display: 'none',
                    }}
                >
                    <AddingRecipesForm
                        id={id}
                        title={title}
                        categoryName={category}
                        timer={time}
                        descr={description}
                        loadedPhotos={loadedPhotos}
                        ingredients={ingredients}
                        isFavorite={favorites}
                        method="UPDATE"
                        text="Рецепт успішно оновлено"
                    />
                </m.div>
            </LazyMotion>
        </>
    );
};

export default EditRecipeForm;
