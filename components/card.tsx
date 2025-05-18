"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function Card() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
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
        className="absolute inset-0 flex items-center justify-center bg-[#eaeaf1] rounded-2xl shadow-md cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <span className="text-6xl" role="img" aria-label="Cat emoji">
          🐱
        </span>
      </motion.div>
    </>
  )
}
