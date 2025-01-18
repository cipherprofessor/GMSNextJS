import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/utils/db/dbConfig"; // Import your database instance
import { VisitorsPasses } from "../../src/utils/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, address, reason, date } = req.body;

    // Convert date fields to Date objects
    const startDate = new Date(date.start);
    const endDate = new Date(date.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    try {
      await db.insert(VisitorsPasses).values({
        name,
        email,
        address,
        reason,
        dateStart: startDate,  // Store the start date
        dateEnd: endDate,  // Store the end date
      });

      res.status(200).json({ message: "Pass created successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to create pass" });
    }
  } else {
    console.error("Invalid method");
    res.status(405).json({ error: "Method not allowed" });
  }
}
