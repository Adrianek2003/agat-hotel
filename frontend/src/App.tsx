import { lazy, Suspense, useState } from "react";
import BookingPage from "./components/BookingPage";
import ContactPage from "./components/ContactPage";
import GalleryPage from "./components/GalleryPage";
import LandingPage from "./components/LandingPage";
import Layout from "./components/Layout";
import RoomsPage from "./components/RoomsPage";
import type { ViewType } from "./types";

const HotelScene = lazy(() => import("./components/HotelScene"));

function App() {
  const [view, setView] = useState<ViewType>("landing");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const navigate = (nextView: ViewType) => {
    if (nextView !== "booking") {
      setSelectedRoomId(null);
    }
    setView(nextView);
  };

  const bookRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setView("booking");
  };

  if (view === "hotel") {
    return (
      <Suspense
        fallback={
          <div className="hotel-loading" role="status">
            Ładowanie sceny 3D…
          </div>
        }
      >
        <HotelScene onBack={() => navigate("landing")} onBook={bookRoom} />
      </Suspense>
    );
  }

  return (
    <Layout view={view} onNavigate={navigate}>
      {view === "landing" && (
        <LandingPage
          onEnter={() => navigate("hotel")}
          onRooms={() => navigate("rooms")}
          onGallery={() => navigate("gallery")}
          onContact={() => navigate("contact")}
          onBooking={() => navigate("booking")}
        />
      )}

      {view === "rooms" && (
        <RoomsPage onBook={bookRoom} onNavigate={navigate} />
      )}

      {view === "gallery" && <GalleryPage />}

      {view === "contact" && <ContactPage />}

      {view === "booking" && (
        <BookingPage selectedRoomId={selectedRoomId} onNavigate={navigate} />
      )}
    </Layout>
  );
}

export default App;
