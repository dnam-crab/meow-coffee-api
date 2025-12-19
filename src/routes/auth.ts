import type { Request, Response } from "express";
import { Router, type Router as ExpressRouter } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../prisma";

const router: ExpressRouter = Router();

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "meow_session";

function setSessionCookie(res: Response, token: string): void {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}

function getSessionToken(req: Request): string | null {
  const v: unknown = req.cookies?.[SESSION_COOKIE_NAME];
  return typeof v === "string" && v.length > 0 ? v : null;
}

type LoginBody = { email: string; password: string };

function isLoginBody(body: unknown): body is LoginBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return typeof b.email === "string" && typeof b.password === "string";
}

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const body: unknown = req.body;
  if (!isLoginBody(body))
    return res.status(400).json({ message: "Invalid payload" });

  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // ⚠️ đổi "passwordHash" theo field thật trong schema.prisma của mày
  const hash: unknown = (user as unknown as { passwordHash: unknown })
    .passwordHash;
  if (typeof hash !== "string")
    return res
      .status(500)
      .json({ message: "User password field not configured" });

  const ok = await bcrypt.compare(password, hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // ⚠️ đảm bảo model Session có fields token + userId
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  setSessionCookie(res, token);

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      //   name: (user as { name?: string | null }).name ?? null,
    },
  });
});

// GET /auth/me
router.get("/me", async (req: Request, res: Response) => {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const u = session.user;
  return res.json({
    user: {
      id: u.id,
      email: u.email,
      // name: u.name ?? null
    },
  });
});

// POST /auth/logout
router.post("/logout", async (req: Request, res: Response) => {
  const token = getSessionToken(req);

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  clearSessionCookie(res);
  return res.json({ ok: true });
});

export default router;
