import request from '@/utils/request'

export type DashboardRange = "7d" | "30d";

export type DashboardOverview = {
  kpi: {
    todayCreated: number;
    todayResolved: number;
    openTickets: number;
    slaBreach: number;
    avgFirstResponseMin: number;
    csat: number;
    mom: Record<string, number>;
  };
  trend: { dates: string[]; created: number[]; resolved: number[]; breach: number[] };
  statusDist: Array<{ name: "OPEN" | "PENDING" | "RESOLVED" | "CLOSED"; value: number }>;
  channelDist: Array<{ name: string; value: number }>;
  slaCompliance: { value: number; target: number };
  priorityTtrHours: Array<{ priority: "P0" | "P1" | "P2" | "P3"; hours: number }>;
  teamLoad: { agents: Array<{ id: string; name: string }>; open: number[]; pending: number[]; overdue: number[] };
};

export const fetchDashboardOverview = (range:DashboardRange) => {
  return request.get<any>('/api/dashboard/overview', { params: { range } })
}