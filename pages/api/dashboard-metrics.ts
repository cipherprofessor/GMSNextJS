import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/utils/db/dbConfig";
import { VisitorsPasses } from "../../src/utils/db/schema";
import { and, gte, lte, sql } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Active Passes
    const activePasses = await db
      .select()
      .from(VisitorsPasses)
      .where(
        and(
          lte(VisitorsPasses.dateStart, now),
          gte(VisitorsPasses.dateEnd, now)
        )
      );

    // Today's Visitors
    const todayVisitors = await db
      .select()
      .from(VisitorsPasses)
      .where(
        and(
          gte(VisitorsPasses.dateStart, today),
          lte(VisitorsPasses.dateStart, tomorrow)
        )
      );

    // Completed Visits (visits that have ended)
    const completedVisits = await db
      .select()
      .from(VisitorsPasses)
      .where(lte(VisitorsPasses.dateEnd, now));

    // Upcoming Visits
    const upcomingVisits = await db
      .select()
      .from(VisitorsPasses)
      .where(gte(VisitorsPasses.dateStart, now));

    // Visit Duration Metrics
    const durationMetrics = await db.select({
      avg_duration: sql`AVG(EXTRACT(EPOCH FROM (${VisitorsPasses.dateEnd} - ${VisitorsPasses.dateStart}))/3600)`,
      max_duration: sql`MAX(EXTRACT(EPOCH FROM (${VisitorsPasses.dateEnd} - ${VisitorsPasses.dateStart}))/3600)`,
      min_duration: sql`MIN(EXTRACT(EPOCH FROM (${VisitorsPasses.dateEnd} - ${VisitorsPasses.dateStart}))/3600)`
    }).from(VisitorsPasses);

    // Visits by Reason
    const visitsByReason = await db
      .select({
        reason: VisitorsPasses.reason,
        count: sql`COUNT(*)`.as('count')
      })
      .from(VisitorsPasses)
      .groupBy(VisitorsPasses.reason)
      .orderBy(sql`count DESC`)
      .limit(5);

    // Monthly Trend
    const monthlyTrend = await db
      .select({
        month: sql`DATE_TRUNC('month', ${VisitorsPasses.dateStart})`.as('month'),
        visit_count: sql`COUNT(*)`.as('visit_count')
      })
      .from(VisitorsPasses)
      .where(gte(VisitorsPasses.dateStart, sql`NOW() - INTERVAL '6 months'`))
      .groupBy(sql`month`)
      .orderBy(sql`month ASC`);

    // This Week's Visits
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weeklyVisits = await db
      .select()
      .from(VisitorsPasses)
      .where(
        and(
          gte(VisitorsPasses.dateStart, startOfWeek),
          lte(VisitorsPasses.dateStart, endOfWeek)
        )
      );

    // This Month's Visits
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyVisits = await db
      .select()
      .from(VisitorsPasses)
      .where(
        and(
          gte(VisitorsPasses.dateStart, startOfMonth),
          lte(VisitorsPasses.dateStart, endOfMonth)
        )
      );

    const metrics = {
      activePasses: activePasses.length,
      todayVisitors: todayVisitors.length,
      upcomingVisits: upcomingVisits.length,
      completedVisits: completedVisits.length,
      weeklyVisits: weeklyVisits.length,
      monthlyVisits: monthlyVisits.length,
      durationMetrics: {
        avg_duration: Number(durationMetrics[0].avg_duration) || 0,
        max_duration: Number(durationMetrics[0].max_duration) || 0,
        min_duration: Number(durationMetrics[0].min_duration) || 0
      },
      visitsByReason,
      monthlyTrend
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
}