import { Redis } from "@upstash/redis"
import config from "./config"

// 👇 we can now import our redis client anywhere we need it
export const redis = new Redis({
  url: config.env.redis.restUrl,
  token: config.env.redis.restToken,
})