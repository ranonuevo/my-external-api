import { NextResponse } from "next/server";

type ApplicantCheck = {
  credit_score: "Good" | "Fair" | "Poor";
  blacklist_status: "Yes" | "No";
  employment_verified: "Yes" | "No";
  sanctions_hit: "Yes" | "No";
  sanctions_details: string[];
};

const mockDatabase: Record<string, ApplicantCheck> = {
  "John Lee": {
    credit_score: "Good",
    blacklist_status: "No",
    employment_verified: "Yes",
    sanctions_hit: "No",
    sanctions_details: [],
  },
  "LOK, Wing Ching": {
    credit_score: "Good",
    blacklist_status: "No",
    employment_verified: "Yes",
    sanctions_hit: "No",
    sanctions_details: [],
  },
  "LEE, Chi Nan": {
    credit_score: "Good",
    blacklist_status: "No",
    employment_verified: "Yes",
    sanctions_hit: "No",
    sanctions_details: [],
  },
  "Chi Nan": {
    credit_score: "Good",
    blacklist_status: "No",
    employment_verified: "Yes",
    sanctions_hit: "No",
    sanctions_details: [],
  },
  "Peter Chan": {
    credit_score: "Poor",
    blacklist_status: "Yes",
    employment_verified: "No",
    sanctions_hit: "No",
    sanctions_details: [],
  },
  "Mary Wong": {
    credit_score: "Fair",
    blacklist_status: "No",
    employment_verified: "Yes",
    sanctions_hit: "Yes",
    sanctions_details: ["OFAC Sanction List - 2022", "Interpol Red Notice"]
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, hkid } = body;

    if (!name || !hkid) {
      return NextResponse.json(
        { error: "Missing required fields: name, hkid" },
        { status: 400 }
      );
    }

    // Lookup applicant in mock database
    const checkResult =
      mockDatabase[name] ||
      ({
        credit_score: "Fair",
        blacklist_status: "No",
        employment_verified: "No",
      } as ApplicantCheck);

    const result = {
      applicant: { name, hkid },
      ...checkResult,
      checked_at: new Date().toISOString(),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid request", details: error.message },
      { status: 500 }
    );
  }
}
