import { useState } from "react";
import LandingPage from "./components/LandingPage";
import HotelScene from "./components/HotelScene";

type ViewType = "landing" | "hotel" | "rooms" | "gallery" | "contact" | "booking";

function App() {
  const [view, setView] = useState<ViewType>("landing");
  if (view === "landing") {
    return (
      <LandingPage 
        onEnter={() => setView("hotel")}
        onStart={() => setView("landing")}
        onRooms={() => setView("rooms")}
        onGallery={() => setView("gallery")}
        onContact={() => setView("contact")}
        onBooking={() => setView("booking")}
      />
    );
  }
  if (view === "hotel") {
    return <HotelScene onBack={() => setView("landing")} />;
  }

  const placeholderStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b1020",
    color: "white",
    fontFamily: "sans-serif",
    gap: "20px"
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 24px",
    borderRadius: "20px",
    border: "none",
    background: "#4da3ff",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  };

  if (view === "rooms") {
    return (
      <div style={placeholderStyle}>
        <h2>🛏️ Nasze Pokoje & Apartamenty</h2>
        <p>Lista luksusowych pokoi oraz konfigurator rezerwacji już wkrótce.</p>
        <button style={buttonStyle} onClick={() => setView("landing")}>Wróć do strony głównej</button>
      </div>
    );
  }

  if (view === "gallery") {
    return (
      <div style={placeholderStyle}>
        <h2>🖼️ Galeria Zdjęć</h2>
        <p>Przeglądaj zdjęcia wnętrz, basenu oraz restauracji hotelu Agat.</p>
        <button style={buttonStyle} onClick={() => setView("landing")}>Wróć do strony głównej</button>
      </div>
    );
  }

  if (view === "contact") {
    return (
      <div style={placeholderStyle}>
        <h2>📞 Skontaktuj się z nami</h2>
        <p>Recepcja: +48 123 456 789 | Email: kontakt@agathotel.pl</p>
        <button style={buttonStyle} onClick={() => setView("landing")}>Wróć do strony głównej</button>
      </div>
    );
  }

  if (view === "booking") {
    return (
      <div style={placeholderStyle}>
        <h2>📅 System Rezerwacji Online</h2>
        <p>Wybierz datę, liczbę gości i zarezerwuj swój pobyt w kilka sekund.</p>
        <button style={buttonStyle} onClick={() => setView("landing")}>Wróć do strony głównej</button>
      </div>
    );
  }

  return null;
}

export default App;
