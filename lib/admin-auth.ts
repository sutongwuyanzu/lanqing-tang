// 后台管理员登录 —— 基于 Supabase Auth（邮箱+密码）
// 登录成功后必须再校验 admins 白名单，否则无后台权限
import { supabase, isSupabaseConfigured } from "./supabase";

export interface AdminInfo {
  email: string;
}

// 邮箱密码登录，并校验是否在 admins 白名单
export async function signInAdmin(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: "未配置 Supabase，请先按 SUPABASE_SETUP.md 完成配置" };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  // 校验管理员白名单（RLS 下，非管理员此处查不到行）
  const { data } = await supabase.from("admins").select("email").limit(1);
  if (!data || data.length === 0) {
    await supabase.auth.signOut();
    return { error: "该账号无后台管理权限" };
  }
  return { error: null };
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

// 取当前登录的管理员（未登录 / 非管理员 / 未配置 都返回 null）
export async function getCurrentAdmin(): Promise<AdminInfo | null> {
  if (!isSupabaseConfigured) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.email) return null;

  const { data } = await supabase.from("admins").select("email").limit(1);
  if (!data || data.length === 0) return null;
  return { email: session.user.email };
}

// 订阅登录态变化（后台 layout 用来驱动路由保护）
export function subscribeAuth(
  cb: (email: string | null) => void
): () => void {
  if (!isSupabaseConfigured) {
    cb(null);
    return () => {};
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user?.email ?? null);
  });
  return () => data.subscription.unsubscribe();
}
