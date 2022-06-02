<script setup lang='ts'>
import { ref, reactive } from 'vue';
import IconEye from '@/components/icons/IconEye.vue'
import IconEyeSlash from '@/components/icons/IconEyeSlash.vue'
import { ElMessage } from 'element-plus'
import { login } from '@/api/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const formValue = reactive({
  username: 'yixiaojiu',
  password: '123456'
})
const controlImg = ref(true)
const eyeShowing = ref(true)
const passwordType = ref(true)

const toggleEye = () => {
  controlImg.value = !controlImg.value
  eyeShowing.value = !eyeShowing.value
  passwordType.value = !passwordType.value
}

const handleSubmit = async () => {
  if (!formValue.password || !formValue.username) {
    return ElMessage.error('账号或密码不能为空')
  }
  const { data: res } = await login({
    username: formValue.username,
    password: formValue.password
  })

  if (res.code === 0) {
    return ElMessage.error('账号或密码错误')
  }
  localStorage.setItem('token', res.data.token)
  router.replace('/')
  ElMessage.success('登录成功')
}
</script>

<template>
  <div class="box">
    <div class="container login-form">
      <h1><img src="/favicon.png" alt=""></h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-box">
          <div class="input-item username">
            <label for="username">账号</label>
            <input type="text" id="username" v-model="formValue.username">
          </div>
          <div class="input-item password">
            <label for="password">密码</label>
            <input :type="passwordType ? 'password' : 'text'" id="password" v-model="formValue.password">
            <span class="icon-eye" @click="toggleEye">
              <IconEyeSlash v-if="eyeShowing" />
              <IconEye v-else />
            </span>
          </div>
        </div>
        <button type="submit">登录</button>
      </form>
      <img src="/biyanxiaoniao.png" v-if="controlImg" class="nanxiaoniao" alt="biyanxiaoniao">
      <img src="/xiaoniao.png" alt="xiaoniao" class="nanxiaoniao" v-else>
    </div>
  </div>
</template>

<style lang='less' scoped>
.box {
  width: 100%;
  background-color: #F7F7F7;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  overflow: hidden;
  background-color: #fff;
  max-width: 600px;
  border-radius: 20px;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);

  h1 {
    text-align: center;
    margin-bottom: 10px;
    margin-top: 20px;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }

  form {
    margin-left: auto;
    margin-right: auto;
    max-width: 300px;

    .input-box {
      border: 2px solid #409EFF;
      border-radius: 10px;

      .username {
        border-bottom: 2px solid #409EFF;
      }

      .input-item {
        padding: 15px 20px;

        label {
          font-weight: 500;
        }

        input {
          margin-left: 10px;
          font-size: 16px;
        }
      }
    }

    button {
      margin-top: 10px;
      background-color: #79BBFF;
      color: white;
      width: 100%;
      border-radius: 10px;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
    }

    button:hover {
      background-color: var(--el-color-primary);
    }

    button:active {
      background-color: #79BBFF;
    }

  }

  .nanxiaoniao {
    display: block;
    margin-top: 30px;
    height: 100px;
  }
}

.password {
  position: relative;

  .icon-eye {
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
}
</style>