import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export type Flashcard = {
  id: string
  question: string
  answer: string
}

export async function generateFlashcards(topic: string, count = 5): Promise<Flashcard[]> {
  const prompt = `Generate ${count} flashcards about "${topic}". 
  Your response MUST be a valid JSON array with objects containing "id", "question", and "answer" fields.
  DO NOT include any explanatory text before or after the JSON.
  ONLY return the raw JSON array.
  
  Example of the expected format:
  [
    {"id": "1", "question": "What is photosynthesis?", "answer": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."},
    {"id": "2", "question": "Another question?", "answer": "Another answer"}
  ]`

  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Try to extract JSON from the response
    let jsonStr = text.trim()

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

      // Fallback: Generate simple flashcards if parsing fails
      return generateFallbackFlashcards(topic, count)
    }
  } catch (error) {
    console.error("Error generating flashcards:", error)
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
