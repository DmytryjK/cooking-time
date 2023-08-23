import './EmptyFavoriteList.scss';

const EmptyFavoriteList = () => {
  return (
    <div className="favorite-empty">
        <h2 className="favorite-empty__title">Мої обрані</h2>
        <p className="favorite-empty__text">Наразі список порожній. Час додати смачних рецептів і створити свою унікальну колекцію!</p>
        <div className="favorite-empty__link-wrapper">
            <a className="favorite-empty__link" href="/">На головну</a>
        </div>
    </div>
  )
}

export default EmptyFavoriteList;
