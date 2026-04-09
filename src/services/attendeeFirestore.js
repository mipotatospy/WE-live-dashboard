import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getAllAttendees() {
  const snapshot = await getDocs(collection(db, "registry"));

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function getAttendeeById(id) {
  const ref = doc(db, "registry", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Attendee not found");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}