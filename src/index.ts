import { Hono } from "hono";
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

type Bindings = {
  DB: D1Database;
};

// Define a custom context type that includes our Prisma client
type CustomContext = {
  prisma: PrismaClient;
};

// Create the Hono app with both Bindings and CustomContext
const app = new Hono<{ Bindings: Bindings; Variables: CustomContext }>();

let prismaClient: PrismaClient | null = null;

app.use('*', async (c, next) => {
  if (!prismaClient) {
    const adapter = new PrismaD1(c.env.DB);
    prismaClient = new PrismaClient({ adapter });
  }
  c.set('prisma', prismaClient);
  await next();
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
})

app.get("/users", async (c) => {
  const prisma = c.get('prisma');

  try {
    const users = await prisma.user.findMany();
    return c.json(users);
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

app.get("/users/:id", async (c) => {
  const userId = c.req.param("id");
  const prisma = c.get('prisma');

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (user) {
      return c.json(user);
    } else {
      return c.json({ error: "User not found" }, 404);
    }
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// catch all route
app.all('*', (c) => {
  return c.json({ error: "Route not found" }, 404);
})

export default app;