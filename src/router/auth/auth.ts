import { Hono } from "hono";
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from "../../utils/utils";
import { TUser } from "../../entities/TUser";
import { AppDataSource } from "../../data-source1";
import { instanceToPlain } from "class-transformer";
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
      (await userRepo.findOne({
        where: { username: username },
        relations: { tUserRoles: true },
      })) ?? new TUser();
    if (userData?.idp) {
      result.success = false;
      result.message = "이미 가입된 회원입니다";
      return c.json(result);
    }
    // 암호화. 단방향
    const hashedPassword = await hashPassword(password);
    // new TUser() 이건 findOne 할때 원펀치로 다 해결
    userData.username = username;
    userData.password = hashedPassword;
    // commit. 진짜 저장
    userData = await userRepo.save(userData);

    userData.password = "";

    let payload = instanceToPlain(userData);

    // 민증 발급. "999d" 이뜻은 만료기한 999일
    let userToken = generateToken(payload, "999d");
    // 유저의 회원가입 정보 전체 + 민증 data에 실어서 보내기
    result.data = { userData: userData, userToken: userToken };
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = `!!! auth/register error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

// 로그인
auth.post("/login", async (c) => {
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
      (await userRepo.findOne({
        where: { username: username },
        relations: { tUserRoles: true },
      })) ?? new TUser();
    if (!userData?.idp) {
      result.success = false;
      result.message = "잘못된 회원입니다";
      return c.json(result);
    }

    if (!(await comparePassword(password, userData.password))) {
      result.success = false;
      result.message = "잘못된 회원입니다";
      return c.json(result);
    }

    userData.password = "";
    let payload = instanceToPlain(userData);

    // 민증 발급. "999d" 이뜻은 만료기한 999일
    let userToken = generateToken(payload, "999d");
    // 유저의 회원가입 정보 전체 + 민증 data에 실어서 보내기
    result.data = { userData: userData, userToken: userToken };
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = `!!! auth/login error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

// 보호된 라우트
auth.get("/info", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const authHeader = c?.req?.header("Authorization");
    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);
    console.log(decoded);
    const hasMasterRole = decoded?.tUserRoles?.some(
      (role) => role.roleName === "master"
    );
    if (hasMasterRole) result.data = `마스터 권한이 있습니다`;
    else result.data = `마스터 권한이 없습니다`;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

export default auth;
