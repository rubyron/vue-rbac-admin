<template>
  <div class="workbench">
    <section class="workbench__hero">
      <div class="workbench__hero-text">
        <h1 class="workbench__title">{{ greeting }}，{{ userDisplayName }}</h1>
        <p class="workbench__subtitle">
          {{ roleSubtitle }}
          <span class="workbench__dot">·</span>
          <span>{{ weekdayText }}</span>
        </p>
      </div>
      <div class="workbench__hero-tags">
        <el-tag type="primary" effect="plain">{{ roleLabel }}</el-tag>
        <el-tag v-if="workbenchTier === 'full'" type="success" effect="plain">可进入运营看板</el-tag>
        <el-tag v-else-if="workbenchTier === 'ops'" type="warning" effect="plain">业务处理视角</el-tag>
        <el-tag v-else type="info" effect="plain">个人工作台</el-tag>
      </div>
    </section>

    <section v-if="menuEntries.length" class="workbench__section">
      <div class="workbench__section-head">
        <h2>常用入口</h2>
        <span class="workbench__hint">根据当前角色动态展示可访问模块</span>
      </div>
      <el-row :gutter="12">
        <el-col v-for="(m, i) in menuEntries.slice(0, 8)" :key="i" :xs="12" :sm="8" :md="6" :lg="6">
          <el-card shadow="hover" class="workbench__nav-card" @click="go(m.path)">
            <div class="workbench__nav-card-inner">
              <el-icon class="workbench__nav-icon" :size="22"><Grid /></el-icon>
              <span class="workbench__nav-title">{{ m.title }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="workbench__section">
      <div class="workbench__section-head">
        <h2>快捷操作</h2>
        <span class="workbench__hint">高频操作一键直达</span>
      </div>
      <div class="workbench__quick-actions">
        <el-button v-for="(a, idx) in quickActions" :key="idx" :type="a.type || 'default'" @click="go(a.path)">
          {{ a.label }}
        </el-button>
      </div>
    </section>

    <el-alert
      v-if="roleSpotlightText"
      :title="roleSpotlightText"
      type="info"
      show-icon
      :closable="false"
      class="workbench__spotlight"
    />

    <el-row :gutter="16" class="workbench__main-row">
      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="workbench__card">
          <template #header>
            <span class="workbench__card-title">待办事项</span>
          </template>
          <el-timeline v-if="todoItems.length">
            <el-timeline-item v-for="(t, i) in todoItems" :key="i" :timestamp="t.time" placement="top">
              <el-tag size="small" class="workbench__todo-tag">{{ t.tag }}</el-tag>
              {{ t.title }}
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无待办" :image-size="64" />
        </el-card>

        <el-card shadow="never" class="workbench__card workbench__card--mt">
          <template #header>
            <span class="workbench__card-title">通知公告</span>
          </template>
          <ul class="workbench__notice-list">
            <li v-for="(n, i) in noticeItems" :key="i" class="workbench__notice-item">
              <span class="workbench__notice-dot" />
              <span class="workbench__notice-title">{{ n.title }}</span>
              <span class="workbench__notice-time">{{ n.time }}</span>
            </li>
          </ul>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="14">
        <div class="workbench__section-head workbench__section-head--inline">
          <h2>数据概览</h2>
          <el-segmented v-model="range" :options="rangeOptions" size="small" />
        </div>
        <el-row :gutter="12" class="workbench__kpi-row">
          <el-col v-for="k in kpiCards" :key="k.key" :span="6" :xs="12">
            <el-card shadow="never" class="workbench__kpi-card">
              <div class="kpi-title">{{ k.title }}</div>
              <div class="kpi-value">{{ k.value }}</div>
              <div class="kpi-sub">
                环比 {{ formatPct(k.mom) }}
                <span class="dot">·</span>
                <span class="hint">{{ k.hint }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Grid } from '@element-plus/icons-vue'
import { fetchDashboardOverview, type DashboardOverview, type DashboardRange } from '@/api/dashboard'
import { getRole } from '@/utils/token'
import { useUserStore } from '@/stores/user'
import { flattenMenuEntries } from '@/utils/menuFlatten'
import { getWorkbenchTier, quickActionsByRole, roleDisplayName, type WorkbenchTier } from '@/config/workbench'
import type { Role } from '@/mocks/handlers/rbac'
import { mockUsers } from '@/mocks/handlers/rbac'

const router = useRouter()
const userStore = useUserStore()

const rangeOptions = [
  { label: '近 7 天', value: '7d' },
  { label: '近 30 天', value: '30d' },
]
const range = ref<DashboardRange>('30d')

const state = reactive<{ data: DashboardOverview | null; loading: boolean }>({
  data: null,
  loading: false,
})

const currentRole = computed(() => (getRole() || 'employee') as Role)
const roleLabel = computed(() => roleDisplayName[currentRole.value] ?? currentRole.value)
const workbenchTier = computed<WorkbenchTier>(() => getWorkbenchTier(currentRole.value))

const userDisplayName = computed(() => {
  const u = mockUsers.find((x) => x.role === currentRole.value)
  return u?.displayName ?? '用户'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '上午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const weekdayText = computed(() => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return days[new Date().getDay()]
})

const roleSubtitle = computed(() => {
  const m: Record<Role, string> = {
    super_admin: '您拥有系统全部权限，可在此进行全局管理与审计',
    system_admin: '您可管理系统用户、角色、权限与基础配置',
    employee: '您可以提交工单、跟踪进度并处理个人消息',
    support: '您可以受理、分派与关闭工单，并查看服务报表',
    engineer: '您可以接单、处理工单并与团队协作',
  }
  return m[currentRole.value] ?? '欢迎使用工作台'
})

const roleSpotlightText = computed(() => {
  const m: Record<Role, string> = {
    super_admin: '角色专属区：用户管理、角色分配、权限审计、菜单与字典维护等入口可在左侧菜单或「常用入口」进入。',
    system_admin: '角色专属区：系统管理、用户/角色/权限/菜单/字典等模块已按权限展示，运营分析请进入「运营看板」。',
    employee: '角色专属区：侧重工单提交与跟踪，快捷操作已为您置顶常用路径。',
    support: '角色专属区：侧重工单处理与 SLA，列表与分派入口已置顶。',
    engineer: '角色专属区：侧重待办与执行，待处理与协作类入口已置顶。',
  }
  return m[currentRole.value] ?? ''
})

const menuEntries = computed(() => flattenMenuEntries(userStore.menuTree ?? []))
const quickActions = computed(() => quickActionsByRole[currentRole.value] ?? [])

async function load() {
  state.loading = true
  try {
    const res = await fetchDashboardOverview(range.value)
    state.data = res.data
  } catch {
    ElMessage.error('加载工作台概览失败')
  } finally {
    state.loading = false
  }
}

onMounted(load)
watch(range, load)

const kpiCards = computed(() => {
  const k = state.data?.kpi
  if (!k) {
    return [
      { key: 'todayCreated', title: '今日新建', value: '--', mom: 0, hint: '较上周期' },
      { key: 'todayResolved', title: '今日已解决', value: '--', mom: 0, hint: '较上周期' },
      { key: 'openTickets', title: '待处理', value: '--', mom: 0, hint: '较上周期' },
      { key: 'slaBreach', title: 'SLA 逾期', value: '--', mom: 0, hint: '较上周期' },
    ]
  }
  return [
    { key: 'todayCreated', title: '今日新建', value: k.todayCreated, mom: k.mom.todayCreated ?? 0, hint: '较上周期' },
    { key: 'todayResolved', title: '今日已解决', value: k.todayResolved, mom: k.mom.todayResolved ?? 0, hint: '较上周期' },
    { key: 'openTickets', title: '待处理', value: k.openTickets, mom: k.mom.openTickets ?? 0, hint: '较上周期' },
    { key: 'slaBreach', title: 'SLA 逾期', value: k.slaBreach, mom: k.mom.slaBreach ?? 0, hint: '较上周期' },
  ]
})

function formatPct(v: number) {
  const sign = v > 0 ? '+' : ''
  return `${sign}${(v * 100).toFixed(1)}%`
}

function go(path: string) {
  router.push(path)
}

type TodoItem = { title: string; time: string; tag: string }
const todoByRole: Record<Role, TodoItem[]> = {
  super_admin: [
    { title: '审计：本月权限变更待复核', time: '今天', tag: '审计' },
    { title: '系统：数据库备份策略确认', time: '昨天', tag: '系统' },
  ],
  system_admin: [
    { title: '用户：3 个账号待开通', time: '今天 10:00', tag: '用户' },
    { title: '角色：客服角色权限模板待发布', time: '昨天', tag: '角色' },
  ],
  employee: [
    { title: '工单：TCK-2026-000123 待补充说明', time: '今天 09:00', tag: '工单' },
    { title: '工单：评价邀请（1 条）', time: '昨天', tag: '工单' },
  ],
  support: [
    { title: '待分派工单：5 条待领取', time: '今天', tag: '分派' },
    { title: 'SLA：2 条即将逾期', time: '今天 11:00', tag: 'SLA' },
  ],
  engineer: [
    { title: '待处理：3 条工单待接单', time: '今天', tag: '处理' },
    { title: '协作：1 条工单待您确认', time: '昨天', tag: '协作' },
  ],
}

const todoItems = computed(() => todoByRole[currentRole.value] ?? [])

const noticeItems = computed(() => [
  { title: '【系统】夜间维护窗口：本周日 02:00-04:00', time: '01-15' },
  { title: '【安全】请定期更新登录密码并避免共享账号', time: '01-10' },
  { title: '【工单】工单编号规则将于下月升级，请关注公告', time: '01-08' },
])
</script>

<style scoped lang="scss">
.workbench {
  padding: 16px 20px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.workbench__hero {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.workbench__title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.workbench__subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.workbench__dot {
  margin: 0 6px;
}

.workbench__hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.workbench__section {
  margin-bottom: 20px;
}

.workbench__section-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;

  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  &--inline {
    justify-content: space-between;
    align-items: center;
  }
}

.workbench__hint {
  font-size: 12px;
  color: #909399;
}

.workbench__nav-card {
  cursor: pointer;
  margin-bottom: 12px;
  transition: background 0.15s ease;

  &:hover {
    background: #f5f9ff;
  }
}

.workbench__nav-card-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
}

.workbench__nav-icon {
  color: #409eff;
}

.workbench__nav-title {
  font-size: 14px;
  color: #303133;
}

.workbench__quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.workbench__spotlight {
  margin-bottom: 16px;
}

.workbench__main-row {
  margin-bottom: 8px;
}

.workbench__card {
  margin-bottom: 0;

  &--mt {
    margin-top: 16px;
  }
}

.workbench__card-title {
  font-weight: 600;
  font-size: 16px;
}

.workbench__todo-tag {
  margin-right: 8px;
}

.workbench__notice-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.workbench__notice-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  color: #606266;

  &:last-child {
    border-bottom: none;
  }
}

.workbench__notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #409eff;
  margin-top: 6px;
  flex-shrink: 0;
}

.workbench__notice-title {
  flex: 1;
}

.workbench__notice-time {
  color: #909399;
  font-size: 12px;
  flex-shrink: 0;
}

.workbench__kpi-row {
  margin-top: 8px;
}

.workbench__kpi-card {
  margin-bottom: 12px;
}

.kpi-title {
  color: #909399;
  font-size: 13px;
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  margin-top: 6px;
  color: #303133;
}

.kpi-sub {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}

.dot {
  margin: 0 6px;
}

.hint {
  color: #c0c4cc;
}
</style>
