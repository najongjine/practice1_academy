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
    // 클라이언트에서 json 데이터를 body로 보냄
    let _body: any = await c.req.json(); // JSON 형태로 body 파싱

    let name: string = _body?.name ?? "";
    // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
    const dummy1Repo = AppDataSource.getRepository(TDummy1);

    // 클래스를 진짜 사용하기위해서 인스턴스화 함. TDummy1 클래스를 직접 봐보면 @ 것들이 붙어있음
    // 이건 클래스를 db테이블 이랑 1:1로 연결시킨것임
    // 여기서 new TDummy1 이건 새로운 데이터란 뜻임
    let newDummy1 = new TDummy1();
    newDummy1.name = name;
    // 테이블에 데이터 저장
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

router.post("/update", async (c) => {
  // 자료구조화된 객체
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    // 클라이언트에서 json 데이터를 body로 보냄
    let _body: any = await c.req.json(); // JSON 형태로 body 파싱

    let name: string = _body?.name ?? "";
    let idp = Number(_body?.idp ?? 0);
    // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
    const dummy1Repo = AppDataSource.getRepository(TDummy1);

    let existData =
      (await dummy1Repo.findOne({ where: { idp: idp } })) ?? new TDummy1();
    existData.name = name;
    existData = await dummy1Repo.save(existData);
    result.data = existData;
    // 클라이언트에 보내줌
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.data = null;
    result.message = `!!! test1.get 에러. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

router.post("/upsert", async (c) => {
  // 자료구조화된 객체
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    // 클라이언트에서 json 데이터를 body로 보냄
    let _body: any = await c.req.json(); // JSON 형태로 body 파싱

    let name: string = _body?.name ?? "";
    let idp = Number(_body?.idp ?? 0);
    // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
    const dummy1Repo = AppDataSource.getRepository(TDummy1);

    // idp 가 0번인거 찾아와라
    // 없네?
    // new TDummy1() 요게 발동
    // TDummy1 이 t_dummy1 테이블. new TDummy1() 이 뜻은 새로운 데이터 라는 뜻이죠
    let existData =
      (await dummy1Repo.findOne({ where: { idp: idp } })) ?? new TDummy1();
    // idp 가 0 이상인데, DB 조회에서 데이터가 없으면 ... 이걸 수학 수식으로 표현함
    if (idp && !existData?.idp) {
      result.success = false;
      result.message = "없는 데이터를 수정하려 합니다. 반려처리 하겠습니다";
      // return 이 들어가면 퉤 뱉고, 함수 종료
      return c.json(result);
    }
    existData.name = name;
    // 이제 진짜 DB에 데이터 수정이나 저장 해라.
    existData = await dummy1Repo.save(existData);
    result.data = existData;
    // 클라이언트에 보내줌
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.data = null;
    result.message = `!!! test1.get 에러. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

router.post("/delete", async (c) => {
  // 자료구조화된 객체
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    // 클라이언트에서 json 데이터를 body로 보냄
    let _body: any = await c.req.json(); // JSON 형태로 body 파싱

    let idp = Number(_body?.idp ?? 0);
    // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
    const dummy1Repo = AppDataSource.getRepository(TDummy1);

    await dummy1Repo.delete({ idp: idp });

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
