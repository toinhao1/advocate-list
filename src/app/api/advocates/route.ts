import { sql } from "drizzle-orm";
import { db } from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 10;
  const offset = Number(searchParams.get('page') || 0) * limit;

  // Base query with search condition
  const advocatesToReturn = await db?.select()
    .from(advocates)
    .limit(limit)
    .offset(offset);

  // Get total count with the same search filter
  const [{ count }] = await db?.select({ count: sql`COUNT(*)` }).from(advocates);

  return Response.json({
    data: advocatesToReturn,
    pagination: {
      total: Number(count),
      page: Math.floor(offset / limit),
      pageSize: limit,
      totalPages: Math.ceil(Number(count) / limit)
    }
  });
}
