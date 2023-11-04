import { NavLink } from 'react-router-dom';
import './EmptyFavoriteList.scss';

const EmptyFavoriteList = () => {
    return (
        <div className="favorite-empty">
            <h2 className="favorite-empty__title">Мої обрані</h2>
            <p className="favorite-empty__text">
                Наразі список порожній. Час додати смачних рецептів і створити
                свою унікальну колекцію!
            </p>
            <div className="favorite-empty__link-wrapper">
                <NavLink className="favorite-empty__link" to="/">
                    На головну
                </NavLink>
            </div>
        </div>
    );
};

export default EmptyFavoriteList;
