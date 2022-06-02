import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    uid: ''
  }),
  getters: {},
  actions: {}
})
