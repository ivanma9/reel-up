import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';
  
const db = drizzle(process.env.DATABASE_URL!);
async function main() {
  const users: typeof usersTable.$inferInsert[] = [
    {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    },
    {
      name: 'Alice',
      age: 25,
      email: 'alice@example.com',
    },
    {
      name: 'Bob',
      age: 35,
      email: 'bob@example.com',
    }
  ];
  await db.insert(usersTable).values(users);
  console.log('New users created!')
  const usersFromDb = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', usersFromDb)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
 console.log(usersTable.email)
  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, users[0].email));
  console.log('User info updated!')
  // await db.delete(usersTable)
  // console.log('User deleted!')
}
main();