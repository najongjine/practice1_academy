import { Hono } from "hono";
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from "../../utils/utils";
import { TUser } from "../../entities/TUser";
import { AppDataSource } from "../../data-source1";
// .. 은 상위 폴더     상위 -> 상위 -> utils 폴더 -> utils 파일

const auth = new Hono();

// 회원가입
auth.post("/register", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const reqs = await c.req.json();
    let username = String(reqs?.username ?? "");
    let password = String(reqs?.password ?? "");
    const userRepo = AppDataSource.getRepository(TUser);
    let userData =
      (await userRepo.findOne({ where: { username: username } })) ??
      new TUser();
    if (userData?.idp) {
      result.success = false;
      result.message = "이미 가입된 회원입니다";
      return c.json(result);
    }
    const hashedPassword = await hashPassword(password);
    userData.username = username;
    userData.password = hashedPassword;
    userData = await userRepo.save(userData);
  } catch (error: any) {
    result.success = false;
    result.message = `!!! auth/register error. ${error?.message ?? ""}`;
    return c.json(result);
  }

  return c.json({ message: "회원가입이 완료되었습니다." }, 201);
});

// 로그인
auth.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const user = users.find((u) => u.username === username);
  if (!user) {
    return c.json({ message: "사용자를 찾을 수 없습니다." }, 404);
  }
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return c.json({ message: "비밀번호가 일치하지 않습니다." }, 401);
  }
  const token = generateToken({ id: user.id, username: user.username });
  return c.json({ token });
});

// 보호된 라우트
auth.get("/protected", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ message: "토큰이 제공되지 않았습니다." }, 401);
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return c.json({ message: "유효하지 않은 토큰입니다." }, 403);
  }
  return c.json({ message: "접근이 허용되었습니다.", user: decoded });
});

export default auth;
