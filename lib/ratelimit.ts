import { redis } from "./redis";
import { Ratelimit } from "@upstash/ratelimit";

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "login_limiter",
});

export const voteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 3 requêtes / 1 minute
  prefix: "ratelimit:vote",
});