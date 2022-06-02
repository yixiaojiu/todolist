<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue';
import type { ListItem, AddItemData, EditItemData } from '@/api/types'
import ListItemVue from '@/components/ListItem.vue';
import { getUndone, getFinish, getAll, addItem, changeState, editItem } from '@/api/api'
import { ElMessage } from 'element-plus';
import DialogVue from '@/components/Dialog.vue';
const listItem = ref<ListItem[]>([])
const pageSize = ref(5)
// 缓存当前的页数
let finishCurrentPage = 1
let allCurrentPage = 1

// 切换Tab逻辑
const currentPage = ref(1)
const paginationDisabled = ref(false)
const paginationCount = ref(0)
const undoneTab = ref(true)
const finishTab = ref(false)
const allTab = ref(false)
const changeNavBar = async (e: MouseEvent) => {
  const target = e.target as HTMLSpanElement
  undoneTab.value = false
  finishTab.value = false
  allTab.value = false
  currentPage.value = 1
  paginationCount.value = 0
  paginationDisabled.value = true
  if (target.dataset.tab === 'undone') {
    undoneTab.value = true
    const { data: res } = await getUndone()
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data
  }
  if (target.dataset.tab === 'finish') {

    finishTab.value = true
    const { data: res } = await getFinish({ limit: pageSize.value, page: finishCurrentPage })
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data.map((item) => {
      item.planTime = ''
      return item
    })
    paginationCount.value = res.count
    currentPage.value = finishCurrentPage
  }
  if (target.dataset.tab === 'all') {
    allTab.value = true
    const { data: res } = await getAll({ limit: pageSize.value, page: allCurrentPage })
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data.map(item => {
      if (item.finishTime) {
        item.planTime = ''
      }
      return item
    })
    paginationCount.value = res.count
    currentPage.value = allCurrentPage
  }
  paginationDisabled.value = false
}

// 分页切换逻辑
const handleCurrentChange = async (newPage: number) => {
  // 缓存当前页面
  if (finishTab.value) {
    finishCurrentPage = currentPage.value
  }
  if (allTab.value) {
    allCurrentPage = currentPage.value
  }
  paginationDisabled.value = true
  if (finishTab.value) {
    const { data: res } = await getFinish({ limit: pageSize.value, page: currentPage.value })
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data.map((item) => {
      item.planTime = ''
      return item
    })
  } else {
    const { data: res } = await getAll({ limit: pageSize.value, page: currentPage.value })
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data.map(item => {
      item.planTime = ''
      return item
    })
  }
  paginationDisabled.value = false
}


// 对话框逻辑
const AddDialogVisible = ref(false)
const choosePlanTime = ref<string | Date>('')
const inputAdd = ref('')
let planTime = 0
let winX = 0
let winY = 0
const windowScrollListener = () => {
  window.scrollTo(winX, winY)
}
const handleAddChange = (date: Date) => {
  planTime = date.getTime()
}
const handleAddItem = () => {
  AddDialogVisible.value = true
  winX = window.scrollX
  winY = window.scrollY
  window.addEventListener('scroll', windowScrollListener)
}
const handleAddClick = async () => {
  const data: AddItemData = {
    content: inputAdd.value
  }
  if (planTime) {
    data.planTimeStamp = planTime
    planTime = 0
  }

  const { data: res } = await addItem(data)
  if (!res.code) {
    ElMessage.error(res.msg)
  } else {

    const { data: result } = await getUndone()
    if (!result.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = result.data
    inputAdd.value = ''
    ElMessage.success(res.msg)
  }
  AddDialogVisible.value = false
}
const handleAddCancel = () => {
  AddDialogVisible.value = false
}
const handleAddDiaogClose = () => {
  window.removeEventListener('scroll', windowScrollListener)
}

// 修改state逻辑
const handleChangeState = async (data: { _id: string }) => {
  const { data: result } = await changeState({ _id: data._id })
  if (!result.code) {
    return ElMessage.error(result.msg)
  }
  if (undoneTab.value) {
    const { data: res } = await getUndone()
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data
  }
  if (finishTab.value) {
    const { data: res } = await getFinish({ limit: pageSize.value, page: currentPage.value })
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data.map((item) => {
      item.planTime = ''
      return item
    })
  }
  if (allTab.value) {
    const { data: res } = await getAll({ limit: pageSize.value, page: currentPage.value })
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data.map(item => {
      if (item.finishTime) {
        item.planTime = ''
      }
      return item
    })
  }
}

// 编辑对话框
const EditDialogVisible = ref(false)
const editInput = ref('')
const editPlanTime = ref('')
let editPlanTimeStamp = 0
let _id: string = ''
// 编辑
const handleEdit = (data: { _id: string, content: string, planTime: string }) => {
  _id = data._id
  editInput.value = data.content
  editPlanTime.value = data.planTime
  EditDialogVisible.value = true
  winX = window.scrollX
  winY = window.scrollY
  window.addEventListener('scroll', windowScrollListener)
}
const handleEditClick = async () => {
  const data: EditItemData = {
    _id: _id,
    content: editInput.value
  }
  if (editPlanTimeStamp) {
    data.planTimeStamp = editPlanTimeStamp
    editPlanTimeStamp = 0
  }
  const { data: res } = await editItem(data)
  if (!res.code) {
    return ElMessage.error(res.msg)
  }
  ElMessage.success('修改成功')
  if (undoneTab.value) {
    const { data: res } = await getUndone()
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data
  }
  if (allTab.value) {
    const { data: res } = await getAll({ limit: pageSize.value, page: currentPage.value })
    if (!res.code) {
      return ElMessage.error('获取数据失败')
    }
    listItem.value = res.data.map(item => {
      if (item.finishTime) {
        item.planTime = ''
      }
      return item
    })
  }
  EditDialogVisible.value = false
}
const handleEditChange = (date: Date) => {
  editPlanTimeStamp = date.getTime()
}

onMounted(async () => {
  const { data: res } = await getUndone()
  if (!res.code) {
    return ElMessage.error('获取数据失败')
  }
  listItem.value = res.data

})
</script>

<template>
  <main>
    <div class="box container">
      <h1>ToDoList</h1>
      <div class="input-add">
        <input type="text" name="todo" v-model="inputAdd">
        <button @click="handleAddItem"><i class="plus"></i></button>
      </div>
      <div class="filters" @click="changeNavBar">
        <span class="filter" :class="undoneTab ? 'active' : ''" data-tab="undone">未完成</span>
        <span class="filter" :class="finishTab ? 'active' : ''" data-tab="finish">已完成</span>
        <span class="filter" :class="allTab ? 'active' : ''" data-tab="all">全部</span>
      </div>
      <ListItemVue v-for="item in listItem" :key="item._id" :state="item.state" :content="item.content"
        :start-time="item.startTime" :finish-time="item.finishTime" :_id="item._id" :plan-time="item.planTime"
        @change="handleChangeState" @edit="handleEdit" />
      <el-pagination layout="prev, pager, next, jumper" v-if="!undoneTab" :total="paginationCount" :pager-count="5"
        :hide-on-single-page="true" v-model:current-page="currentPage" :disabled="paginationDisabled"
        v-model:page-size="pageSize" @current-change="handleCurrentChange" />
    </div>
    <DialogVue v-model:visible="AddDialogVisible" @close="handleAddDiaogClose">
      <input type="text" v-model="inputAdd" class="input-content">
      <div class="date-picker">
        <el-date-picker v-model="choosePlanTime" size="large" type="date" class="date-picker" placeholder="Pick a day"
          @change="handleAddChange" />
      </div>
      <template #footer>
        <div class="footer">
          <el-button @click="handleAddCancel">取消</el-button>
          <el-button type="primary" @click="handleAddClick">确定</el-button>
        </div>
      </template>
    </DialogVue>
    <DialogVue v-model:visible="EditDialogVisible" @close="handleAddDiaogClose">
      <input type="text" v-model="editInput" class="input-content">
      <div class="date-picker">
        <el-date-picker v-model="editPlanTime" size="large" type="date" class="date-picker" placeholder="Pick a day"
          @change="handleEditChange" />
      </div>
      <template #footer>
        <div class="footer">
          <el-button @click="EditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditClick">确定</el-button>
        </div>
      </template>
    </DialogVue>
  </main>

</template>

<style lang='less' scoped>
main {
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(203, 210, 240);
}

.box {
  max-width: 550px;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);
  border-radius: 24px;
  padding: 48px 28px;
  background-color: rgb(245, 246, 252);
}

h1 {
  text-align: center;
  margin: 24px 0;
  font-size: 30px;
  color: #414873;
}

.input-add {
  position: relative;
  display: flex;
  align-items: center;
}

.input-add input {
  padding: 16px 52px 16px 18px;
  border-radius: 48px;
  border: none;
  outline: none;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  font-size: 20px;
  color: #626262;
}

.input-add button {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(#c0a5f3, #7f95f7);
  border: none;
  outline: none;
  color: white;
  position: absolute;
  right: 0px;
  cursor: pointer;
}

.input-add .plus {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(#fff, #fff), linear-gradient(#fff, #fff);
  background-size: 50% 2px, 2px 50%;
  background-position: center;
  background-repeat: no-repeat;
}

.filters {
  display: flex;
  margin: 24px 2px;
  color: #c0c2ce;
  font-size: 14px;

  .filter {
    margin-right: 14px;
    transition: 0.8s;
    cursor: pointer;

    &.active {
      color: #6b729c;
      transform: scale(1.2);
    }
  }
}

.el-pagination {
  justify-content: center;
}

.input-content {
  padding: 16px 52px 16px 18px;
  border-radius: 48px;
  border: none;
  outline: none;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  font-size: 20px;
  color: #626262;
}

.footer {
  margin-top: 20px;
  display: flex;
  padding-right: 10px;
  justify-content: flex-end;
}

.date-picker {
  padding-top: 20px;
  padding-left: 10px;
}
</style>