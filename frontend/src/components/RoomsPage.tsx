import { useMemo, useState } from "react";
import { ROOMS } from "../data/rooms";
import type { BookRoom, Navigate } from "../types";
import "./RoomsPage.css";

interface Props {
  onBook: BookRoom;
  onNavigate: Navigate;
}

type RoomFilter = "all" | "available";

function floorLabel(number: string): string {
  return number.startsWith("0") ? "Parter" : `${number[0]}. piętro`;
}

function RoomsPage({ onBook, onNavigate }: Props) {
  const [filter, setFilter] = useState<RoomFilter>("all");

  const rooms = useMemo(
    () => (filter === "available" ? ROOMS.filter((room) => room.available) : ROOMS),
    [filter],
  );

  const availableCount = ROOMS.filter((room) => room.available).length;

  return (
    <section className="page rooms-page">
      <div className="container">
        <div className="rooms-page__intro">
          <div className="page-header">
            <p className="eyebrow">Pokoje i apartamenty</p>
            <h1 className="page-title">Wybierz przestrzeń dla siebie</h1>
            <p className="page-subtitle">
              Od komfortowych pokoi Standard po przestronne apartamenty z tarasem.
              Każdy pokój jest widoczny na fasadzie hotelu w interaktywnej scenie 3D.
            </p>
          </div>

          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onNavigate("hotel")}
          >
            Zobacz pokoje w 3D
          </button>
        </div>

        <div className="rooms-page__toolbar">
          <div className="filter-group" role="group" aria-label="Filtruj pokoje">
            <button
              type="button"
              className={`filter-chip${filter === "all" ? " filter-chip--active" : ""}`}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Wszystkie ({ROOMS.length})
            </button>
            <button
              type="button"
              className={`filter-chip${filter === "available" ? " filter-chip--active" : ""}`}
              aria-pressed={filter === "available"}
              onClick={() => setFilter("available")}
            >
              Dostępne ({availableCount})
            </button>
          </div>

          <p className="rooms-page__count">
            Wyświetlono {rooms.length} z {ROOMS.length} pokoi
          </p>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <article key={room.id} className="room-card card">
              <div className="room-card__top">
                <span className="eyebrow">{room.category}</span>
                <span
                  className={`badge ${room.available ? "badge--available" : "badge--unavailable"}`}
                >
                  {room.available ? "Dostępny" : "Zajęty"}
                </span>
              </div>

              <h2 className="room-card__title">{room.name}</h2>
              <p className="room-card__description">{room.description}</p>

              <ul className="room-card__meta">
                <li>{room.capacity} os.</li>
                <li>{room.size} m²</li>
                <li>{floorLabel(room.number)}</li>
              </ul>

              <div className="room-card__features">
                {room.features.slice(0, 4).map((feature) => (
                  <span key={feature} className="feature-chip">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="room-card__footer">
                <p className="room-card__price">
                  <strong>{room.price} zł</strong>
                  <span>/ noc</span>
                </p>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  disabled={!room.available}
                  onClick={() => onBook(room.id)}
                >
                  {room.available ? "Zarezerwuj" : "Niedostępny"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoomsPage;
