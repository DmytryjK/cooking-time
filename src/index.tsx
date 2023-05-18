import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom";
import { Main, AddRecepies, RecepieMore, Favorites } from "./pages/";

import {store} from './store/store';

import './index.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
    },
    {
        path: "/add-recepie",
        element: <AddRecepies/>, 
    },
    {
        path: "/favorites",
        element: <Favorites/>, 
    },
    {
        path: "/about-recepie/:id",
        element: <RecepieMore/>, 
    }
]);

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<Provider store={store}>
		<RouterProvider router={router}/>
	</Provider>
);
