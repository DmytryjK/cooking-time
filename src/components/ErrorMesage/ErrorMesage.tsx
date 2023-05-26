import './ErrorMesage.scss';

const ErrorMesage = ({text} : {text: string}) => {
    return (
        <div className="errorMessage">
            {text}
        </div>
    )
}

export default ErrorMesage;