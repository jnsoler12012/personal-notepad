import { defineStore, acceptHMRUpdate } from 'pinia'
import actions from './actions.js'
import getters from './getters.js'

const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: '',
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    ...getters,
  },
  actions: {
    ...actions,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

export default useAuthStore
