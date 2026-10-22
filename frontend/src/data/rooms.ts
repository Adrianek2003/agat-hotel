export type RoomCategory = "Standard" | "Deluxe" | "Apartament";

export interface Room {
  id: string;
  number: string;
  name: string;
  category: RoomCategory;
  price: number;
  capacity: number;
  size: number;
  description: string;
  features: string[];
  available: boolean;
  windowId: string;
}

const STANDARD_FEATURES = [
  "Wi-Fi",
  "Smart TV",
  "Klimatyzacja",
  "Łazienka z prysznicem",
];

const DELUXE_FEATURES = [
  "Wi-Fi",
  "Smart TV 55\"",
  "Klimatyzacja",
  "Łazienka z wanną",
  "Minibar",
  "Balkon",
];

const APARTMENT_FEATURES = [
  "Wi-Fi",
  "Smart TV 65\"",
  "Klimatyzacja",
  "Łazienka z wanną i prysznicem",
  "Minibar",
  "Salon",
  "Taras",
  "Miejsce parkingowe",
];

export const ROOMS: Room[] = [
  {
    id: "001",
    number: "001",
    name: "Standard 001",
    category: "Standard",
    price: 240,
    capacity: 2,
    size: 22,
    description:
      "Przytulny pokój na parterze z bezpośrednim dostępem do strefy wejściowej hotelu.",
    features: STANDARD_FEATURES,
    available: true,
    windowId: "window_0_0",
  },
  {
    id: "002",
    number: "002",
    name: "Standard 002",
    category: "Standard",
    price: 260,
    capacity: 2,
    size: 24,
    description:
      "Funkcjonalny pokój dla dwóch osób, idealny na krótki wypoczynek w mieście.",
    features: STANDARD_FEATURES,
    available: true,
    windowId: "window_0_1",
  },
  {
    id: "004",
    number: "004",
    name: "Standard 004",
    category: "Standard",
    price: 260,
    capacity: 2,
    size: 24,
    description:
      "Spokojny pokój z widokiem na ogród, oddalony od głównego wejścia.",
    features: STANDARD_FEATURES,
    available: false,
    windowId: "window_0_3",
  },
  {
    id: "005",
    number: "005",
    name: "Standard 005",
    category: "Standard",
    price: 290,
    capacity: 3,
    size: 26,
    description:
      "Rodzinny pokój standardowy z dostawką, położony blisko recepcji.",
    features: [...STANDARD_FEATURES, "Dostawka"],
    available: true,
    windowId: "window_0_4",
  },
  {
    id: "101",
    number: "101",
    name: "Deluxe 101",
    category: "Deluxe",
    price: 380,
    capacity: 2,
    size: 30,
    description:
      "Nowoczesny pokój Deluxe z dużym łóżkiem i balkonem z widokiem na hotelowy ogród.",
    features: DELUXE_FEATURES,
    available: true,
    windowId: "window_1_0",
  },
  {
    id: "102",
    number: "102",
    name: "Deluxe 102",
    category: "Deluxe",
    price: 420,
    capacity: 3,
    size: 34,
    description:
      "Przestronny pokój Deluxe z częścią wypoczynkową i panoramicznym oknem.",
    features: DELUXE_FEATURES,
    available: true,
    windowId: "window_1_1",
  },
  {
    id: "103",
    number: "103",
    name: "Deluxe 103",
    category: "Deluxe",
    price: 380,
    capacity: 2,
    size: 30,
    description:
      "Komfortowy pokój Deluxe z balkonem, usytuowany w centralnej części elewacji.",
    features: DELUXE_FEATURES,
    available: false,
    windowId: "window_1_2",
  },
  {
    id: "104",
    number: "104",
    name: "Deluxe 104",
    category: "Deluxe",
    price: 440,
    capacity: 3,
    size: 36,
    description:
      "Największy pokój Deluxe z oddzielną strefą relaksu i widokiem na okolicę.",
    features: DELUXE_FEATURES,
    available: true,
    windowId: "window_1_3",
  },
  {
    id: "105",
    number: "105",
    name: "Deluxe 105",
    category: "Deluxe",
    price: 420,
    capacity: 2,
    size: 32,
    description:
      "Elegancki pokój Deluxe z ciepłym oświetleniem i wygodnym stanowiskiem pracy.",
    features: DELUXE_FEATURES,
    available: true,
    windowId: "window_1_4",
  },
  {
    id: "201",
    number: "201",
    name: "Apartament 201",
    category: "Apartament",
    price: 650,
    capacity: 4,
    size: 48,
    description:
      "Dwupokojowy apartament z salonem i tarasem, idealny dla rodzin i dłuższych pobytów.",
    features: APARTMENT_FEATURES,
    available: true,
    windowId: "window_2_0",
  },
  {
    id: "202",
    number: "202",
    name: "Apartament 202",
    category: "Apartament",
    price: 620,
    capacity: 3,
    size: 44,
    description:
      "Kameralny apartament z osobną sypialnią i strefą wypoczynkową.",
    features: APARTMENT_FEATURES,
    available: true,
    windowId: "window_2_1",
  },
  {
    id: "203",
    number: "203",
    name: "Apartament 203",
    category: "Apartament",
    price: 720,
    capacity: 4,
    size: 52,
    description:
      "Reprezentacyjny apartament z panoramicznym tarasem i widokiem na hotelowy ogród.",
    features: APARTMENT_FEATURES,
    available: false,
    windowId: "window_2_2",
  },
  {
    id: "204",
    number: "204",
    name: "Apartament 204",
    category: "Apartament",
    price: 680,
    capacity: 4,
    size: 50,
    description:
      "Przestronny apartament z salonem, jadalnią i dużym tarasem słonecznym.",
    features: APARTMENT_FEATURES,
    available: true,
    windowId: "window_2_3",
  },
  {
    id: "205",
    number: "205",
    name: "Apartament 205",
    category: "Apartament",
    price: 780,
    capacity: 5,
    size: 58,
    description:
      "Najbardziej ekskluzywny apartament w hotelu z dwiema sypialniami i tarasem narożnym.",
    features: APARTMENT_FEATURES,
    available: true,
    windowId: "window_2_4",
  },
];

export function getRoomById(id: string | null): Room | undefined {
  if (!id) return undefined;
  return ROOMS.find((room) => room.id === id);
}

export function getRoomByWindowId(windowId: string): Room | undefined {
  return ROOMS.find((room) => room.windowId === windowId);
}
