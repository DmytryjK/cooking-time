import AddingRecipesForm from './components/AddingRecipesForm/AddingRecipesForm';
import './AddRecipePage.scss';

const AddRecipePage = () => {
    return (
        <section className="add-recepie">
            <div className="container">
                <h1 className="add-recepie__title">Додати новий рецепт</h1>
                <p className="add-recepie__descr">
                    Заповніть поля нижче, додайте опис та завантажте фото
                    рецепту
                </p>
                <AddingRecipesForm id="" method="POST" />
            </div>
        </section>
    );
};

export default AddRecipePage;
