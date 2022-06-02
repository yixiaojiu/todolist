<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus'
import ArrowRight from '@/components/icons/ArrowRight.vue'
import { editItem } from '@/api/api'
const props = defineProps<{
  state: boolean,
  content: string,
  startTime: string,
  finishTime: string
  _id: string,
  planTime: string
}>()
const emit = defineEmits<{
  (e: 'change', data: { _id: string }): void,
  (e: 'edit', data: { _id: string, content: string, planTime: string }): void
}>()



const beforeChange = () => {
  return ElMessageBox.confirm('确定完成任务了吗？', undefined, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  }).then(() => {
    emit('change', { _id: props._id })
    ElMessage.success('change success!')
    return Promise.resolve(true)
  }, () => {
    ElMessage.error('change failed!')
    return Promise.reject()
  })
}

// 编辑item
const handleEditClick = () => {
  emit('edit', { _id: props._id, content: props.content, planTime: props.planTime })
}
</script>

<template>
  <div class="list-itme-box">
    <div class="left">
      <div class="content">{{ content }}</div>
      <div class="time">
        <span class="start">{{ startTime }}</span>
        <ArrowRight v-if="finishTime" />
        <span v-if="finishTime" class="finsh-time">{{ finishTime }}</span>
        <ArrowRight v-if="planTime" />
        <span v-if="planTime" class="plan-time">{{ planTime }}</span>
      </div>
    </div>
    <div class="right">
      <el-button type="success" class="link-button" @click="handleEditClick" v-if="!finishTime" link>编辑</el-button>
      <el-switch v-model="state" :before-change="beforeChange" />
    </div>
  </div>
</template>

<style lang='less' scoped>
.list-itme-box {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
}

.content {
  margin-right: 20px;
  margin-bottom: 5px;
  font-size: 18px;
  white-space: normal;
  word-break: break-all;
}

.time {
  font-size: 12px;
  font-weight: 200;
  color: #626262;

  .start {
    margin-right: 5px;
    color: rgb(17, 232, 38);
  }

  .finsh-time {
    margin-left: 5px;
  }

  .plan-time {
    margin-left: 5px;
    color: red;
  }

}

.link-button {
  margin-right: 10px;
  margin-top: 3px;
}
</style>