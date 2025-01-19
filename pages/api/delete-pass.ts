import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/utils/db/dbConfig";
import { VisitorsPasses } from "../../src/utils/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid pass ID" });
    }

    try {
      await db.delete(VisitorsPasses)
        .where(eq(VisitorsPasses.id, parseInt(id)));

      res.status(200).json({ message: "Pass deleted successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to delete pass" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}