import { Hono } from "hono";
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from "../../utils/utils";

const auth = new Hono();

interface User {
  id: number;
  username: string;
  password: string; // 해시된 비밀번호
}

const users: User[] = [];

// 회원가입
auth.post("/register", async (c) => {
  const { username, password } = await c.req.json();
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return c.json({ message: "이미 존재하는 사용자입니다." }, 400);
  }
  const hashedPassword = await hashPassword(password);
  const newUser: User = {
    id: users.length + 1,
    username,
    password: hashedPassword,
  };
  users.push(newUser);
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
