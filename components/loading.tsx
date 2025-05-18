export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#eaeaf1] rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#01838c] rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-base text-[#474747]">Generating flashcards...</p>
    </div>
  )
}
