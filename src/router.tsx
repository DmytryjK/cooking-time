import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from "react-router-dom";
import { Main, AddRecipes, AboutRecipe, Favorites, Authorization } from "./pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/auth",
        element: <Authorization/>
    },
    {
        path: "/add-recepie",
        element: <AddRecipes />, 
    },
    {
        path: "/favorites",
        element: <Favorites />, 
    },
    {
        path: "/about-recepie/:id",
        element: <AboutRecipe />, 
    }
]);

export default router;