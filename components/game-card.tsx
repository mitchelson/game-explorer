"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

export default function GameCard({ game }) {
  const router = useRouter()
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleClick = () => {
    router.push(`/game/${game.id}`)
  }

  // Format the release date
  const releaseDate = formatDate(game.released)

  // Calculate rating stars (out of 5)
  const rating = game.rating ? Math.round(game.rating) : 0

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
      }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden bg-gray-800 border-gray-700 h-full">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {!imageLoaded && <div className="absolute inset-0 bg-gray-700 animate-pulse" />}
          <Image
            src={game.background_image || "/placeholder.svg?height=270&width=480"}
            alt={game.name}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold line-clamp-1 mb-2">{game.name}</h2>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>{releaseDate}</div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{game.rating ? game.rating.toFixed(1) : "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
