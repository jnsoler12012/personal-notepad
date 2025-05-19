export default {
  getCurrentUser({ state }) {
    console.log(state)

    return !!state.token
  },
}
