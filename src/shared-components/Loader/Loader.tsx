import loader from '../../assets/icons/loader/loader.svg';
import './Loader.scss';
const Loader = () => {
    return (
        <div className="loader">
            <img className="loader__icon" src={loader} alt="" />
        </div>
    )
};

export default Loader;