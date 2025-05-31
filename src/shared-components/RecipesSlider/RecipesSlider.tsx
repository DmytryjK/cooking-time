import { FC, memo } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons } from "./components/SliderArrowBtns";
import { manageFavoritesRecipes } from "../../store/reducers/FavoritesRecipesSlice";
import { setFavoriteRecipes } from "../../store/reducers/RecipesListSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import RecipeListItem from "../RecipeListItem/RecipeListItem";
import type { Recipe } from "../../types/type";
import { toggleFavoriteRecentlyRecipe } from "../../store/reducers/RecenltyViewedSlice";
import "./RecipesSlider.scss";

type PropType = {
  slides: Recipe[];
  options?: EmblaOptionsType;
};

const RecipesSlider: FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const dispatch = useAppDispatch();
  const { uid } = useAppSelector((state) => state.authentication.user);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const handleAddFavorite = (recepieId: string | number | null, item: Recipe) => {
    dispatch(manageFavoritesRecipes({ item, uid }));
    dispatch(
      setFavoriteRecipes({
        recipeId: recepieId,
        isFavorite: !item.favorites,
      }),
    );
    if (recepieId) {
      dispatch(toggleFavoriteRecentlyRecipe(recepieId.toString()));
    }
  };

  return (
    <div className="embla embla-recipes">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container embla__container-recipes">
          {slides.map((item, index) => {
            return (
              <RecipeListItem
                key={`recently-viewed-${item.id}`}
                recipe={item}
                addToFavorite={handleAddFavorite}
                index={index}
                className="embla__slide embla__slide-recipes"
              />
            );
          })}
        </div>
      </div>
      <div className="embla__controls embla-recipes__controls">
        <div className="embla__buttons embla-recipes__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
};

export default memo(RecipesSlider);
