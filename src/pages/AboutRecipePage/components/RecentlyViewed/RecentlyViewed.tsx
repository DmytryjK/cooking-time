import { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import RecipesSlider from "../../../../shared-components/RecipesSlider/RecipesSlider";
import { useAppSelector, useAppDispatch } from "../../../../hooks/hooks";
import { fetchRecentlyRecipes } from "../../../../store/reducers/RecenltyViewedSlice";
import "./RecentlyViewed.scss";

const RecentlyViewed = ({ currentId }: { currentId: string | number | null }) => {
  const { recentlyRecipes } = useAppSelector((state) => state.recenltyViewed);
  const filteredRecentlyRecipes = recentlyRecipes.filter((item) => item.id !== currentId);
  const OPTIONS: EmblaOptionsType = {
    align: "start",
    duration: 20,
    skipSnaps: true,
  };
  const recentlyViewedIds = localStorage.getItem("recentlyViewedIds");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentId) return;
    if (!recentlyViewedIds) {
      localStorage.setItem("recentlyViewedIds", JSON.stringify([currentId]));
    } else {
      const parsedRecentlyViewedIds: string[] = JSON.parse(recentlyViewedIds);
      if (parsedRecentlyViewedIds.every((id) => id !== currentId)) {
        parsedRecentlyViewedIds.unshift(currentId.toString());
        const trimmedIds = parsedRecentlyViewedIds.filter((item, index: number) => index < 10);
        localStorage.setItem("recentlyViewedIds", JSON.stringify(trimmedIds));
      } else {
        parsedRecentlyViewedIds
          .splice(parsedRecentlyViewedIds.indexOf(currentId.toString()), 1)
          .unshift(currentId.toString());
      }
    }
  }, [currentId]);

  useEffect(() => {
    if (!recentlyViewedIds) return;
    dispatch(fetchRecentlyRecipes(JSON.parse(recentlyViewedIds)));
  }, [recentlyViewedIds]);

  return (
    <section className="recently-views">
      {filteredRecentlyRecipes.length > 0 && (
        <>
          <h2 className="recently-views__title">Нещодавно переглянуті</h2>
          <RecipesSlider slides={filteredRecentlyRecipes} options={OPTIONS} />
        </>
      )}
    </section>
  );
};

export default RecentlyViewed;
