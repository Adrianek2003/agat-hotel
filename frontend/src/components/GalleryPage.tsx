import { useEffect, useState } from "react";
import "./GalleryPage.css";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  tone: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "recepcja",
    title: "Recepcja",
    description:
      "Jasna, przeszklona recepcja z widokiem na ogród. Tu zaczyna się każdy pobyt w hotelu Agat.",
    tone: "lobby",
  },
  {
    id: "pokoje",
    title: "Pokoje i apartamenty",
    description:
      "Ciepłe wnętrza, naturalne materiały i dużo światła. Od Standardu po apartament z tarasem.",
    tone: "rooms",
  },
  {
    id: "restauracja",
    title: "Restauracja",
    description:
      "Sezonowa kuchnia oparta na lokalnych produktach, serwowana od śniadania do późnej kolacji.",
    tone: "restaurant",
  },
  {
    id: "wellness",
    title: "Strefa wellness",
    description:
      "Sauna, łaźnia parowa i strefa relaksu, w której można zwolnić po całym dniu.",
    tone: "wellness",
  },
  {
    id: "basen",
    title: "Basen",
    description:
      "Podgrzewany basen z panoramicznymi oknami i strefą leżakowania dla gości hotelu.",
    tone: "pool",
  },
  {
    id: "taras",
    title: "Taras i ogród",
    description:
      "Zielona przestrzeń wspólna z miejscami do odpoczynku, spotkań i porannej kawy.",
    tone: "garden",
  },
];

function GalleryPage() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <section className="page gallery-page">
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">Galeria</p>
          <h1 className="page-title">Zobacz hotel od środka</h1>
          <p className="page-subtitle">
            Wybrane przestrzenie hotelu Agat — od recepcji i pokoi, przez
            restaurację, aż po strefę wellness i ogród.
          </p>
        </div>

        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`gallery-tile gallery-tile--${item.tone}${
                index === 0 ? " gallery-tile--featured" : ""
              }`}
              onClick={() => setSelected(item)}
              aria-label={`Powiększ: ${item.title}`}
            >
              <span className="gallery-tile__pattern" aria-hidden="true" />
              <span className="gallery-tile__caption">
                <span className="gallery-tile__title">{item.title}</span>
                <span className="gallery-tile__hint">Kliknij, aby powiększyć</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="gallery-modal"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <div
            className="gallery-modal__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-modal__close"
              onClick={() => setSelected(null)}
              aria-label="Zamknij podgląd"
              autoFocus
            >
              ×
            </button>

            <div className={`gallery-modal__visual gallery-tile--${selected.tone}`}>
              <span className="gallery-tile__pattern" aria-hidden="true" />
            </div>

            <h2 id="gallery-modal-title" className="gallery-modal__title">
              {selected.title}
            </h2>
            <p className="gallery-modal__description">{selected.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default GalleryPage;
