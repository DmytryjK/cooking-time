import ErrorMessage from '../../shared-components/ErrorMesage/ErrorMesage';
import Loader from '../../shared-components/Loader/Loader';

type Props = {
    error: null | unknown;
    errorText: string;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    content: () => JSX.Element | JSX.Element[];
};

const renderServerData = (props: Props) => {
    const { error, errorText, loading, content } = props;
    let render: JSX.Element | JSX.Element[] = <Loader />;

    if (error) {
        render = <ErrorMessage text={errorText} />;
    } else if (loading === 'succeeded') {
        render = content();
    }

    return render;
};

export default renderServerData;
