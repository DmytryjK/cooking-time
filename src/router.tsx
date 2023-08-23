import { createBrowserRouter } from "react-router-dom";
import { MainPage, AddRecipePage, AboutRecipePage, FavoritesPage, AuthorizationPage } from "./pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/auth-register",
        element: <AuthorizationPage register />
    },
    {
        path: "/auth-login",
        element: <AuthorizationPage login />
    },
    {
        path: "/add-recipe",
        element: <AddRecipePage />, 
    },
    {
        path: "/favorites",
        element: <FavoritesPage />, 
    },
    {
        path: "/about-recepie/:id",
        element: <AboutRecipePage />, 
    },

]);

export default router;