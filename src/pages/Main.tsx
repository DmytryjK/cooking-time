import Header from "../components/Header/Header";
import AllRecipes from "../components/AllRecipes/AllRecipes";

import { useAppSelector } from "../hooks/hooks";

const Main = () => {
    const { recepies } = useAppSelector(state => state.recepies);

    return (
        <div>
            <div className="container">
                <Header isSearch={true} recepies={recepies}/> 
                <AllRecipes/>
            </div>
        </div>
    )
}

export default Main;