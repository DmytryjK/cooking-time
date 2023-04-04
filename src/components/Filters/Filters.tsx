import SearchForm from "../SearchForm/SearchForm";
import TagsForm from "../TagsForm/TagsForm";
import './Filters.scss';

const Filters = () => {
    return (
        <div className="filters">
            <SearchForm/>
            <TagsForm/>
        </div>
    )
}

export default Filters;
