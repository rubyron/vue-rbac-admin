<!-- src/views/dashboard/index.vue -->
<template>
  <div class="page">
    <!-- KPI -->
    <el-row :gutter="12" class="mb-12">
      <el-col :span="6" v-for="k in kpis" :key="k.key">
        <el-card shadow="never">
          <div class="kpi">
            <div class="kpi-title">{{ k.title }}</div>
            <div class="kpi-value">{{ k.value }}</div>
            <div class="kpi-sub">
              环比 {{ formatPct(k.mom) }}
              <span class="dot">·</span>
              <span class="hint">{{ k.hint }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Range Tabs -->
    <div class="mb-12">
      <el-segmented v-model="range" :options="rangeOptions" />
    </div>

    <!-- Charts row 1 -->
    <el-row :gutter="12" class="mb-12">
      <el-col :span="16">
        <BaseChart
          title="工单趋势（新建/已解决/逾期）"
          :option="optTrend"
          :loading="loading"
          :empty="emptyTrend"
          height="320px"
        >
          <template #extra>
            <el-tooltip content="口径：逾期=当前时间>slaDueAt；趋势为每天汇总" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </template>
        </BaseChart>
      </el-col>
      <el-col :span="8">
        <BaseChart
          title="状态分布"
          :option="optStatusPie"
          :loading="loading"
          :empty="emptyStatus"
          height="320px"
          @chartClick="onStatusClick"
        >
          <template #extra>
            <span class="extra-hint">点击下钻</span>
          </template>
        </BaseChart>
      </el-col>
    </el-row>

    <!-- Charts row 2 -->
    <el-row :gutter="12" class="mb-12">
      <el-col :span="8">
        <BaseChart
          title="渠道来源"
          :option="optChannelBar"
          :loading="loading"
          :empty="emptyChannel"
          height="280px"
          @chartClick="onChannelClick"
        >
          <template #extra>
            <span class="extra-hint">点击下钻</span>
          </template>
        </BaseChart>
      </el-col>

      <el-col :span="8">
        <BaseChart
          title="SLA 合规率（本月）"
          :option="optSlaGauge"
          :loading="loading"
          :empty="emptySla"
          height="280px"
        >
          <template #extra>
            <el-tooltip content="合规率=（按SLA时限内解决的工单数）/（总解决工单数）" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </template>
        </BaseChart>
      </el-col>

      <el-col :span="8">
        <BaseChart
          title="优先级平均解决时长（小时）"
          :option="optPriority"
          :loading="loading"
          :empty="emptyPriority"
          height="280px"
        />
      </el-col>
    </el-row>

    <!-- Charts row 3 -->
    <el-row :gutter="12">
      <el-col :span="24">
        <BaseChart
          title="团队负载（待处理/处理中/逾期）"
          :option="optTeam"
          :loading="loading"
          :empty="emptyTeam"
          height="320px"
          @chartClick="onTeamClick"
        >
          <template #extra>
            <span class="extra-hint">点击客服下钻</span>
          </template>
        </BaseChart>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import BaseChart from "@/components/BaseChart.vue";
import { fetchDashboardOverview, type DashboardOverview, type DashboardRange } from "@/api/dashboard";
import {
  trendOption, statusPieOption, channelBarOption, slaGaugeOption, priorityTtrOption, teamLoadOption
} from "./options";

const router = useRouter();

const rangeOptions = [
  { label: "近 7 天", value: "7d" },
  { label: "近 30 天", value: "30d" }
];
const range = ref<DashboardRange>("30d");

const state = reactive<{
  data: DashboardOverview | null;
  loading: boolean;
}>({
  data: null,
  loading: false
});

const loading = computed(() => state.loading);

async function load() {
  state.loading = true;
  try {
    const res = await fetchDashboardOverview(range.value);
    state.data = res.data;
  } catch (e) {
    ElMessage.error("加载 Dashboard 失败");
  } finally {
    state.loading = false;
  }
}

onMounted(load);
watch(range, load);

// KPI cards
const kpis = computed(() => {
  const k = state.data?.kpi;
  if (!k) return [];
  return [
    { key: "todayCreated", title: "今日新建", value: k.todayCreated, mom: k.mom.todayCreated ?? 0, hint: "较上周期" },
    { key: "todayResolved", title: "今日已解决", value: k.todayResolved, mom: k.mom.todayResolved ?? 0, hint: "较上周期" },
    { key: "openTickets", title: "待处理", value: k.openTickets, mom: k.mom.openTickets ?? 0, hint: "较上周期" },
    { key: "slaBreach", title: "SLA 逾期", value: k.slaBreach, mom: k.mom.slaBreach ?? 0, hint: "较上周期" },
  ];
});

function formatPct(v: number) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${(v * 100).toFixed(1)}%`;
}

// Options (6 charts)
const optTrend = computed(() => {
  const t = state.data?.trend;
  if (!t) return {};
  return trendOption(t.dates, t.created, t.resolved, t.breach);
});
const optStatusPie = computed(() => statusPieOption(state.data?.statusDist ?? []));
const optChannelBar = computed(() => channelBarOption(state.data?.channelDist ?? []));
const optSlaGauge = computed(() => {
  const s = state.data?.slaCompliance;
  if (!s) return {};
  return slaGaugeOption(s.value, s.target);
});
const optPriority = computed(() => priorityTtrOption(state.data?.priorityTtrHours ?? []));
const optTeam = computed(() => {
  const tl = state.data?.teamLoad;
  if (!tl) return {};
  return teamLoadOption(
    tl.agents.map((a:{ id: string, name: string }) => a.name),
    tl.open,
    tl.pending,
    tl.overdue
  );
});

const emptyTrend = computed(() => !(state.data?.trend?.dates?.length));
const emptyStatus = computed(() => !(state.data?.statusDist?.length));
const emptyChannel = computed(() => !(state.data?.channelDist?.length));
const emptySla = computed(() => !state.data?.slaCompliance);
const emptyPriority = computed(() => !(state.data?.priorityTtrHours?.length));
const emptyTeam = computed(() => !(state.data?.teamLoad?.agents?.length));

// Drill-down handlers
function onStatusClick(params: any) {
  // pie click: params.name = "OPEN" ...
  if (!params?.name) return;
  console.log('onStatusClick',params)
  router.push({ path: "/tickets/list", query: { status: String(params.name), page: "1" } });
}

function onChannelClick(params: any) {
  // bar click: params.name 是 yAxis 类目名
  const channel = params?.name ?? params?.value?.[0];
  if (!channel) return;
  router.push({ path: "/tickets/list", query: { channel: String(channel), page: "1" } });
}

function onTeamClick(params: any) {
  // stack bar click: params.name = agentName
  const agentName = params?.name;
  if (!agentName) return;

  // 用 overview 里的 agents 映射 name -> id（真实项目也这样）
  const agents = state.data?.teamLoad?.agents ?? [];
  const agent = agents.find(a => a.name === agentName);
  if (!agent) return;

  router.push({ path: "/tickets/list", query: { assigneeId: agent.id, page: "1" } });
}
</script>

<style scoped>
.page { padding: 12px; }
.mb-12 { margin-bottom: 12px; }
.kpi-title { color: #666; font-size: 13px; }
.kpi-value { font-size: 28px; font-weight: 700; margin-top: 6px; }
.kpi-sub { margin-top: 8px; color: #999; font-size: 12px; }
.dot { margin: 0 6px; }
.extra-hint { color: #999; font-size: 12px; }
</style>
