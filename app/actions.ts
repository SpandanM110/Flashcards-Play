"use server"

import { generateFlashcardsWithGemini } from "@/lib/gemini-ai"
import type { Flashcard } from "@/lib/ai"

export async function getFlashcards(topic: string, count = 5): Promise<Flashcard[]> {
  try {
    console.log(`Generating flashcards for topic: ${topic}`)
    const flashcards = await generateFlashcardsWithGemini(topic, count)
    console.log(`Generated ${flashcards.length} flashcards`)

    // Validate the flashcards
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      console.error("Invalid flashcards response: empty or not an array")
      throw new Error("Invalid flashcards response")
    }

    return flashcards
  } catch (error) {
    console.error("Error in getFlashcards:", error)

    // Return a simple error flashcard
    return [
      {
        id: "error",
        question: `Could not generate flashcards for "${topic}"`,
        answer: "Please try again with a different topic or refresh the page.",
      },
    ]
  }
}
