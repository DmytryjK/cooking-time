
const AddRecepies = () => {
    return (
        <div className="add-recepie">
            <form action="add-recepie__form form">
                <label className="form__name-label">
                    <span>Name of the dish</span>
                    <input className="form__name-recepie" type="text"/>
                </label>
                <fieldset className="tagsForm">          
                    <legend className="tagsForm__header">Введите названия ингредиентов через запятую:</legend>
                    <div className="tagsForm__top-wrapper">
                        <input 
                        className="tagsForm__tagName"
                        type="text"/>
                        <button className="tagsForm__search-btn">+</button>
                    </div>
                    
                    <ul className="tagsForm__tagList"></ul>
                </fieldset>
                <label className="form__upload-label">
                    <span>Upload photo</span>
                    <input className="form__upload-photo" type="text"/>
                </label>
                <label className="form__descr-label">
                    <span>Description:</span>
                    <input className="form__descr" type="text"/>
                </label>
            </form>
        </div>
    )
}

export default AddRecepies;
