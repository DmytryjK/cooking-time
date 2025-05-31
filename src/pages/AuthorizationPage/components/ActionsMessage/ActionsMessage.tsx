import nextId from "react-id-generator";
import type { TextActions } from "../Authentication/Authentication";
import "./ActionsMessage.scss";

const ActionsMessage = ({ textActions }: { textActions: TextActions }) => {
  const { text, status } = textActions;
  return (
    <div
      className={`auth-action-message ${status === "SUCCESS" ? "success" : ""} ${
        status === "WARNING" ? "warning" : ""
      }`}
    >
      <svg
        className="auth-action-message__icon"
        width="64px"
        height="64px"
        viewBox="-4.8 -4.8 33.60 33.60"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0" transform="translate(0,0), scale(1)">
          <path
            transform="translate(-4.8, -4.8), scale(2.1)"
            fill="#D24A34"
            d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
            strokeWidth="0"
          />
        </g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#CCCCCC"
          strokeWidth="0.096"
        />
        <g id="🔍-System-Icons" strokeWidth="0.00024000000000000003" fill="none" fillRule="evenodd">
          {" "}
          <g id="ic_fluent_important_24_regular" fill="#ffffff" fillRule="nonzero">
            {" "}
            <path d="M12,17.0015 C13.3813,17.0015 14.5011,18.1213 14.5011,19.5026 C14.5011,20.8839 13.3813,22.0037 12,22.0037 C10.6187,22.0037 9.49888,20.8839 9.49888,19.5026 C9.49888,18.1213 10.6187,17.0015 12,17.0015 Z M12,18.5015 C11.4471,18.5015 10.9989,18.9497 10.9989,19.5026 C10.9989,20.0555 11.4471,20.5037 12,20.5037 C12.5529,20.5037 13.0011,20.0555 13.0011,19.5026 C13.0011,18.9497 12.5529,18.5015 12,18.5015 Z M11.999,2.00244 C14.1393,2.00244 15.8744,3.7375 15.8744,5.87781 C15.8744,8.71128 14.8844,12.4318 14.339,14.2756 C14.0294,15.322 13.0657,16.0039 12.0006,16.0039 C10.9332,16.0039 9.96846,15.3191 9.65995,14.2708 L9.43749451,13.4935787 C8.88270062,11.4994608 8.12366,8.3311 8.12366,5.87781 C8.12366,3.7375 9.85872,2.00244 11.999,2.00244 Z M11.999,3.50244 C10.6871,3.50244 9.62366,4.56593 9.62366,5.87781 C9.62366,8.43944 10.5512,11.9861 11.0989,13.8473 C11.2125,14.2332 11.573,14.5039 12.0006,14.5039 C12.4275,14.5039 12.7869,14.2344 12.9006,13.8501 L13.0583294,13.3056653 C13.6088628,11.3652034 14.3744,8.23351909 14.3744,5.87781 C14.3744,4.56593 13.3109,3.50244 11.999,3.50244 Z">
              {" "}
            </path>{" "}
          </g>{" "}
        </g>
      </svg>
      <p>
        {text.map((item, index) => {
          if (text.length > 1 && index < text.length) {
            if (typeof item !== "string") {
              return <span key={nextId("bold")}>{item} </span>;
            }
            return `${item} `;
          }
          return item;
        })}
      </p>
    </div>
  );
};

export default ActionsMessage;
