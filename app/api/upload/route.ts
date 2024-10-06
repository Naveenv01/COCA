import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const uploadedFile = formData.get("file") as File | null;

  if (!uploadedFile) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (uploadedFile.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are accepted" },
      { status: 400 },
    );
  }

  try {
    const fileName = uuidv4();
    const tempFilePath = `/tmp/${fileName}.pdf`;
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    const parsedText = await parsePDF(tempFilePath);
    const insertedCount = await insertMongoDb(parsedText, uploadedFile);

    await fs.unlink(tempFilePath); // Clean up temporary file

    return NextResponse.json({
      message: `File "${uploadedFile.name}" processed. ${insertedCount} sentences added to the database.`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process the PDF file" },
      { status: 500 },
    );
  }
}

function parsePDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(errData.parserError),
    );
    pdfParser.on("pdfParser_dataReady", () => {
      const parsedText = (pdfParser as any).getRawTextContent();
      resolve(parsedText);
    });

    pdfParser.loadPDF(filePath);
  });
}

async function insertMongoDb(textData: string, uploadedFile: File) {
  const sentences = textData
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.trim().length > 0);
  const client = await clientPromise;
  const database = client.db("coca_like_db");
  const collection = database.collection("corpus");
  await collection.createIndex({ text: "text" });

  const fileMetadata = {
    fileName: uploadedFile.name,
    uploadDate: new Date(),
    sentenceCount: sentences.length,
  };

  const { insertedId } = await collection.insertOne(fileMetadata);

  const sentencesWithMetadata = sentences.map((sentence) => ({
    text: sentence
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
    fileId: insertedId,
    fileName: uploadedFile.name,
  }));
  const result = await collection.insertMany(sentencesWithMetadata);
  return result.insertedCount;
}
