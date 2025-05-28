import { serve } from "@hono/node-server";
import { Hono } from "hono";

/** 쿠팡 회사를 설립한거와 비슷
 * 웹 서버의 핵심 객체를 만듬
 */
const app = new Hono();

/** 고객 요청 창구를 개설
 * get method 방식, "/" 경로로 요청을 받겠다
 */
app.get("/", (c) => {
  // c 라는 놈은, 요청 & 응답 기능을 가지고 있다
  return c.text("Hello Hono!");
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
