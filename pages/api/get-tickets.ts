import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/utils/db/dbConfig";
import { VisitorsPasses } from "../../src/utils/db/schema";
import { desc } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const passes = await db.select().from(VisitorsPasses).orderBy(desc(VisitorsPasses.id));
      
      // Transform dates to ISO strings for proper JSON serialization
      const formattedPasses = passes.map(pass => ({
        ...pass,
        dateStart: pass.dateStart.toISOString(),
        dateEnd: pass.dateEnd.toISOString()
      }));

      res.status(200).json(formattedPasses);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch passes" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}