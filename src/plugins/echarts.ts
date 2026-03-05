// src/plugins/echarts.ts
import { use } from "echarts/core";

// 渲染器（必须选一个）
import { CanvasRenderer } from "echarts/renderers";

// 你用到的图表
import { LineChart, BarChart, PieChart, GaugeChart } from "echarts/charts";

// 你用到的组件（tooltip/legend/grid 等）
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from "echarts/components";

// 可选：通用特性
import { LabelLayout, UniversalTransition } from "echarts/features";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition
]);
