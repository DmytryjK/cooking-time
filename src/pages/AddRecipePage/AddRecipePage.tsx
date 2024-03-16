import { motion } from 'framer-motion';
import AddingRecipesForm from './components/AddingRecipesForm/AddingRecipesForm';
import './AddRecipePage.scss';

const AddRecipePage = () => {
    return (
        <motion.section
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
                <h1 className="add-recepie__title">Додати новий рецепт</h1>
                <p className="add-recepie__descr">
                    Заповніть поля нижче, додайте опис та завантажте фото
                    рецепту
                </p>
                <AddingRecipesForm id="" method="POST" />
            </div>
        </motion.section>
    );
};

export default AddRecipePage;
