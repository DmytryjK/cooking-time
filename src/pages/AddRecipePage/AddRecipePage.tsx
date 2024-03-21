import { useEffect, useState } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import RecipesForm from '../../shared-components/RecipesForm/RecipesForm';
import PopUp from '../../shared-components/PopUp/PopUp';
import { useAppSelector } from '../../hooks/hooks';
import './AddRecipePage.scss';

const AddRecipePage = () => {
    const { loadingForm, error } = useAppSelector((state) => state.recipes);
    const [isSuccessPopUpShow, setIsSuccessPopUpShow] = useState(false);

    useEffect(() => {
        if (loadingForm === 'succeeded') {
            setIsSuccessPopUpShow(true);
        }
    }, [loadingForm]);

    return (
        <>
            <LazyMotion features={domAnimation} strict>
                <m.section
                    className="add-recepie"
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
                    <div className="container">
                        <h1 className="add-recepie__title">
                            Додати новий рецепт
                        </h1>
                        <p className="add-recepie__descr">
                            Заповніть поля нижче, додайте опис та завантажте
                            фото рецепту
                        </p>
                        <RecipesForm id="" method="POST" />
                    </div>
                </m.section>
            </LazyMotion>
            <PopUp
                isPopUpShow={isSuccessPopUpShow}
                setIsPopUpShow={setIsSuccessPopUpShow}
                text="Ваш рецепт успішно доданий!"
                subtext="Дякуємо за ваш внесок у нашу кулінарну спільноту! Тепер інші користувачі зможуть насолодитися вашим рецептом"
                method="POST"
            />
        </>
    );
};

export default AddRecipePage;
