<script lang='ts' setup>
  import {
    reactive,
    onMounted,
    watch,
    toRefs
  } from 'vue'
  import {
    queryTickets
  } from '@/api/tickets'
  import type {
    queryForm
  } from '@/types/tickets'
  import {
    useCancelableRequest
  } from '@/composables/useCancelableRequest.ts'
  import {
    useDebouncedCancelableRequest
  } from '@/composables/useDebouncedCancelableRequest.ts'

  import {usePagePermission} from '@/composables/usePagePermission.ts'

  const immediate = useCancelableRequest(queryTickets);
  const debounced = useDebouncedCancelableRequest(queryTickets, 300);
  const { can } = usePagePermission();


  const formInline = reactive < queryForm > ({
    orderNumber: '',
    status: '',
    createDate: new Date(),
  })
  const pageState = reactive({
    page: 1,
    pageSize: 2
  })
  const queryState = reactive({
    ...toRefs(formInline),
    ...toRefs(pageState)
  })
  const selectedCount = ref(0)
  const onSubmit = () => {
    console.log('submit!')
    fetchImmediate(true)
  }
  const tableData = reactive({
    total: 0,
    list: []
  })

  const paginationChange = (page:any) => {
    pageState.page = page
    fetchImmediate(false)
  }

  const applyResult = (res:any) => {
    console.log('data', res)
    tableData.total = res.data.total
    tableData.list = res.data.list
  }
  async function fetchImmediate(resetPage = false) {
    console.log('fetchImmediate')
    if (resetPage) queryState.page = 1;
    debounced.cancel();

    const res = await immediate.run(queryState);
    applyResult(res);
  }

  watch(() => {
    formInline.orderNumber
  }, async () => {
    immediate.cancel()
    queryState.page = 1;
    // 关键：立即请求正在进行时，可选择 cancel immediate 或不 cancel；通常不必
    const res = await debounced.run(queryState);
    applyResult(res);
  }, {
    deep: true
  })

  watch(() => {
    pageState.page, formInline.status, formInline.createDate
  }, () => {
    fetchImmediate(true)

  })

  onMounted(() => {
    fetchImmediate(true)
  })

  const handleClick=()=>{

  }

</script>

<template>
  <div class='list-container'>
    <div class='top-header'>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="OrderNumber">
          <el-input v-model="formInline.orderNumber" placeholder="Order number.." clearable />
        </el-form-item>
        <el-form-item label="Activity zone">
          <el-select v-model="formInline.status" placeholder="Order status" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="CreatedAt">
          <el-date-picker v-model="formInline.createDate" type="date" placeholder="Pick a date"
            clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">search</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" v-if='can("ticket:create")'>Create ticket</el-button>
      <el-button type="primary" size="small" v-if='can("ticket:export")'>Export</el-button>
      <!-- <el-button type="primary" :icon="Edit" class='create-btn'>Create ticket</el-button>
      <el-tag type="primary" class='tag-count'>已选{{selectedCount}}项</el-tag>
      <el-button type="primary" :icon="Edit">Bulk assign</el-button> -->

    </div>
    <div class='table'>
      <el-table :data="tableData.list" stripe style="width: 100%">
        <el-table-column fixed prop="no" label="ticketNumber" width="180" />
        <el-table-column prop="title" label="title" width="300" />
        <el-table-column prop="status" label="status" />
        <el-table-column prop="assigneeName" label="assignee" width='120'/>
        <el-table-column prop="createdAt" label="createdAt" width="300" />
        <el-table-column fixed="right" label="operations" min-width="160">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick">
          Detail
        </el-button>
        <el-button link type="primary" size="small">Edit</el-button>
        <el-button link type="primary" size="small" v-if='can("ticket:assign")'>Assign</el-button>
      </template>
    </el-table-column>
      </el-table>
    </div>
    <div class='footer'>
      <el-pagination size="small" background layout="prev, pager, next" :total="tableData.total"
        :page-size='2' class="mt-4" @change='paginationChange' @prev-click='paginationChange'
        @next-click='paginationChange' />
    </div>
  </div>
</template>

<style>
  .demo-form-inline .el-input {
    --el-input-width: 200px;
  }

  .demo-form-inline .el-select {
    --el-select-width: 200px;
  }

  .list-container {
    display: flex;
    flex-direction: column;
    /* height: 100vh; */

    .top-header {
      height: 120px;
      padding: 5px;

      .create-btn {
        margin-right: 20px
      }

      .tag-count {
        margin-right: 2px
      }
    }

    .table {
      .el-table {
        flex: 1;
        height: 280px
      }
    }

    .footer {
      display: flex;
      height: 50px;
    }
  }

</style>
