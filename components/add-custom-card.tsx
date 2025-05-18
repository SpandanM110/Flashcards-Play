"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Flashcard } from "@/lib/ai"

interface AddCustomCardProps {
  onAddCard: (card: Flashcard) => void
  onCancel: () => void
}

export function AddCustomCard({ onAddCard, onCancel }: AddCustomCardProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!question.trim()) {
      setError("Question cannot be empty")
      return
    }

    if (!answer.trim()) {
      setError("Answer cannot be empty")
      return
    }

    // Create new card
    const newCard: Flashcard = {
      id: `custom-${Date.now()}`,
      question: question.trim(),
      answer: answer.trim(),
    }

    // Add card and reset form
    onAddCard(newCard)
    setQuestion("")
    setAnswer("")
    setError(null)
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        {/* Background cards for stacked effect */}
        <motion.div
          className="absolute inset-0 bg-[#eaeaf1] rounded-2xl shadow-sm"
          animate={{
            rotate: isHovered ? 6 : 3,
            x: isHovered ? 12 : 6,
            y: isHovered ? 4 : 2,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 bg-[#eaeaf1] rounded-2xl shadow-sm"
          animate={{
            rotate: isHovered ? 3 : 1.5,
            x: isHovered ? 6 : 3,
            y: isHovered ? 2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Main card */}
        <motion.div
          className="relative bg-[#eaeaf1] rounded-2xl p-6 shadow-md"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <h2 className="text-lg font-medium text-[#01838c] mb-4 text-center">Create Custom Flashcard</h2>

          {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-lg text-xs">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-[#474747] font-medium mb-1 text-sm">
                Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01838c] min-h-[60px] text-sm"
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div>
              <label htmlFor="answer" className="block text-[#474747] font-medium mb-1 text-sm">
                Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01838c] min-h-[60px] text-sm"
                placeholder="Enter the answer here..."
                required
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1 bg-white border border-[#01838c] text-[#01838c] rounded-full text-xs font-medium hover:bg-[#e2f1f1] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-[#01838c] text-white rounded-full text-xs font-medium hover:bg-[#016d75] transition-colors"
              >
                Add Card
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
