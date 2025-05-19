import { defineStore, acceptHMRUpdate } from 'pinia'
import actions from './actions.js'
import getters from './getters.js'

const useNoteStore = defineStore('noteStore', {
  state: () => ({
    notes: [],
    currentNote: null
  }),
  getters: {
    ...getters,
  },
  actions: {
    ...actions,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNoteStore, import.meta.hot))
}

export default useNoteStore
