import { NextRequest } from "next/server";
import {openai} from "@/lib/openai";

type Triageresponse = {
      urgency: "emergency" | "urgent" | "soon" | "routine";
  recommendedCare: "ER" | "URGENT_CARE" | "WALK_IN" | "FAMILY_DOCTOR" | "SELF_CARE";
  summary: string; // short explanation to show in UI
  advice: string;  // patient-facing text
};

