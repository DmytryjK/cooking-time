import {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import { NavLink } from 'react-router-dom';
import './PopUp.scss';

const PopUp = ({
    isPopUpShow,
    setIsPopUpShow,
    text,
    subtext,
    method,
    additionalBtnText,
    additionalBtnAction,
    setIsEditActive,
}: {
    isPopUpShow: boolean;
    setIsPopUpShow: Dispatch<SetStateAction<boolean>>;
    text?: string;
    subtext?: string;
    method?: 'POST' | 'UPDATE';
    additionalBtnText?: string;
    additionalBtnAction?: () => void;
    setIsEditActive?: Dispatch<SetStateAction<boolean>>;
}) => {
    const popUp = useRef<HTMLDivElement>(null);

    const closePopUp = useCallback((e: Event) => {
        const target = e.target as HTMLElement;
        if (target.className === 'success-window active') {
            setIsPopUpShow(false);
            if (method === 'UPDATE' && setIsEditActive) {
                setIsEditActive(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!isPopUpShow) return undefined;
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        popUp.current?.addEventListener('click', closePopUp);
        return () => popUp.current?.removeEventListener('click', closePopUp);
    }, [isPopUpShow]);

    return (
        <div
            className={`success-window ${isPopUpShow ? 'active' : ''}`}
            ref={popUp}
        >
            <div className="success-window__block">
                <h2 className="success-window__title">{text || ''}</h2>
                <h3 className="success-window__subtitle">{subtext || ''}</h3>
                <div className="success-window__links">
                    {additionalBtnText ? (
                        <button
                            className="success-window__back-main"
                            type="button"
                            onClick={additionalBtnAction}
                        >
                            {additionalBtnText}
                        </button>
                    ) : (
                        <NavLink to="/" className="success-window__back-main">
                            Перейти на головну
                        </NavLink>
                    )}
                </div>
                <button
                    className="success-window__close"
                    type="button"
                    onClick={() => {
                        setIsPopUpShow(false);
                        if (method === 'UPDATE' && setIsEditActive) {
                            setIsEditActive(false);
                        }
                    }}
                >
                    <svg
                        className="success-window__close-icon"
                        width="10"
                        height="11"
                        viewBox="0 0 10 11"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="Icons/close">
                            <path
                                id="Vector (Stroke)"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.79214 1.29214C1.01499 1.06929 1.37631 1.06929 1.59916 1.29214L9.20786 8.90084C9.43071 9.12369 9.43071 9.48501 9.20786 9.70786C8.98501 9.93071 8.62369 9.93071 8.40084 9.70786L0.79214 2.09916C0.569287 1.87631 0.569287 1.51499 0.79214 1.29214Z"
                            />
                            <path
                                id="Vector (Stroke)_2"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.20786 1.29214C9.43071 1.51499 9.43071 1.87631 9.20786 2.09916L1.59916 9.70786C1.37631 9.93071 1.01499 9.93071 0.79214 9.70786C0.569287 9.48501 0.569287 9.12369 0.79214 8.90084L8.40084 1.29214C8.62369 1.06929 8.98501 1.06929 9.20786 1.29214Z"
                            />
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PopUp;
