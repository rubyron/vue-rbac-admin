// src/views/dashboard/options.ts
import type { EChartsOption } from "echarts";

export const trendOption = (dates: string[], created: number[], resolved: number[], breach: number[]): EChartsOption => ({
  tooltip: { trigger: "axis" },
  legend: { data: ["新建", "已解决", "逾期"] },
  grid: { left: 30, right: 20, top: 40, bottom: 25, containLabel: true },
  xAxis: { type: "category", data: dates, boundaryGap: false },
  yAxis: { type: "value" },
  series: [
    { name: "新建", type: "line", smooth: true, areaStyle: {}, data: created },
    { name: "已解决", type: "line", smooth: true, areaStyle: {}, data: resolved },
    { name: "逾期", type: "line", smooth: true, data: breach }
  ]
});

export const statusPieOption = (data: { name: string; value: number }[]): EChartsOption => ({
  tooltip: { trigger: "item" },
  legend: { bottom: 0 },
  series: [{
    type: "pie",
    radius: ["45%", "70%"],
    label: { show: false },
    emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
    labelLine: { show: false },
    data
  }]
});

export const channelBarOption = (data: { name: string; value: number }[]): EChartsOption => ({
  tooltip: { trigger: "axis" },
  grid: { left: 20, right: 10, top: 20, bottom: 20, containLabel: true },
  xAxis: { type: "value" },
  yAxis: { type: "category", data: data.map(d => d.name) },
  series: [{ type: "bar", data: data.map(d => d.value) }]
});

export const slaGaugeOption = (value: number, target: number): EChartsOption => ({
  series: [{
    type: "gauge",
    startAngle: 210,
    endAngle: -30,
    progress: { show: true, width: 12 },
    axisLine: { lineStyle: { width: 12 } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    pointer: { show: false },
    title: { show: true, offsetCenter: [0, "55%"], fontSize: 12 },
    detail: {
      valueAnimation: true,
      formatter: (v: number) => `${v.toFixed(1)}% / 目标 ${target}%`,
      fontSize: 14,
      offsetCenter: [0, "15%"]
    },
    data: [{ value, name: "SLA 合规率" }]
  }]
});

export const priorityTtrOption = (data: { priority: string; hours: number }[]): EChartsOption => ({
  tooltip: { trigger: "axis" },
  grid: { left: 30, right: 10, top: 20, bottom: 25, containLabel: true },
  xAxis: { type: "category", data: data.map(d => d.priority) },
  yAxis: { type: "value", name: "小时" },
  series: [{ type: "bar", data: data.map(d => d.hours) }]
});

export const teamLoadOption = (
  agents: string[],
  open: number[],
  pending: number[],
  overdue: number[]
): EChartsOption => ({
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
  legend: { data: ["待处理", "处理中", "逾期"] },
  grid: { left: 30, right: 10, top: 30, bottom: 25, containLabel: true },
  xAxis: { type: "value" },
  yAxis: { type: "category", data: agents },
  series: [
    { name: "待处理", type: "bar", stack: "total", data: open },
    { name: "处理中", type: "bar", stack: "total", data: pending },
    { name: "逾期", type: "bar", stack: "total", data: overdue }
  ]
});
