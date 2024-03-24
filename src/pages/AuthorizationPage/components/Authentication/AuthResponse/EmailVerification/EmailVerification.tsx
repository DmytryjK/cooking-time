import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAuth, applyActionCode } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import ActionsMessage from '../../../ActionsMessage/ActionsMessage';
import type { TextActions } from '../../Authentication';
import Loader from '../../../../../../shared-components/Loader/Loader';
import './EmailVerification.scss';

const EmailVerification = ({
    setTextActions,
    setIsStateTextActionChange,
}: {
    setTextActions: Dispatch<SetStateAction<TextActions>>;
    setIsStateTextActionChange: Dispatch<SetStateAction<boolean>>;
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [textActionsRes, setTextActionsRes] = useState<TextActions>({
        text: [''],
        status: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const auth = getAuth();
    const actionCode = searchParams.get('oobCode') || '';
    const navigate = useNavigate();

    function handleVerifyEmail(auth: Auth, actionCode: string) {
        applyActionCode(auth, actionCode)
            .then(() => {
                setTextActionsRes({
                    text: [`Успішно верифіковано`],
                    status: 'SUCCESS',
                });
                setTimeout(() => {
                    setIsStateTextActionChange(false);
                    setTextActions({
                        text: [`Увійдіть, використовуючи актуальні дані`],
                        status: 'SUCCESS',
                    });
                    navigate('/auth-login');
                }, 1500);
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-action-code') {
                    setTextActionsRes({
                        text: [
                            `Некоректний код активації. Можливо пошта вже була активована. Спробуйте увійти в свій аккаунт ще раз.`,
                        ],
                        status: 'WARNING',
                    });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            handleVerifyEmail(auth, actionCode);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="authentication__block response active">
            {!isLoading && (
                <h1 className="authentication__block-title verification-email__title">
                    Верифікація електронної пошти
                </h1>
            )}
            {textActionsRes.text[0] && (
                <div className="verification-email__action-message">
                    <ActionsMessage textActions={textActionsRes} />
                </div>
            )}
            {isLoading && <Loader />}
        </div>
    );
};

export default EmailVerification;
