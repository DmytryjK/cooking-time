import { useEffect, useState } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import RecipesForm from "../../shared-components/RecipesForm/RecipesForm";
import PopUp from "../../shared-components/PopUp/PopUp";
import { useAppSelector } from "../../hooks/hooks";
import "./AddRecipePage.scss";

const AddRecipePage = () => {
  const { loadingForm } = useAppSelector((state) => state.recipes);
  const isMessageClosed = sessionStorage.getItem("isMessageClosed") === "true";
  const { uid } = useAppSelector((state) => state.authentication.user);
  const [isUnauthorizedAttention, setIsUnauthorizedAttention] = useState(!uid && !isMessageClosed);
  const [isSuccessPopUpShow, setIsSuccessPopUpShow] = useState(false);

  useEffect(() => {
    if (loadingForm === "succeeded") {
      setIsSuccessPopUpShow(true);
    }
  }, [loadingForm]);

  useEffect(() => {
    if (!uid && !isMessageClosed) {
      setIsUnauthorizedAttention(true);
    }
  }, [uid, isMessageClosed]);

  return (
    <>
      <LazyMotion features={domAnimation} strict>
        <m.section
          className="add-recepie"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
              delay: 0,
            },
          }}
          exit={{
            opacity: 0,
            display: "none",
          }}
        >
          <div className="container">
            <h1 className="add-recepie__title">Додати новий рецепт</h1>
            <p className="add-recepie__descr">Заповніть поля нижче, додайте опис та завантажте фото рецепту</p>
            <AnimatePresence>
              {isUnauthorizedAttention && (
                <m.div
                  className="add-recepie__unauthorized-attention"
                  key="attention"
                  initial={{
                    opacity: 0,
                    display: "none",
                  }}
                  animate={{
                    opacity: 1,
                    display: "inline-flex",
                    transition: {
                      duration: 0.3,
                      delay: 0.3,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      transitionEnd: {
                        display: "none",
                      },
                    },
                  }}
                >
                  <div className="add-recepie__unauthorized-inner">
                    <p>
                      Зверніть увагу, що ви додаєте рецепт, як не авторизований користувач. Ваш рецепт зможуть
                      редагувати усі користувачі на сайті.
                    </p>
                    <button
                      className="add-recepie__unauthorized-accept"
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem("isMessageClosed", true.toString());
                        setIsUnauthorizedAttention(false);
                      }}
                    >
                      Погоджуюсь
                    </button>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
            <RecipesForm id="" method="POST" />
          </div>
        </m.section>
      </LazyMotion>
      <PopUp
        isPopUpShow={isSuccessPopUpShow}
        setIsPopUpShow={setIsSuccessPopUpShow}
        text="Ваш рецепт успішно доданий!"
        subtext="Дякуємо за ваш внесок у нашу кулінарну спільноту! Тепер інші користувачі зможуть насолодитися вашим рецептом"
        method="POST"
      />
    </>
  );
};

export default AddRecipePage;
