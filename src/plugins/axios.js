import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Перехватчик запросов
axiosInstance.interceptors.request.use(
  config => {
    // Здесь можно добавить токен авторизации или другие заголовки
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Перехватчик ответов
axiosInstance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // Обработка ошибок (например, истек токен)
    if (error.response?.status === 401) {
      // Обработка неавторизованного доступа
    }
    return Promise.reject(error)
  }
)

export default axiosInstance 