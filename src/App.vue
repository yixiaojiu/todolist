<script setup lang='ts'>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang='less'>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Helvetica, "PingFang SC", "Microsoft Yahei", sans-serif;
}

input {
  border: none;
  outline: none;
}

body {
  min-height: 100vh;
}

button {
  border: none;
  cursor: pointer;
}

.container {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

@media screen and (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media screen and (min-width: 678px) {
  .container {
    max-width: 720px;
  }
}

@media screen and (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media screen and (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

@media screen and (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}
</style>