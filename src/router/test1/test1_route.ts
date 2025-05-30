import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) => {
  return c.text("👤 유저 목록");
});

router.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`👤 유저 상세: ${id}`);
});

export default router;
