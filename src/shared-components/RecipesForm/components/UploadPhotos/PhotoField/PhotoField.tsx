import { useState, useEffect, useContext } from "react";
import { UploadFileType } from "../../../../../types/type";
import { LoadedPhotoContext } from "../../../RecipesForm";
import "./PhotoField.scss";

const PhotoField = ({ id, name, maxSize }: { id: string; name: string; maxSize?: string }) => {
  const { loadedPhotosInfo, setLoadedPhotosInfo } = useContext(LoadedPhotoContext);
  const [loadedPhotoSrc, setLocalPhotoSrc] = useState<string>("");
  const [uploadInputValue, setUploadInputValue] = useState<string>("");

  useEffect(() => {
    if (loadedPhotosInfo.length === 0) {
      setUploadInputValue("");
      setLocalPhotoSrc("");
    }
  }, [loadedPhotosInfo]);

  useEffect(() => {
    if (!loadedPhotosInfo || loadedPhotosInfo.length === 0) return;
    const foundIndexOfPhoto = loadedPhotosInfo.findIndex((photo) => photo.id === id);
    if (foundIndexOfPhoto === -1) return;
    setLocalPhotoSrc(loadedPhotosInfo[foundIndexOfPhoto].localSrc);
  }, [loadedPhotosInfo]);

  const readFile = (file: UploadFileType) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        setLoadedPhotosInfo((prev) => {
          return [
            ...prev.filter((prevItem) => prevItem.id !== id),
            {
              id,
              localSrc: fr.result?.toString() || "",
              loadedSrc: "",
              uploadFile: file,
              srcForRemove: prev.find((item) => item.id === id)?.srcForRemove || "",
            },
          ];
        });
        resolve("");
      };
      fr.onerror = reject;
      fr.readAsDataURL(file as any);
    });
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    if (files && files.length > 0) {
      if (files[0].type.indexOf("image") >= 0) {
        const currentSizeOfImg = files[0].size / 1000;
        if (maxSize && currentSizeOfImg > +maxSize) {
          alert(`Виберіть файл до ${maxSize} кБ`);
        } else {
          readFile(files[0]);
        }
      } else {
        alert("виберіть інший тип файлу для зображення");
      }
    }
  };

  const handleRemovePhoto = () => {
    setLoadedPhotosInfo((prev) => {
      return [
        ...prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              localSrc: "",
              srcForRemove: item.loadedSrc,
            };
          }
          return item;
        }),
      ];
    });
    setLocalPhotoSrc("");
  };

  return (
    <div className="upload-photo__wrapper">
      <h3 className="upload-photo__title form__label">{name}</h3>
      <label className="upload-photo__label">
        <input
          className="upload-photo__input"
          type="file"
          onChange={handleUploadPhoto}
          value={uploadInputValue}
          disabled={!!loadedPhotoSrc}
        />
        <div className="upload-photo__info">
          {loadedPhotoSrc ? <img className="upload-photo__preview" src={loadedPhotoSrc} alt="" /> : "Завантажити фото"}
        </div>
        <button
          className={`upload-photo__reset-photo ${loadedPhotoSrc ? "active" : ""} `}
          type="button"
          aria-label="видалити фото"
          onClick={handleRemovePhoto}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Icons/close" clipPath="url(#clip0_909_820)">
              <path
                id="Vector (Stroke)"
                d="M0.79214 0.79214C1.01499 0.569287 1.37631 0.569287 1.59916 0.79214L9.20786 8.40084C9.43071 8.62369 9.43071 8.98501 9.20786 9.20786C8.98501 9.43071 8.62369 9.43071 8.40084 9.20786L0.79214 1.59916C0.569287 1.37631 0.569287 1.01499 0.79214 0.79214Z"
                fill="#D24A34"
              />
              <path
                id="Vector (Stroke)_2"
                d="M9.20786 0.79214C9.43071 1.01499 9.43071 1.37631 9.20786 1.59916L1.59916 9.20786C1.37631 9.43071 1.01499 9.43071 0.79214 9.20786C0.569287 8.98501 0.569287 8.62369 0.79214 8.40084L8.40084 0.79214C8.62369 0.569287 8.98501 0.569287 9.20786 0.79214Z"
                fill="#D24A34"
              />
            </g>
          </svg>
        </button>
      </label>
      {maxSize ? <span className="upload-photo__max-size">*Розмір до {maxSize} кБ</span> : ""}
    </div>
  );
};

export default PhotoField;
