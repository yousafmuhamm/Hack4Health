import { db } from "./firebase";
import { SymptomInput, TriageResult } from "./types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function saveConsultation(
  input: SymptomInput,
  result: TriageResult
) {
  try {
    const docRef = await addDoc(collection(db, "consultations"), {
      age: input.age,
      symptoms: input.symptoms,
      onset: input.onset,
      severity: input.severity,
      redFlags: input.redFlags ?? false,
      urgency: result.urgency,
      recommendedCare: result.recommendedCare,
      summary: result.summary,
      createdAt: serverTimestamp(),
    });

    console.log("Saved consultation with ID:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("Error saving consultation:", err);
    return null;
  }
}
