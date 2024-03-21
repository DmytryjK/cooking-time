import { FC, SetStateAction, useEffect, useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Recipe } from '../../../../types/type';
import RecipesForm from '../../../../shared-components/RecipesForm/RecipesForm';
import { useAppSelector } from '../../../../hooks/hooks';
import PopUp from '../../../../shared-components/PopUp/PopUp';
import 'react-quill/dist/quill.snow.css';
import './EditRecipeForm.scss';

const EditRecipeForm: FC<{
    recipe: Recipe;
    setIsAttentionOpen: React.Dispatch<SetStateAction<boolean>>;
    setIsEditActive: React.Dispatch<SetStateAction<boolean>>;
}> = ({ recipe, setIsAttentionOpen, setIsEditActive }) => {
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
    const { loadingForm } = useAppSelector((state) => state.recipes);
    const [isSuccessPopUpShow, setIsSuccessPopUpShow] = useState(false);

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            setIsSuccessPopUpShow(true);
        }
    }, [loadingForm]);

    const loadedPhotos = imgDto.map((img) => {
        return {
            id: img.id,
            loadedSrc: img.src,
            localSrc: img.src,
        };
    });

    return (
        <div className="edit-recipe">
            <button
                className="edit-recipe__back-btn"
                title="Відминити зміни"
                type="button"
                aria-label="Відминити зміни"
                onClick={() => setIsAttentionOpen(true)}
            >
                Повернутись назад
                <svg
                    width="6"
                    height="11"
                    viewBox="0 0 6 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.164752 5.83525C-0.0549177 5.61558 -0.0549177 5.25942 0.164752 5.03975L4.66475 0.539751C4.88442 0.320081 5.24058 0.320081 5.46025 0.539751C5.67992 0.75942 5.67992 1.11558 5.46025 1.33525L1.35799 5.4375L5.46025 9.53975C5.67992 9.75942 5.67992 10.1156 5.46025 10.3352C5.24058 10.5549 4.88442 10.5549 4.66475 10.3352L0.164752 5.83525Z"
                        fill="#D24A34"
                    />
                </svg>
            </button>
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
                    <h1 className="edit-recipe__title">Редагувати рецепт</h1>
                    <p className="edit-recipe__descr">
                        Відредагуйте потрібні поля нижче та збережіть дані
                    </p>
                    <RecipesForm
                        id={id}
                        title={title}
                        categoryName={category}
                        timer={time}
                        descr={description}
                        loadedPhotos={loadedPhotos}
                        ingredients={ingredients}
                        isFavorite={favorites}
                        method="UPDATE"
                    />
                </m.div>
            </LazyMotion>
            <PopUp
                isPopUpShow={isSuccessPopUpShow}
                setIsPopUpShow={setIsSuccessPopUpShow}
                text="Оновлення збережено!"
                subtext="Ваш рецепт успішно оновлено та збережено на сайті. Ми цінуємо вашу участь у розвитку нашої кулінарної спільноти!"
                method="UPDATE"
                setIsEditActive={setIsEditActive}
            />
        </div>
    );
};

export default EditRecipeForm;
