"use client"

import { useState } from "react"
import { AddCustomCard } from "./add-custom-card"
import type { Flashcard } from "@/lib/ai"
import { PlusIcon, TrashIcon } from "./icons"

interface CustomCardsManagerProps {
  customCards: Flashcard[]
  onAddCard: (card: Flashcard) => void
  onDeleteCard: (cardId: string) => void
  onStartStudy: () => void
  onBack: () => void
}

export function CustomCardsManager({
  customCards,
  onAddCard,
  onDeleteCard,
  onStartStudy,
  onBack,
}: CustomCardsManagerProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)

  const handleAddCard = (card: Flashcard) => {
    onAddCard(card)
    setIsAddingCard(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-[#01838c] hover:underline flex items-center text-sm">
          ← Back
        </button>

        <div className="flex gap-2">
          {customCards.length > 0 && (
            <button
              onClick={onStartStudy}
              className="px-3 py-1 bg-[#01838c] text-white rounded-full text-xs font-medium hover:bg-[#016d75] transition-colors"
            >
              Start Studying
            </button>
          )}

          {!isAddingCard && (
            <button
              onClick={() => setIsAddingCard(true)}
              className="px-3 py-1 bg-white border border-[#01838c] text-[#01838c] rounded-full text-xs font-medium hover:bg-[#e2f1f1] transition-colors flex items-center gap-1"
            >
              <PlusIcon /> Add Card
            </button>
          )}
        </div>
      </div>

      {isAddingCard ? (
        <AddCustomCard onAddCard={handleAddCard} onCancel={() => setIsAddingCard(false)} />
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-[#01838c]">Your Custom Flashcards</h2>

          {customCards.length === 0 ? (
            <div className="text-center p-6 bg-[#eaeaf1] rounded-2xl">
              <p className="text-[#474747] mb-4 text-sm">You haven't created any custom flashcards yet.</p>
              <button
                onClick={() => setIsAddingCard(true)}
                className="px-4 py-2 bg-[#01838c] text-white rounded-full text-sm font-medium hover:bg-[#016d75] transition-colors"
              >
                Create Your First Card
              </button>
            </div>
          ) : (
            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
              {customCards.map((card) => (
                <div key={card.id} className="bg-[#eaeaf1] rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <h3 className="font-medium text-[#474747] text-sm">Q: {card.question}</h3>
                      <p className="text-[#474747] mt-1 text-xs">A: {card.answer}</p>
                    </div>
                    <button
                      onClick={() => onDeleteCard(card.id)}
                      className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                      aria-label="Delete card"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
