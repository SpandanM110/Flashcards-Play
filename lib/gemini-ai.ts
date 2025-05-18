import { GoogleGenAI } from "@google/genai"
import type { Flashcard } from "@/lib/ai"

export async function generateFlashcardsWithGemini(topic: string, count = 5): Promise<Flashcard[]> {
  try {
    // Initialize the Gemini API client
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })

    // Set up the configuration
    const config = {
      responseMimeType: "text/plain",
    }

    // Specify the model
    const model = "gemini-2.0-flash-lite"

    // Create the prompt
    const promptText = `Generate ${count} flashcards about "${topic}". 
    Your response MUST be a valid JSON array with objects containing "id", "question", and "answer" fields.
    DO NOT include any explanatory text before or after the JSON.
    ONLY return the raw JSON array.
    
    Example of the expected format:
    [
      {"id": "1", "question": "What is photosynthesis?", "answer": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."},
      {"id": "2", "question": "Another question?", "answer": "Another answer"}
    ]`

    // Set up the contents for the API request
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ]

    // Generate content using the API
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    })

    // Collect all chunks of the response
    let fullText = ""
    for await (const chunk of response) {
      fullText += chunk.text || ""
    }

    // Try to extract JSON from the response
    let jsonStr = fullText.trim()

    // If the response starts with text, try to find the JSON part
    if (!jsonStr.startsWith("[")) {
      const jsonStartIndex = jsonStr.indexOf("[")
      const jsonEndIndex = jsonStr.lastIndexOf("]") + 1

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        jsonStr = jsonStr.substring(jsonStartIndex, jsonEndIndex)
      }
    }

    // Parse the JSON response
    try {
      const flashcards = JSON.parse(jsonStr) as Flashcard[]
      return flashcards
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      console.error("Raw response:", jsonStr)

      // Fallback: Generate simple flashcards if parsing fails
      return generateFallbackFlashcards(topic, count)
    }
  } catch (error) {
    console.error("Error generating flashcards with Gemini:", error)
    return generateFallbackFlashcards(topic, count)
  }
}

// Fallback function to generate basic flashcards if the AI response fails
function generateFallbackFlashcards(topic: string, count: number): Flashcard[] {
  const fallbackCards: Flashcard[] = []

  for (let i = 1; i <= count; i++) {
    fallbackCards.push({
      id: i.toString(),
      question: `Question ${i} about ${topic}?`,
      answer: `This is a placeholder answer for question ${i} about ${topic}. Please try regenerating the flashcards.`,
    })
  }

  return fallbackCards
}
