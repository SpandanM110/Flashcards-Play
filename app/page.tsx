"use client"

import { useState, useEffect } from "react"
import { TopicSelector } from "@/components/topic-selector"
import { FlashcardComponent } from "@/components/flashcard"
import { Loading } from "@/components/loading"
import { ReviewCard } from "@/components/review-card"
import { CustomCardsManager } from "@/components/custom-cards-manager"
import { getFlashcards } from "./actions"
import type { Flashcard } from "@/lib/ai"

export default function Home() {
  const [topic, setTopic] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [knownCount, setKnownCount] = useState(0)
  const [unknownCount, setUnknownCount] = useState(0)
  const [unknownCards, setUnknownCards] = useState<Flashcard[]>([])
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [customCards, setCustomCards] = useState<Flashcard[]>([])
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [isStudyingCustomCards, setIsStudyingCustomCards] = useState(false)

  useEffect(() => {
    if (topic && !isCustomMode) {
      loadFlashcards(topic)
    }
  }, [topic, isCustomMode])

  const loadFlashcards = async (selectedTopic: string) => {
    setLoading(true)
    setError(null)
    setUnknownCards([])
    setIsReviewMode(false)
    try {
      console.log(`Loading flashcards for topic: ${selectedTopic}`)
      const cards = await getFlashcards(selectedTopic)
      console.log(`Received ${cards.length} flashcards`)

      // Check if we got an error card
      if (cards.length === 1 && cards[0].id === "error") {
        setError(`Failed to generate flashcards for "${selectedTopic}". Please try again.`)
        setFlashcards([])
      } else {
        setFlashcards(cards)
        setCurrentIndex(0)
        setKnownCount(0)
        setUnknownCount(0)
      }
    } catch (error) {
      console.error("Error loading flashcards:", error)
      setError(`An unexpected error occurred. Please try again.`)
      setFlashcards([])
    } finally {
      setLoading(false)
    }
  }

  const handleKnow = () => {
    setKnownCount((prev) => prev + 1)
    goToNextCard()
  }

  const handleDontKnow = () => {
    // Add current card to unknown cards list
    const currentCards = isStudyingCustomCards ? customCards : flashcards
    setUnknownCards((prev) => [...prev, currentCards[currentIndex]])
    setUnknownCount((prev) => prev + 1)
    goToNextCard()
  }

  const goToNextCard = () => {
    const currentCards = isStudyingCustomCards ? customCards : flashcards
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // All cards reviewed
      if (unknownCards.length > 0) {
        // If there are unknown cards, prepare for review mode
        setIsReviewMode(true)
        setReviewIndex(0)
      }
    }
  }

  const handleNextReview = () => {
    if (reviewIndex < unknownCards.length - 1) {
      setReviewIndex((prev) => prev + 1)
    } else {
      // End of review
      setIsReviewMode(false)
    }
  }

  const handlePrevReview = () => {
    if (reviewIndex > 0) {
      setReviewIndex((prev) => prev - 1)
    }
  }

  const resetTopic = () => {
    setTopic(null)
    setFlashcards([])
    setCurrentIndex(0)
    setKnownCount(0)
    setUnknownCount(0)
    setUnknownCards([])
    setIsReviewMode(false)
    setIsCustomMode(false)
    setIsStudyingCustomCards(false)
    setError(null)
  }

  const handleRetry = () => {
    if (topic) {
      loadFlashcards(topic)
    }
  }

  const handleCreateCustomCards = () => {
    setIsCustomMode(true)
  }

  const handleAddCustomCard = (card: Flashcard) => {
    setCustomCards((prev) => [...prev, card])
  }

  const handleDeleteCustomCard = (cardId: string) => {
    setCustomCards((prev) => prev.filter((card) => card.id !== cardId))
  }

  const handleStartStudyingCustomCards = () => {
    if (customCards.length > 0) {
      setIsStudyingCustomCards(true)
      setCurrentIndex(0)
      setKnownCount(0)
      setUnknownCount(0)
      setUnknownCards([])
      setIsReviewMode(false)
    }
  }

  const handleBackFromCustomCards = () => {
    setIsCustomMode(false)
    setIsStudyingCustomCards(false)
  }

  const getCurrentCards = () => {
    return isStudyingCustomCards ? customCards : flashcards
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {!topic && !isCustomMode ? (
        <TopicSelector onSelectTopic={setTopic} onCreateCustomCards={handleCreateCustomCards} />
      ) : isCustomMode && !isStudyingCustomCards ? (
        <CustomCardsManager
          customCards={customCards}
          onAddCard={handleAddCustomCard}
          onDeleteCard={handleDeleteCustomCard}
          onStartStudy={handleStartStudyingCustomCards}
          onBack={resetTopic}
        />
      ) : (
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="w-full flex justify-between items-center mb-6">
            <button
              onClick={isStudyingCustomCards ? () => setIsStudyingCustomCards(false) : resetTopic}
              className="text-[#01838c] hover:underline flex items-center text-sm"
            >
              ← {isStudyingCustomCards ? "Back to Custom Cards" : "Back to Topics"}
            </button>
            {getCurrentCards().length > 0 && !isReviewMode && (
              <div className="text-[#474747] text-sm">
                <span className="font-medium">{currentIndex + 1}</span> of{" "}
                <span className="font-medium">{getCurrentCards().length}</span> cards
              </div>
            )}
            {isReviewMode && unknownCards.length > 0 && (
              <div className="text-[#474747] text-sm">
                Review: <span className="font-medium">{reviewIndex + 1}</span> of{" "}
                <span className="font-medium">{unknownCards.length}</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-medium mb-6">
            <span className="text-[#01838c]">{isStudyingCustomCards ? "Custom" : topic}</span>
            <span className="text-[#474747]">{isReviewMode ? " review" : " flashcards"}</span>
          </h1>

          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-center p-6 bg-[#eaeaf1] rounded-2xl">
              <p className="text-red-500 mb-4 text-sm">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-[#01838c] text-white rounded-full text-sm font-medium hover:bg-[#016d75] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : isReviewMode && unknownCards.length > 0 ? (
            // Review mode for "Don't Know" cards
            <div className="w-full">
              <ReviewCard flashcard={unknownCards[reviewIndex]} />

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePrevReview}
                  disabled={reviewIndex === 0}
                  className="px-4 py-2 bg-white border border-[#01838c] text-[#01838c] rounded-full text-sm font-medium hover:bg-[#e2f1f1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {reviewIndex < unknownCards.length - 1 ? (
                  <button
                    onClick={handleNextReview}
                    className="px-4 py-2 bg-[#01838c] text-white rounded-full text-sm font-medium hover:bg-[#016d75] transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setIsReviewMode(false)}
                    className="px-4 py-2 bg-[#01838c] text-white rounded-full text-sm font-medium hover:bg-[#016d75] transition-colors"
                  >
                    Finish Review
                  </button>
                )}
              </div>
            </div>
          ) : getCurrentCards().length > 0 && currentIndex < getCurrentCards().length ? (
            // Normal flashcard mode
            <>
              <FlashcardComponent
                flashcard={getCurrentCards()[currentIndex]}
                onKnow={handleKnow}
                onDontKnow={handleDontKnow}
              />

              <div className="mt-6 flex gap-6">
                <div className="text-center">
                  <p className="text-[#474747] font-medium text-sm">Known</p>
                  <p className="text-xl font-bold text-green-500">{knownCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-[#474747] font-medium text-sm">Don't Know</p>
                  <p className="text-xl font-bold text-red-500">{unknownCount}</p>
                </div>
              </div>
            </>
          ) : getCurrentCards().length > 0 && !isReviewMode ? (
            // Summary screen after all cards are reviewed
            <div className="text-center p-6 bg-[#eaeaf1] rounded-2xl">
              <h2 className="text-xl font-medium text-[#01838c] mb-3">All Done!</h2>
              <p className="text-[#474747] mb-4 text-sm">
                You've completed all flashcards{isStudyingCustomCards ? " in your custom deck" : ` on ${topic}`}.
              </p>
              <div className="flex gap-6 justify-center mb-4">
                <div className="text-center">
                  <p className="text-[#474747] font-medium text-sm">Known</p>
                  <p className="text-xl font-bold text-green-500">{knownCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-[#474747] font-medium text-sm">Don't Know</p>
                  <p className="text-xl font-bold text-red-500">{unknownCount}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {unknownCards.length > 0 && (
                  <button
                    onClick={() => {
                      setIsReviewMode(true)
                      setReviewIndex(0)
                    }}
                    className="px-4 py-2 bg-[#01838c] text-white rounded-full text-sm font-medium hover:bg-[#016d75] transition-colors"
                  >
                    Review "Don't Know" Cards
                  </button>
                )}

                {isStudyingCustomCards ? (
                  <button
                    onClick={() => {
                      setIsStudyingCustomCards(false)
                      setIsCustomMode(true)
                    }}
                    className="px-4 py-2 bg-white border border-[#01838c] text-[#01838c] rounded-full text-sm font-medium hover:bg-[#e2f1f1] transition-colors"
                  >
                    Back to Custom Cards
                  </button>
                ) : (
                  <button
                    onClick={() => loadFlashcards(topic!)}
                    className="px-4 py-2 bg-white border border-[#01838c] text-[#01838c] rounded-full text-sm font-medium hover:bg-[#e2f1f1] transition-colors"
                  >
                    Generate New Cards
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-[#eaeaf1] rounded-2xl">
              <p className="text-[#474747] text-sm">
                {isStudyingCustomCards
                  ? "No custom flashcards available. Please create some cards first."
                  : "No flashcards available. Try a different topic."}
              </p>
              <button
                onClick={isStudyingCustomCards ? () => setIsStudyingCustomCards(false) : handleRetry}
                className="mt-4 px-4 py-2 bg-[#01838c] text-white rounded-full text-sm font-medium hover:bg-[#016d75] transition-colors"
              >
                {isStudyingCustomCards ? "Create Custom Cards" : "Try Again"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
