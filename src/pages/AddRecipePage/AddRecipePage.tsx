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
                    <h2 className="add-recepie__title">Добавьте новый рецепт</h2>
                    <AddingRecipesForm/>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default AddRecipePage;
