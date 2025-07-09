import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  throw new Error(
    "Invalid environment variables:\n" +
      JSON.stringify(_env.error.format(), null, 2)
  );
}

export const env = _env.data;
