import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { AppDataSource } from "./data-source1";
import * as dotenv from "dotenv";
import { TDummy1 } from "./entities/TDummy1";

/** 쿠팡 회사를 설립한거와 비슷
 * 웹 서버의 핵심 객체를 만듬
 */
const app = new Hono();

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

/** DB 연결 */
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
/** DB 연결 END */

/** 고객 요청 창구를 개설
 * get method 방식, "/" 경로로 요청을 받겠다
 */
app.get("/", async (c) => {
  // t_dummy1 이라는 테이블을 코드로 바꾼놈. t_dummy1 테이블 조작을 위한 준비
  // getRepository() 함수가 퉤 하고 뱉은 객체를 dummy1Repo 라는 변수로 받음
  // const는 값 바꾸지 말아라
  const dummy1Repo = AppDataSource.getRepository(TDummy1);

  let data: any;
  data = dummy1Repo.find();
  let dummy2 = 1 + 1;
  return c.json({ data, dummy2 });
});

/** 회사 운영 시작
 * 서버 구동 코드. 포트번호는 3000으로 하겠다
 */
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
