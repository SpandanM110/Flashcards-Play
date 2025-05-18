"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Flashcard } from "@/lib/ai"

interface FlashcardProps {
  flashcard: Flashcard
  onKnow: () => void
  onDontKnow: () => void
}

export function FlashcardComponent({ flashcard, onKnow, onDontKnow }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-72 h-80 md:w-80 md:h-96 perspective-1000" onClick={handleFlip}>
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

        {/* Main card with flip animation */}
        <div
          className="absolute inset-0 w-full h-full preserve-3d transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of card (Question) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#eaeaf1] rounded-2xl shadow-md cursor-pointer backface-hidden"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{ backfaceVisibility: "hidden" }}
          >
            <h3 className="text-lg font-medium text-[#474747] mb-3">Question</h3>
            <p className="text-center text-base text-[#474747] overflow-y-auto max-h-[200px] px-2">
              {flashcard.question}
            </p>
            <div className="absolute bottom-3 text-xs text-gray-500">(Click to flip)</div>
          </motion.div>

          {/* Back of card (Answer) */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#eaeaf1] rounded-2xl shadow-md cursor-pointer backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h3 className="text-lg font-medium text-[#01838c] mb-3">Answer</h3>
            <p className="text-center text-base text-[#474747] overflow-y-auto max-h-[200px] px-2">
              {flashcard.answer}
            </p>
            <div className="absolute bottom-3 text-xs text-gray-500">(Click to flip back)</div>
          </motion.div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onDontKnow}
          className="px-4 py-2 bg-white border border-[#01838c] text-[#01838c] rounded-full text-sm font-medium hover:bg-[#e2f1f1] transition-colors"
        >
          Don't Know
        </button>
        <button
          onClick={onKnow}
          className="px-4 py-2 bg-[#01838c] text-white rounded-full text-sm font-medium hover:bg-[#016d75] transition-colors"
        >
          Know
        </button>
      </div>
    </div>
  )
}
