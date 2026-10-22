import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const rooms = [
  {
    code: "001",
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
    code: "002",
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
    code: "004",
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
    code: "005",
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
    code: "101",
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
    code: "102",
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
    code: "103",
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
    code: "104",
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
    code: "105",
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
    code: "201",
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
    code: "202",
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
    code: "203",
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
    code: "204",
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
    code: "205",
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

async function main() {
  for (const room of rooms) {
    const data = {
      name: room.name,
      category: room.category,
      price: room.price,
      capacity: room.capacity,
      size: room.size,
      description: room.description,
      features: JSON.stringify(room.features),
      available: room.available,
      windowId: room.windowId,
    };

    await prisma.room.upsert({
      where: { code: room.code },
      update: data,
      create: { code: room.code, ...data },
    });
  }

  console.log(`Seed zakończony: ${rooms.length} pokoi.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
