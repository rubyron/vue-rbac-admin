import request from '@/utils/request'



export async function queryTickets(
  params: any,
  signal?: AbortSignal
) {
  // 注意：这里的返回结构要跟你的后端约定一致
  return request.get("/api/tickets", { params, signal }) as Promise<{
    code: number;
    data: { list: any[]; total: number };
  }>;
}