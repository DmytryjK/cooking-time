import AddingRecepiesForm from '../components/AddingRecepiesForm/AddingRecepiesForm';
import Header from '../components/Header/Header';
import './AddRecepies.scss'

const AddRecepies = () => {
    return (
        <div className="container">
            <Header isSearch={false} recepies={[]}/>
            <main className="add-recepie">
                <div className="container">
                    <h2 className="add-recepie__title">Добавьте новый рецепт</h2>
                    <AddingRecepiesForm/>
                </div>
            </main>
        </div>  
    )
}

export default AddRecepies;
