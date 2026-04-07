import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CMS_API_URL: z.url(),
    WEBSITE_ID: z.string().min(1),
    CMS_API_KEY: z.string().min(1),
    REVALIDATE_SECRET: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    CMS_API_URL: process.env.CMS_API_URL,
    WEBSITE_ID: process.env.WEBSITE_ID,
    CMS_API_KEY: process.env.CMS_API_KEY,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  },
});

