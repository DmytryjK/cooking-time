import "./LoadingDataBtn.scss";

type Handler<T> = (args: T) => void;

type Props = {
  handleSubmit?: Handler<any>;
  textBtn: string;
  additionalClass?: string;
  isLoading: boolean;
};
const LoadingDataBtn = (props: Props) => {
  const { handleSubmit, textBtn, additionalClass, isLoading = true } = props;
  return (
    <button className={`loading-data-btn ${additionalClass || ""}`} type="button" onClick={handleSubmit}>
      {!isLoading && textBtn}
      {isLoading && (
        <span className="loading-data-btn__loading-dots">
          <span className="loading-data-btn__loading-dot" />
          <span className="loading-data-btn__loading-dot" />
          <span className="loading-data-btn__loading-dot" />
        </span>
      )}
    </button>
  );
};

export default LoadingDataBtn;
