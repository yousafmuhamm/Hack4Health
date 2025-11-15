import { db } from "./firebase";
import { SymptomInput, TriageResult } from "./types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
