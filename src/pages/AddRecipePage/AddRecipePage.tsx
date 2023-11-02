import AddingRecipesForm from './components/AddingRecipesForm/AddingRecipesForm';
import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';
import './AddRecipePage.scss'

const AddRecipePage = () => {
    return (
        <>
            <Header isSearch={false} />
            <main className="add-recepie">
                <div className="container">
                    <h1 className="add-recepie__title">Додати новий рецепт</h1>
                    <p className="add-recepie__descr">Заповніть поля нижче, додайте опис та завантажте фото рецепту</p>
                    {/* <AddingRecipesForm/> */}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default AddRecipePage;
