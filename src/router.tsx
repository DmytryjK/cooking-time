import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from "react-router-dom";
import { Main, AddRecepies, RecepieMore, Favorites } from "./pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/add-recepie",
        element: <AddRecepies />, 
    },
    {
        path: "/favorites",
        element: <Favorites />, 
    },
    {
        path: "/about-recepie/:id",
        element: <RecepieMore />, 
    }
]);

export default router;