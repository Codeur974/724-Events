import { v4 as uuidv4 } from "uuid"; // Pour garantir des clés uniques
import { useEffect, useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const byDateDesc =
    data?.focus?.sort((evtA, evtB) =>
      new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
    ) || [];

  const nextCard = () => {
    timeoutRef.current = setTimeout(
      () => setIndex((prevIndex) => (prevIndex + 1) % byDateDesc.length),
      5000
    );
  };

  useEffect(() => {
    if (byDateDesc.length > 0) nextCard();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, byDateDesc]);

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => {
        // Génération d'une clé unique pour chaque événement
        const eventKey = `${event.id || uuidv4()}-${event.date}-${
          event.title
        }-${idx}`;

        return (
          <div key={eventKey}>
            <div
              className={`SlideCard SlideCard--${
                index === idx ? "display" : "hide"
              }`}
            >
              <img src={event.cover} alt="forum" />
              <div className="SlideCard__descriptionContainer">
                <div className="SlideCard__description">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div>{getMonth(new Date(event.date))}</div>
                </div>
              </div>
            </div>
            <div className="SlideCard__paginationContainer">
              <div className="SlideCard__pagination">
                {byDateDesc.map((_, radioIdx) => {
                  // Génération de clés uniques pour les radios
                  const radioKey = `radio-${event.id || uuidv4()}-${
                    event.date
                  }-${radioIdx}`;

                  return (
                    <input
                      key={radioKey} // Clé unique pour chaque radio
                      type="radio"
                      name="radio-button"
                      defaultChecked={index === radioIdx}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Slider;
