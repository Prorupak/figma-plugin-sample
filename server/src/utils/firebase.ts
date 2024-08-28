import { FIREBASE_DATABASE_URL } from "./globals.js";

export const saveToFirebase = async (path: string, data: object) => {
  await fetch(`${FIREBASE_DATABASE_URL}/${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const fetchFromFirebase = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${FIREBASE_DATABASE_URL}/${path}.json`);
  return (await response.json()) as T;
};

export const deleteFromFirebase = async (path: string): Promise<void> => {
  await fetch(`${FIREBASE_DATABASE_URL}/${path}.json`, {
    method: "DELETE",
  });
};
