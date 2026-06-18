import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 是否已配置 Supabase（前台在未配置时降级到本地默认价/本地存储）
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// createClient 在空 URL/Key 时会抛错，静态导出预渲染阶段会执行模块顶层代码，
// 所以未配置时给占位值，避免构建失败；运行时用 isSupabaseConfigured 守卫所有调用
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: { persistSession: true, autoRefreshToken: true },
  }
);

// ============ 数据库行类型（对应 supabase/schema.sql） ============

export interface Product {
  id: string;
  product_key: string;
  name: string;
  category: "lot" | "pray" | "naming";
  price: number;
  is_active: boolean;
  sort: number;
  remark: string | null;
  updated_at: string;
}

export interface Order {
  id: number;
  order_no: string;
  type: "lot" | "pray" | "naming";
  product_key: string | null;
  product_name: string | null;
  amount: number;
  customer_name: string | null;
  customer_phone: string | null;
  detail: Record<string, unknown> | null;
  status: "paid" | "pending" | "refunded";
  created_at: string;
}

// 前台写入订单时的载荷（id/status/created_at 由数据库默认生成）
export type OrderInsert = Omit<Order, "id" | "created_at"> & {
  status?: Order["status"];
};

export interface Wish {
  id: number;
  source: "pray" | "lot";
  customer_name: string | null;
  masked_name: string | null;
  lamp: string | null;
  content: string | null;
  status: "pending" | "approved" | "rejected";
  is_public: boolean;
  created_at: string;
}

export type WishInsert = Omit<Wish, "id" | "created_at"> & {
  status?: Wish["status"];
  is_public?: boolean;
};
