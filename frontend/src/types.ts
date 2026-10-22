export type ViewType =
  | "landing"
  | "hotel"
  | "rooms"
  | "gallery"
  | "contact"
  | "booking";

export type Navigate = (view: ViewType) => void;

export type BookRoom = (roomId: string) => void;
