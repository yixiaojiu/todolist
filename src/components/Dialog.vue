<script setup lang='ts'>
const props = defineProps<{
  visible: boolean
}>()
const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void,
  (e: 'close'): void
}>()

const handleClick = (e: MouseEvent) => {

  const target = e.target as HTMLDivElement
  if (target.id === 'overlay') {
    emit('update:visible', false)
  }
  emit('close')
}
</script>

<template>
  <div class="overlay" v-if="visible" @click.stop="handleClick" id="overlay">
    <div class="box container">
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang='less' scoped>
.overlay {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 500;
  top: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;


  .box {
    border-radius: 10px;
    max-width: 550px;
    padding: 50px 30px 20px;
    background-color: #fff;
  }
}
</style>