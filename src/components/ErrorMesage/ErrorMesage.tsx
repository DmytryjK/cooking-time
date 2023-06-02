import './ErrorMesage.scss';

const ErrorMesage = ({text} : {text: unknown}) => {
    return (
        <div className="errorMessage">
            {`${text}`}
        </div>
    )
}

export default ErrorMesage;