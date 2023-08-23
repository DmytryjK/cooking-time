import { NavLink } from 'react-router-dom';
import './UnauthorizedFavoriteList.scss';

const UnauthorizedFavoriteList = () => {
  return (
    <div className="favorite-unauthorized">
        <h2 className="favorite-unauthorized__title">Мої обрані</h2>
        <p className="favorite-unauthorized__text">Щоб мати змогу додати рецепти в обрані або переглянути свій список обраних</p>
        <div className="favorite-unauthorized__link-wrapper">
            <NavLink className="favorite-unauthorized__link" to="/auth-register">Зареєструйтесь</NavLink>
            <span className="favorite-unauthorized__divider-link">або</span>
            <NavLink className="favorite-unauthorized__link" to="/auth-login">Увійдіть</NavLink>
        </div>
    </div>
  )
}

export default UnauthorizedFavoriteList;
