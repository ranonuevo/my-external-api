import { NextResponse } from "next/server";

type ApplicantCheck = {
  credit_score: "Good" | "Fair" | "Poor";
  blacklist_status: "Yes" | "No";
  employment_verified: "Yes" | "No";
};

const mockDatabase: Record<string, ApplicantCheck> = {
  "John Lee": {
    credit_score: "Good",
    blacklist_status: "No",
    employment_verified: "Yes",
  },
  "LEE, Chi Nan": {
    credit_score: "Good",
    blacklist_status: "No",
    employment_verified: "Yes",
  },
  "Chi Nan": {
    credit_score: "Good",
    blacklist_status: "No",
    employment_verified: "Yes",
  },
  "Peter Chan": {
    credit_score: "Poor",
    blacklist_status: "Yes",
    employment_verified: "No",
  },
  "Mary Wong": {
    credit_score: "Fair",
    blacklist_status: "No",
    employment_verified: "Yes",
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
