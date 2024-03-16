import { NavLink } from 'react-router-dom';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import './EmptyFavoriteList.scss';

const EmptyFavoriteList = () => {
    return (
        <LazyMotion features={domAnimation} strict>
            <m.div
                className="favorite-empty"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                        delay: 0,
                    },
                }}
                exit={{
                    opacity: 0,
                    display: 'none',
                }}
            >
                <h2 className="favorite-empty__title">Мої обрані</h2>
                <p className="favorite-empty__text">
                    Наразі список порожній. Час додати смачних рецептів і
                    створити свою унікальну колекцію!
                </p>
                <div className="favorite-empty__link-wrapper">
                    <NavLink className="favorite-empty__link" to="/">
                        На головну
                    </NavLink>
                </div>
            </m.div>
        </LazyMotion>
    );
};

export default EmptyFavoriteList;
