import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { SymptomInput, TriageResult, Preconsult } from "./types";

/**
 * Older helper you may have had – kept for backwards compatibility.
 * If you don't use this anywhere, you can safely delete it later.
 */
export async function saveConsultation(
  input: SymptomInput,
  result: TriageResult
) {
  await addDoc(collection(db, "consultations"), {
    age: input.age ?? null,
    symptoms: input.symptoms ?? "",
    onset: input.onset ?? "",
    severity: input.severity ?? "",
    redFlags: input.redFlags ?? false,
    urgency: result.urgency ?? "routine",
    recommendedCare: result.recommendedCare ?? "",
    summary: result.summary ?? "",
    createdAt: serverTimestamp(),
  });
}

/**
 * Called on the PATIENT side after triage is done.
 * Saves a pre-consult document for clinicians to review.
 */
export async function savePreconsult(
  input: SymptomInput,
  result: TriageResult,
  opts?: {
    patientName?: string;
    chatSummary?: string;
    chatTranscript?: string;
  }
) {
  const { patientName, chatSummary, chatTranscript } = opts || {};

  await addDoc(collection(db, "consultations"), {
    patientName: patientName ?? "Patient",
    age: input.age ?? null,
    symptoms: input.symptoms ?? "",
    onset: input.onset ?? "",
    severity: input.severity ?? "",
    redFlags: input.redFlags ?? false,

    // What the clinician will see
    summary: chatSummary ?? result.summary ?? "",
    details:
      chatTranscript ??
      `Severity: ${input.severity ?? "unknown"}, red flags: ${
        input.redFlags ? "yes" : "no"
      }`,

    // For sorting/filtering – store as "urgency" to match your Preconsult type
    urgency: (result.urgency as string) ?? "routine",
    status: "pending",

    createdAt: serverTimestamp(),
  });
}

/**
 * Called on the CLINICIAN side to fetch all pre-consults.
 */
export async function fetchPreconsults(): Promise<Preconsult[]> {
  const snap = await getDocs(collection(db, "consultations"));

  return snap.docs.map((d) => {
    const data: any = d.data();

    const created =
      data.createdAt && typeof data.createdAt.toMillis === "function"
        ? data.createdAt.toMillis()
        : Date.now();

    // 🔹 Make sure we always return a field named "urgency" (what Preconsult expects)
    const urgency: string =
      (data.urgency as string) ??
      (data.urgencyLabel as string) ??
      "routine";

    return {
      id: d.id,
      patientName: data.patientName ?? "Patient",
      age: data.age ?? null,
      summary: data.summary ?? "",
      details: data.details ?? "",
      createdAt: created,
      urgency, // ✅ this matches your Preconsult type
      status: data.status ?? "pending",
      deferNote: data.deferNote ?? "",
    } as Preconsult;
  });
}

/**
 * Called on the CLINICIAN side when they accept / defer.
 */
export async function updatePreconsultStatus(
  id: string,
  status: "accepted" | "deferred",
  deferNote?: string
) {
  const ref = doc(db, "consultations", id);
  const update: any = { status };
  if (typeof deferNote === "string") {
    update.deferNote = deferNote;
  }
  await updateDoc(ref, update);
}
