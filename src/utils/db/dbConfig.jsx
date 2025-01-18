import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://gms_owne:QgYKi9yeL5kf@ep-old-mud-a1y0azje.ap-southeast-1.aws.neon.tech/gms?sslmode=require"
);
export const db = drizzle(sql, { schema });
