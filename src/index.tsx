/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import { store } from './store/store';
import './styles/index.scss';
import { router, routerNoLoyout } from './router';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                {router.map((link) => {
                    return (
                        <Route
                            key={link.path}
                            path={link.path}
                            element={<Layout>{link.element}</Layout>}
                        />
                    );
                })}
                {routerNoLoyout.map((link) => {
                    return (
                        <Route
                            key={link.path}
                            path={link.path}
                            element={link.element}
                        />
                    );
                })}
            </Routes>
        </BrowserRouter>
    </Provider>
);
