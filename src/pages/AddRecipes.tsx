import AddingRecipesForm from '../components/AddingRecipesForm/AddingRecipesForm';
import Header from '../components/Header/Header';
import './AddRecipes.scss'

const AddRecipes = () => {
    return (
        <div className="container">
            <Header isSearch={false} recepies={[]}/>
            <main className="add-recepie">
                <div className="container">
                    <h2 className="add-recepie__title">Добавьте новый рецепт</h2>
                    <AddingRecipesForm/>
                </div>
            </main>
        </div>  
    )
}

export default AddRecipes;
