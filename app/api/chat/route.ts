import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(req: Request) {
  // Check if OpenAI API key is configured
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "OpenAI API key is not configured. Please add your OPENAI_API_KEY to the environment variables.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }

  try {
    const { messages } = await req.json()

    const result = streamText({
      // @ts-ignore
      model: openai("gpt-4o", {
        apiKey: apiKey, // Explicitly pass the API key
      }),
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
