import { asc, between, count, eq, getTableColumns, sql, ne } from 'drizzle-orm';
import { db } from '../db';
import { SelectVideo, videosTable } from '../schema';


export async function selectVideos(userId: string) {
  return await db.select().from(videosTable).where(ne(videosTable.userId, userId));
}
