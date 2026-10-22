import "./LandingPage.css";

interface Props {
  onEnter: () => void;
  onRooms: () => void;
  onGallery: () => void;
  onContact: () => void;
  onBooking: () => void;
}

function LandingPage({
  onEnter,
  onRooms,
  onGallery,
  onContact,
  onBooking,
}: Props) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="heroLeft">
          <h1>
            Odkryj hotel
            <br />
            <span className="gradientText">w nowym wymiarze</span>
          </h1>

          <p>
            Nowoczesna aplikacja hotelowa z interaktywną wizualizacją 3D.
            Zwiedzaj obiekt i pokoje, sprawdzaj dostępność oraz rezerwuj online
            zanim dokonasz wyboru.
          </p>

          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={onEnter}
          >
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

        <div className="heroRight">
          <div className="previewCard">
            <div className="previewHeader">
              <span>Hotel 3D</span>
              <div className="dot" />
            </div>

            <div className="previewFake3D">🏨</div>

            <p>Interaktywny model budynku (Babylon.js)</p>

            <button
              type="button"
              className="btn btn--ghost previewButton"
              onClick={onEnter}
            >
              Otwórz widok 3D
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <button type="button" className="card featureCard" onClick={onEnter}>
          <span className="cardIcon">🏨</span>
          <h3>Wirtualny spacer</h3>
          <p>
            Przeglądaj hotel i zwiedzaj go w technologii Babylon.js w czasie
            rzeczywistym.
          </p>
        </button>

        <button type="button" className="card featureCard" onClick={onRooms}>
          <span className="cardIcon">🛏️</span>
          <h3>Komfortowe pokoje</h3>
          <p>
            Poznaj szczegóły i sprawdź dostępność każdego pokoju przed
            rezerwacją.
          </p>
        </button>

        <button type="button" className="card featureCard" onClick={onBooking}>
          <span className="cardIcon">⭐</span>
          <h3>Nowoczesna obsługa</h3>
          <p>
            Szybki system rezerwacji online oraz łatwe zarządzanie pobytem.
          </p>
        </button>
      </section>

      <section className="about">
        <p className="eyebrow">Hotel przyszłości</p>
        <h2>Klasyczna gościnność w cyfrowej odsłonie</h2>
        <p>
          System łączy klasyczną aplikację webową z technologią 3D, pozwalając
          użytkownikowi poznać obiekt w zupełnie nowy sposób.
        </p>
        <div className="aboutLinks">
          <button type="button" className="btn btn--outline" onClick={onGallery}>
            Zobacz galerię
          </button>
          <button type="button" className="btn btn--ghost" onClick={onContact}>
            Skontaktuj się z nami
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
