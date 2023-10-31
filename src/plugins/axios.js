import axios from 'axios'
const axiosIns = axios.create({
// You can add your headers here
// ================================
// baseURL: 'https://some-domain.com/api/',
// timeout: 1000,
// headers: {'X-Custom-Header': 'foobar'}

  url: "http://backend-rentings-env.eba-bdnqs3bn.me-south-1.elasticbeanstalk.com",
  headers: {
    'Authorization': sessionStorage.getItem("accessToken"),
  },

})


// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
  // Retrieve token from localStorage
  const token = sessionStorage.getItem('accessToken')

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {}

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = token ? `Bearer ${token}` : ''
  }

  // Return modified config
  return config
})

// ℹ️ Add response interceptor to handle 401 response
// axiosIns.interceptors.response.use(response => {
//   return response
// }, error => {
//   // Handle error
//   if (error.response.status === 401) {
//     // ℹ️ Logout user and redirect to login page
//     // Remove "userData" from localStorage
//     sessionStorage.removeItem('userData')

//     // Remove "accessToken" from localStorage
//     sessionStorage.removeItem('accessToken')
//     sessionStorage.removeItem('userAbilities')

//     // If 401 response returned from api
//     router.push('/login')
//   }
//   else {
//     return Promise.reject(error)
//   }
// })
export default axiosIns
