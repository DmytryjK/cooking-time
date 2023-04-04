import Filters from "../components/Filters/Filters";
import RecipeLIst from "../components/RecipeList/RecipeLIst";
const Main = () => {
    return (
        <div>
            <div className="container">
                <Filters/>
                <RecipeLIst/>
            </div>
        </div>
    )
}

export default Main;