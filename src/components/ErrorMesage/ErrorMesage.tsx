import {FC} from 'react';
import './ErrorMesage.scss';

const ErrorMesage: FC<{text: unknown}> = ({text}) => {
    return (
        <div className="errorMessage">
            {`${text}`}
        </div>
    )
}

export default ErrorMesage;