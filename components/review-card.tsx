import type { Flashcard } from "@/lib/ai"

interface ReviewCardProps {
  flashcard: Flashcard
}

export function ReviewCard({ flashcard }: ReviewCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-[#eaeaf1] rounded-2xl p-6 shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-[#474747] mb-2">Question</h3>
          <p className="text-base text-[#474747] overflow-y-auto max-h-[120px]">{flashcard.question}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-[#01838c] mb-2">Answer</h3>
          <p className="text-base text-[#474747] overflow-y-auto max-h-[120px]">{flashcard.answer}</p>
        </div>
      </div>
    </div>
  )
}
