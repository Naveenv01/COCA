import { NextRequest, NextResponse } from "next/server";
import { AggregatedSearchResults } from "@/types";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const client = await clientPromise;
    const database = client.db("coca_like_db");
    const collection = database.collection("corpus");

    // Create a regex for exact word match
    const exactWordRegex = new RegExp(`\\b${q}\\b`, "i");

    const results = await collection
      .aggregate([
        {
          $match: {
            text: { $regex: exactWordRegex },
          },
        },
        {
          $project: {
            _id: 1,
            text: 1,
            fileName: 1,
          },
        },
        {
          $group: {
            _id: "$fileName",
            results: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    if (results.length === 0) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    const aggregatedResults: AggregatedSearchResults = results.map(
      (group: any) => ({
        fileName: group._id,
        count: group.count,
        results: group.results.map((result: any) => ({
          id: result._id.toString(),
          text: result.text,
          fileName: result.fileName,
          highlightedText: highlightText(result.text, q),
        })),
      }),
    );

    return NextResponse.json(aggregatedResults);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching" },
      { status: 500 },
    );
  }
}

function highlightText(text: string, query: string): string {
  const regex = new RegExp(`\\b(${query})\\b`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
