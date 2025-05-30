import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import { TDummy1 } from "../../entities/TDummy1";

const router = new Hono();

router.get("/", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const dummy1Repo = AppDataSource.getRepository(TDummy1);
    let data = await dummy1Repo.find({ take: 1000 });
    result.data = data;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.data = null;
    result.message = `!!! test1.get 에러. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

router.get("/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`👤 유저 상세: ${id}`);
});

export default router;
