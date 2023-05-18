import Header from "../components/Header/Header";
import RecipeLIst from "../components/RecipeList/RecipeLIst";

const Favorites = () => {
    return (
        <div>
            <div className="container">
                <Header/>
                <RecipeLIst url={'favorites'}/>
            </div>
        </div>
    )
}

export default Favorites;