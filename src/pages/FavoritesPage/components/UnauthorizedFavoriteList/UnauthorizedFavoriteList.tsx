import './UnauthorizedFavoriteList.scss';

const UnauthorizedFavoriteList = () => {
  return (
    <div className="favorite-unauthorized">
        <h2 className="favorite-unauthorized__title">Мої обрані</h2>
        <p className="favorite-unauthorized__text">Щоб мати змогу додати рецепти в обрані або переглянути свій список обраних</p>
        <div className="favorite-unauthorized__link-wrapper">
            <a className="favorite-unauthorized__link" href="/">Зареєструйтесь</a>
            <span className="favorite-unauthorized__divider-link">або</span>
            <a className="favorite-unauthorized__link" href="/">Увійдіть</a>
        </div>
    </div>
  )
}

export default UnauthorizedFavoriteList;
