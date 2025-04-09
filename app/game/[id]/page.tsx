"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Star } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"
import { formatDate } from "@/lib/utils"

export default function GameDetailPage({ params }) {
  const { id } = params
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/games/${id}`)
        const data = await response.json()
        setGame(data)
      } catch (error) {
        console.error("Error fetching game details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Game not found</h1>
        <Link href="/" className="flex items-center text-purple-500 hover:text-purple-400">
          <ChevronLeft className="mr-1" size={20} />
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-[50vh] w-full">
        <Image
          src={game.background_image || "/placeholder.svg?height=540&width=1920"}
          alt={game.name}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="container mx-auto">
            <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition-colors">
              <ChevronLeft className="mr-1" size={20} />
              Back to games
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold"
            >
              {game.name}
            </motion.h1>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: game.description || "No description available." }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Details</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400">Release Date</h3>
                  <p>{formatDate(game.released) || "Unknown"}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400">Rating</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-1 text-yellow-400 fill-yellow-400" />
                    <span>{game.rating ? `${game.rating.toFixed(1)}/5` : "N/A"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.genres && game.genres.length > 0 ? (
                      game.genres.map((genre) => (
                        <span key={genre.id} className="px-2 py-1 bg-gray-700 rounded-md text-sm">
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <span>Unknown</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400">Platforms</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.platforms && game.platforms.length > 0 ? (
                      game.platforms.map((platform) => (
                        <span key={platform.platform.id} className="px-2 py-1 bg-gray-700 rounded-md text-sm">
                          {platform.platform.name}
                        </span>
                      ))
                    ) : (
                      <span>Unknown</span>
                    )}
                  </div>
                </div>

                {game.developers && game.developers.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400">Developer</h3>
                    <p>{game.developers.map((dev) => dev.name).join(", ")}</p>
                  </div>
                )}

                {game.publishers && game.publishers.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-400">Publisher</h3>
                    <p>{game.publishers.map((pub) => pub.name).join(", ")}</p>
                  </div>
                )}
              </div>
            </div>

            {game.website && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Links</h2>
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-400 flex items-center"
                >
                  Official Website
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
