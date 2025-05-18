"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void
  onCreateCustomCards: () => void
}

export function TopicSelector({ onSelectTopic, onCreateCustomCards }: TopicSelectorProps) {
  const [topic, setTopic] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onSelectTopic(topic.trim())
    }
  }

  const popularTopics = ["JavaScript Basics", "React Hooks", "World Capitals", "Human Anatomy", "Spanish Vocabulary"]

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-medium mb-8">
        <span className="text-[#01838c]">pick</span>
        <span className="text-[#474747]"> a topic </span>
        <span className="text-[#474747]">👀</span>
      </h1>

      <div className="relative w-80 md:w-96">
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
          className="relative flex flex-col items-center p-6 bg-[#eaeaf1] rounded-2xl shadow-md"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* Updated emoji container - centered, positioned higher, and larger */}
          <div className="absolute flex items-center justify-center w-full" style={{ top: "5px" }}>
            <span className="text-2xl  p-1 " role="img" aria-label="Sparkle emoji">
              ✨
            </span>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
            <div className="space-y-2">
              <label htmlFor="topic" className="block text-[#474747] font-medium text-sm">
                Enter a topic for flashcards:
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., JavaScript, Spanish, Biology"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01838c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#01838c] text-white rounded-lg font-medium hover:bg-[#016d75] transition-colors text-sm"
            >
              Generate Flashcards
            </button>

            <div className="text-center py-1">
              <span className="text-[#474747] text-sm">or</span>
            </div>

            <button
              type="button"
              onClick={onCreateCustomCards}
              className="w-full py-2 bg-white border border-[#01838c] text-[#01838c] rounded-lg font-medium hover:bg-[#e2f1f1] transition-colors text-sm"
            >
              Create Your Own Flashcards
            </button>
          </form>

          <div className="mt-4 w-full">
            <p className="text-[#474747] font-medium mb-2 text-sm">Popular topics:</p>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((popularTopic) => (
                <button
                  key={popularTopic}
                  onClick={() => {
                    setTopic(popularTopic)
                    onSelectTopic(popularTopic)
                  }}
                  className="px-2 py-1 bg-white border border-gray-300 rounded-full text-xs hover:bg-gray-100 transition-colors"
                >
                  {popularTopic}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
