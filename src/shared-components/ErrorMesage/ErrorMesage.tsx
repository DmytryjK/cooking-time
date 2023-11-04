import { FC } from 'react';
import './ErrorMesage.scss';

const ErrorMesage: FC<{ text: unknown | string }> = ({ text }) => {
    return <div className="errorMessage">{`${text}`}</div>;
};

export default ErrorMesage;
