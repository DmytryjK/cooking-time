import './PopUp.scss';

const PopUp = () => {
    
    const handleClose = () => {
        const popUp = document.querySelector('.success-window');
        popUp?.classList.remove('active');
    }

    return (
        <div className="success-window">
            <div className="success-window__block">
                <h2 className="success-window__title">Спасибо, Ваш рецепт добавлен на сайт</h2>
                <div className="success-window__links">
                    <a className="success-window__back-main" href="/">Вернуться на главную</a>
                    <a className="success-window__back" href="/add-recepie">Назад</a>
                </div>
                <button          
                    className="success-window__close"
                    onClick={handleClose}
                ></button>
            </div>
        </div>
    )
}

export default PopUp;
