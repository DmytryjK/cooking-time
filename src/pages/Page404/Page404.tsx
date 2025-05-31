import { LazyMotion, m, domAnimation } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./Page404.scss";

const Page404 = () => {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.section
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.3,
            delay: 0.2,
          },
        }}
        className="not-found"
      >
        <div className="flex-container">
          <div className="text-center">
            <h1>
              <span className="fade-in" id="digit1">
                4
              </span>
              <span className="fade-in" id="digit2">
                0
              </span>
              <span className="fade-in" id="digit3">
                4
              </span>
            </h1>
            <h3 className="fadeIn">Сторінку не знайдено</h3>
            <div className="button-wrapper">
              <NavLink to="/">На головну</NavLink>
            </div>
          </div>
        </div>
      </m.section>
    </LazyMotion>
  );
};

export default Page404;
