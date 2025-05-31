import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import { Page404 } from "./pages";
import { store } from "./store/store";
import { router, routerNoLoyout } from "./router";
import "./styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {router.map((link) => {
            return <Route key={link.path} path={link.path} element={link.element} />;
          })}
        </Route>
        {routerNoLoyout.map((link) => {
          return <Route key={link.path} path={link.path} element={link.element} />;
        })}
        <Route path="*" element={<Layout />}>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
);
