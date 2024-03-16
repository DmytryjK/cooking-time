import { lazy } from 'react';
import AuthorizationPage from './AuthorizationPage/AuthorizationPage';

// import FavoritesPage from './FavoritesPage/FavoritesPage';
// import MainPage from './MainPage/MainPage';

const AddRecipePage = lazy(() => import('./AddRecipePage/AddRecipePage'));
const MainPage = lazy(() => import('./MainPage/MainPage'));
const AboutRecipePage = lazy(() => import('./AboutRecipePage/AboutRecipePage'));
const FavoritesPage = lazy(() => import('./FavoritesPage/FavoritesPage'));

export {
    AddRecipePage,
    MainPage,
    AboutRecipePage,
    FavoritesPage,
    AuthorizationPage,
};
