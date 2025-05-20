import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import useAuthStore from 'src/stores/auth'
import { useRouter } from 'vue-router'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://stg.prolibu.com/v2/note' })
const authStore = useAuthStore()

// Set up the interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage

    const token = authStore.token

     (token, '23123132123', config, authStore.token)

    // Add the Bearer token to the headers if it exists and it's not a login request
    if (token && !config.url.includes('/login')) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle token expiration globally
api.interceptors.response.use(
  (response) => {
    console.log(response)

    return response
  },
  (error) => {
    const router = useRouter()

    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login
      authStore.logout()
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
