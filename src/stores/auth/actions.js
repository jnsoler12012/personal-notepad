import axios from 'axios'

export default {
  async loginAction({ email, password }) {
    return await axios
      .post('https://stg.prolibu.com/v2/auth/signin', {
        email,
        password,
      })
      .then((response) => {
        console.log(response)

        localStorage.setItem('token', response.data.apiKey)
        this.token = response.data.apiKey
        this.user = response
        return true
      })
      .catch((error) => {
        if (error) {
          console.error('Login failed:', error)
          return `${error.code} - ${error.message}`
        }
      })
  },
  checkAuth() {
    // Set the token from localStorage if not already set
    if (!this.token) {
      const storedToken = localStorage.getItem('token')
      console.log('Stored Token:', storedToken)

      if (storedToken) {
        this.token = storedToken
      }
      return this.token
    }
  },

  setToken(token) {
    this.token = token
    localStorage.setItem('token', token)
    console.log('Token set:', token)
  },

  logout() {
    console.log('lgogoog')

    this.token = null
    this.user = null
    localStorage.removeItem('token')
    window.location.reload()
    console.log('Logged out, token removed')
  },
}
