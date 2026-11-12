import { Mountain } from "../types/mountains";
import { delay } from "../utils/delay";

const MOCK_MOUNTAINS: Mountain[] = [
  {
    id: 1,
    name: "Gunung Arjuno",
    location: "Malang, Jawa Timur",
    height: "3.339 MDPL",
    status: "Open",
    image: "https://example.com/arjuno.jpg",
    description: "Gunung berapi kerucut di Jawa Timur, Indonesia.",
  },
  {
    id: 2,
    name: "Gunung Semeru",
    location: "Lumajang/Malang, Jawa Timur",
    height: "3.676 MDPL",
    status: "Closed",
    image: "https://example.com/semeru.jpg",
    description: "Gunung tertinggi di Pulau Jawa.",
  },
];

export async function fetchMountains(): Promise<Mountain[]> {
  // Mensimulasikan delay jaringan server (Asynchronous)
  await delay(1500);
  return MOCK_MOUNTAINS;
}

export async function fetchMountainById(id: number): Promise<Mountain> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mountain = MOCK_MOUNTAINS.find((m) => m.id === id);
      if (mountain) {
        resolve(mountain);
      } else {
        reject(new Error("Data gunung tidak ditemukan"));
      }
    }, 1000);
  });
}
