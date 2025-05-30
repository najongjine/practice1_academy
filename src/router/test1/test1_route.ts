import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import { TDummy1 } from "../../entities/TDummy1";

const router = new Hono();

// async = 이 함수 안에 느린코드 있어. 라고 준비시켜줌
router.get("/", async (c) => {
  // 자료구조화된 객체
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
    const dummy1Repo = AppDataSource.getRepository(TDummy1);
    // dummy1 repository 를 사용해서 데이터 1000개 가져옴
    let data = await dummy1Repo.find({ take: 1000 });
    // result.data 여기에 데이터 가져올걸 저장시킴
    result.data = data;
    // 클라이언트에 보내줌
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.data = null;
    result.message = `!!! test1.get 에러. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

router.post("/insert", async (c) => {
  // 자료구조화된 객체
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    let _body: any = await c.req.json(); // JSON 형태로 body 파싱
    let name: string = _body?.name ?? "";
    // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
    const dummy1Repo = AppDataSource.getRepository(TDummy1);
    let newDummy1 = new TDummy1();
    newDummy1.name = name;
    let data = await dummy1Repo.save(newDummy1);
    // result.data 여기에 데이터 가져올걸 저장시킴
    result.data = data;
    // 클라이언트에 보내줌
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
