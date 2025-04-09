import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const apiKey = process.env.RAWG_API_KEY

  try {
    const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching game details:", error)
    return NextResponse.json({ error: "Failed to fetch game details" }, { status: 500 })
  }
}
