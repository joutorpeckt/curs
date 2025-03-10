import axios from '@/plugins/axios'

export const timerAPI = {
  // Сохранение состояния таймера
  saveTimer(timerData) {
    return axios.post('/timers', timerData)
  },

  // Получение сохраненных таймеров
  getTimers() {
    return axios.get('/timers')
  },

  // Обновление таймера
  updateTimer(id, timerData) {
    return axios.put(`/timers/${id}`, timerData)
  },

  // Удаление таймера
  deleteTimer(id) {
    return axios.delete(`/timers/${id}`)
  },

  // Синхронизация всех таймеров
  syncTimers(timersData) {
    return axios.post('/timers/sync', timersData)
  }
}

export const userAPI = {
  // Сохранение настроек пользователя
  saveSettings(settings) {
    return axios.post('/settings', settings)
  },

  // Получение настроек пользователя
  getSettings() {
    return axios.get('/settings')
  }
} 