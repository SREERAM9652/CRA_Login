import { NextResponse } from "next/server"
import accountsData from "@/data/accounts.json"

export async function GET() {
  return NextResponse.json(accountsData)
}
