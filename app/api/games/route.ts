import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"
  const pageSize = searchParams.get("pageSize") || "12"
  const search = searchParams.get("search") || ""

  const apiKey = process.env.RAWG_API_KEY

  try {
    let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`

    if (search) {
      url += `&search=${search}`
    }

    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 })
  }
}
