import logoWhite from '../../assets/icons/logo_white.svg';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <a className="footer__logo" href="/">
                    <img
                        className="footer__logo-img"
                        src={logoWhite}
                        alt="Cooking time logo"
                    />
                </a>
                <div className="footer__right-wrapper">
                    <div className="footer__additional-info">
                        <span className="footer__privacy">
                            Всі права захищені
                        </span>
                        <span className="footer__copyright">
                            ©2023 Cooking time
                        </span>
                    </div>
                    <div className="footer__contacts">
                        <a
                            className="footer__link-dev"
                            href="https://t.me/DmytryjK"
                        >
                            Розробка
                        </a>
                        <a
                            className="footer__link-design"
                            href="https://t.me/temchenkoinna"
                        >
                            Дизайн
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
