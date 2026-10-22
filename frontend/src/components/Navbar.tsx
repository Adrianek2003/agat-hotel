import { useState } from "react";
import type { Navigate, ViewType } from "../types";
import "./Navbar.css";

interface Props {
  view: ViewType;
  onNavigate: Navigate;
}

const NAV_ITEMS: { view: ViewType; label: string }[] = [
  { view: "landing", label: "Start" },
  { view: "rooms", label: "Pokoje" },
  { view: "gallery", label: "Galeria" },
  { view: "contact", label: "Kontakt" },
];

function Navbar({ view, onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (nextView: ViewType) => {
    onNavigate(nextView);
    setMenuOpen(false);
  };

  return (
    <header className="nav">
      <button
        type="button"
        className="logo"
        onClick={() => handleNavigate("landing")}
        aria-label="AGAT HOTEL — strona główna"
      >
        AGAT HOTEL
      </button>

      <nav
        id="primary-navigation"
        className={`navLinks${menuOpen ? " navLinks--open" : ""}`}
        aria-label="Nawigacja główna"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            type="button"
            className={`navLink${view === item.view ? " navLink--active" : ""}`}
            aria-current={view === item.view ? "page" : undefined}
            onClick={() => handleNavigate(item.view)}
          >
            {item.label}
          </button>
        ))}

        <button
          type="button"
          className="btn btn--outline btn--sm navBooking"
          onClick={() => handleNavigate("booking")}
        >
          Rezerwacja
        </button>
      </nav>

      <div className="navActions">
        <button
          type="button"
          className="btn btn--outline btn--sm navBooking navBooking--desktop"
          onClick={() => handleNavigate("booking")}
        >
          Rezerwacja
        </button>

        <button
          type="button"
          className="navToggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
