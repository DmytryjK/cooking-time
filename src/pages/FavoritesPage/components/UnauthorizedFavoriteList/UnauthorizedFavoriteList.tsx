import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import './UnauthorizedFavoriteList.scss';

const UnauthorizedFavoriteList = () => {
    return (
        <motion.div
            className="favorite-unauthorized"
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
            <h2 className="favorite-unauthorized__title">Мої обрані</h2>
            <p className="favorite-unauthorized__text">
                Щоб мати змогу додати рецепти в обрані або переглянути свій
                список обраних
            </p>
            <div className="favorite-unauthorized__link-wrapper">
                <NavLink
                    className="favorite-unauthorized__link"
                    to="/auth-register"
                >
                    Зареєструйтесь
                </NavLink>
                <span className="favorite-unauthorized__divider-link">або</span>
                <NavLink
                    className="favorite-unauthorized__link"
                    to="/auth-login"
                >
                    Увійдіть
                </NavLink>
            </div>
        </motion.div>
    );
};

export default UnauthorizedFavoriteList;
