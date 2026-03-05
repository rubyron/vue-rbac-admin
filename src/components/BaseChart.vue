<!-- src/components/BaseChart.vue -->
<template>
  <el-card shadow="never" class="chart-card">
    <div class="chart-header">
      <div class="title">{{ title }}</div>
      <slot name="extra" />
    </div>

    <div class="chart-body" :style="{ height }">
      <div v-if="loading" class="overlay">加载中...</div>
      <div v-else-if="empty" class="overlay">暂无数据</div>
      <v-chart v-else :option="option" autoresize @click="onClick" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

defineProps<{
  title: string;
  option: EChartsOption;
  loading?: boolean;
  empty?: boolean;
  height?: string;
}>();

const emit = defineEmits<{ (e: "chartClick", params: any): void }>();
function onClick(params: any) {
  emit("chartClick", params);
}
</script>

<style scoped>
.chart-card { height: 100%; }
.chart-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.title { font-weight: 600; }
.chart-body { position: relative; }
.overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  color: #666;
}
</style>
