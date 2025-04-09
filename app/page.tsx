"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import GameCard from "@/components/game-card"
import LoadingSpinner from "@/components/loading-spinner"

export default function HomePage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchGames()
  }, [page])

  const fetchGames = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/games?page=${page}&pageSize=12`)
      const data = await response.json()

      if (page === 1) {
        setGames(data.results)
      } else {
        setGames((prevGames) => [...prevGames, ...data.results])
      }
    } catch (error) {
      console.error("Error fetching games:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/games?search=${searchQuery}&page=1&pageSize=12`)
      const data = await response.json()
      setGames(data.results)
      setPage(1)
    } catch (error) {
      console.error("Error searching games:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Game Explorer
          </h1>

          <form onSubmit={handleSearch} className="w-full sm:w-auto sm:max-w-md relative">
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 focus:border-purple-500 pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center my-12">
              <LoadingSpinner />
            </div>
          )}

          {!loading && games.length > 0 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          {!loading && games.length === 0 && (
            <div className="text-center my-12 text-gray-400">
              <p className="text-xl">No games found</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
