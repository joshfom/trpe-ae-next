import { Hono } from "hono";

const app = new Hono()
  .get("/", async (c) => {
    return c.json({ message: "Admin Page Meta Route - TODO: Implement functionality" });
  });

export default app;