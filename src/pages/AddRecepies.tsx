import AddingRecepiesForm from '../components/AddingRecepiesForm/AddingRecepiesForm';
import './AddRecepies.scss'

const AddRecepies = () => {
    return (
        <main className="add-recepie">
            <div className="container">
                <h2 className="add-recepie__title">Добавьте новый рецепт</h2>
                <AddingRecepiesForm/>
            </div>
        </main>
    )
}

export default AddRecepies;
