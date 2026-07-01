import "./LandingPage.css";

interface Props {
  onEnter: () => void;       // Widok 3D
  onStart: () => void;       // Strona Główna / Reset
  onRooms: () => void;       // Pokoje
  onGallery: () => void;     // Galeria
  onContact: () => void;     // Kontakt
  onBooking: () => void;     // Rezerwacja
}

function LandingPage({ onEnter, onStart, onRooms, onGallery, onContact, onBooking }: Props) {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="nav">
        <div className="logo" onClick={onStart} style={{ cursor: "pointer" }}>
          AGAT HOTEL
        </div>

        <div className="navLinks">
          <a href="#" onClick={(e) => { e.preventDefault(); onStart(); }}>Start</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onRooms(); }}>Pokoje</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onGallery(); }}>Galeria</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onContact(); }}>Kontakt</a>
        </div>

        <button className="navButton" onClick={onBooking}>
          Rezerwacja
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="heroLeft">
          <h1>
            Odkryj hotel<br />
            <span className="gradientText">w nowym wymiarze</span>
          </h1>

          <p>
            Nowoczesna aplikacja hotelowa z interaktywną wizualizacją 3D.
            Zwiedzaj obiekt i pokoje, sprawdzaj dostępność oraz rezerwuj online zanim dokonasz wyboru.
          </p>

          <button className="cta" onClick={onEnter}>
            Wejdź do hotelu 3D →
          </button>

          <div className="stats">
            <div>
              <b>120+</b>
              <span>pokoi</span>
            </div>

            <div>
              <b>4★</b>
              <span>standard</span>
            </div>

            <div>
              <b>98%</b>
              <span>zadowolenia</span>
            </div>
          </div>
        </div>

        {/* RIGHT 3D PREVIEW CARD */}
        <div className="heroRight">
          <div className="previewCard">
            <div className="previewHeader">
              <span>Hotel 3D</span>
              <div className="dot" />
            </div>

            <div className="previewFake3D">
              🏨
            </div>

            <p>Interaktywny model budynku (Babylon.js)</p>

            <button className="previewButton" onClick={onEnter}>
              Otwórz widok 3D
            </button>
          </div>
        </div>

      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="card" onClick={onEnter} style={{ cursor: "pointer" }}>
          <div className="cardIcon">🏨</div>
          <h3>Wirtualny spacer</h3>
          <p>Przeglądaj hotel i zwiedzaj go w technologii Babylon.js w czasie rzeczywistym.</p>
        </div>

        <div className="card" onClick={onRooms} style={{ cursor: "pointer" }}>
          <div className="cardIcon">🛏️</div>
          <h3>Komfortowe pokoje</h3>
          <p>Poznaj szczegóły i sprawdź dostępność każdego pokoju przed rezerwacją.</p>
        </div>

        <div className="card" onClick={onBooking} style={{ cursor: "pointer" }}>
          <div className="cardIcon">⭐</div>
          <h3>Nowoczesna obsługa</h3>
          <p>Szybki system rezerwacji online oraz łatwe zarządzanie pobytem.</p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>Hotel przyszłości</h2>
        <p>
          System łączy klasyczną aplikację webową z technologią 3D,
          pozwalając użytkownikowi poznać obiekt w zupełnie nowy sposób.
        </p>
      </section>

    </div>
  );
}

export default LandingPage;