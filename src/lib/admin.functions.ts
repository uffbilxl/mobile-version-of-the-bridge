import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

const credsSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

function checkCreds(input: { username: string; password: string }) {
  const { username, password } = credsSchema.parse(input);
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    throw new Error("Invalid admin credentials");
  }
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; password: string }) => input)
  .handler(async ({ data }) => {
    checkCreds(data);
    return { ok: true as const };
  });

export const adminGetAll = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; password: string }) => input)
  .handler(async ({ data }) => {
    checkCreds(data);

    const [profilesRes, sessionsRes, applicationsRes, devicesRes, coursesRes] =
      await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabaseAdmin
          .from("mentor_sessions")
          .select("*")
          .order("created_at", { ascending: false }),
        supabaseAdmin
          .from("mentor_applications")
          .select("*")
          .order("created_at", { ascending: false }),
        supabaseAdmin
          .from("device_requests")
          .select("*")
          .order("created_at", { ascending: false }),
        supabaseAdmin
          .from("user_courses")
          .select("*")
          .order("updated_at", { ascending: false }),
      ]);

    return {
      profiles: profilesRes.data ?? [],
      sessions: sessionsRes.data ?? [],
      applications: applicationsRes.data ?? [],
      devices: devicesRes.data ?? [],
      courses: coursesRes.data ?? [],
    };
  });