import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
  try {
    // TODO: listModels() is not available in current Gemini SDK version
    // const models = await genAI.listModels();
    
    // Return empty list for now
    return NextResponse.json({
      success: true,
      count: 0,
      models: [],
    });
    
    /* Original code - listModels() not available
    const modelList = models.map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedMethods: model.supportedGenerationMethods,
    }));

    return NextResponse.json({
      success: true,
      count: modelList.length,
      models: modelList,
    });
    */
  } catch (error: unknown) {
    console.error("Error listing models:", error);
    return NextResponse.json(
      {
        error: "Failed to list models",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
