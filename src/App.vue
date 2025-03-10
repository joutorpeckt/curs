<template>
  <div class="app">
    <div class="timers-wrapper">
      <TimerSection
        v-for="(timer, index) in timers"
        :key="index"
        :timer-id="index + 1"
        :is-hidden="timer.isHidden"
        :section-class="getSectionClass(index + 1)"
        :initial-name="'Таймер ' + (index + 1)"
        :initial-minutes="10"
        @timer-update="updateTimerProportions"
        @hide-timer="hideTimer"
        ref="timerSections"
      />
    </div>

    <div class="add-timers">
      <TotalMinutes :total-minutes="totalMinutes" />
      <ResetButton @reset="resetAllTimers" />
      <AddTimerButton @add="addTimer" />
    </div>

    <!-- Аудио элементы -->
    <audio id="warningSound" preload="auto">
      <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg">
    </audio>
    <audio id="finishSound" preload="auto">
      <source src="https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
import TimerSection from './components/TimerSection.vue'
import TotalMinutes from './components/TotalMinutes.vue'
import ResetButton from './components/ResetButton.vue'
import AddTimerButton from './components/AddTimerButton.vue'
import { timerAPI, userAPI } from '@/services/api'

export default {
  name: 'App',
  components: {
    TimerSection,
    TotalMinutes,
    ResetButton,
    AddTimerButton
  },
  data() {
    return {
      timers: [
        { isHidden: false },
        { isHidden: true },
        { isHidden: true },
        { isHidden: true },
        { isHidden: true }
      ],
      totalMinutes: 10
    }
  },
  methods: {
    getSectionClass(id) {
      return id === 1 ? 'left' : 
             id === 2 ? 'right' :
             id === 3 ? 'third' :
             id === 4 ? 'fourth' : 'fifth'
    },
    async addTimer() {
      const nextTimer = this.timers.find(timer => timer.isHidden)
      if (nextTimer) {
        nextTimer.isHidden = false
        this.$nextTick(() => {
          this.updateTimerProportions()
        })
        await this.syncAllTimers()
      }
    },
    async hideTimer(timerId) {
      const index = timerId - 1
      for (let i = this.timers.length - 1; i >= index; i--) {
        this.timers[i].isHidden = true
        if (this.$refs.timerSections[i]) {
          this.$refs.timerSections[i].resetTimer()
        }
      }
      this.updateTimerProportions()
      await this.syncAllTimers()
    },
    updateTimerProportions() {
      if (!this.$refs.timerSections) return

      const visibleTimers = this.$refs.timerSections.filter((_, index) => 
        !this.timers[index].isHidden
      )

      const totalTime = visibleTimers.reduce((sum, timer) => 
        sum + timer.minutes, 0
      )

      this.totalMinutes = totalTime

      visibleTimers.forEach(timer => {
        const flex = timer.minutes / totalTime
        timer.updateFlex(flex)
      })
    },
    async resetAllTimers() {
      this.timers.forEach((timer, index) => {
        if (index !== 0) {
          timer.isHidden = true
        }
      })
      this.$refs.timerSections.forEach(timer => {
        timer.resetTimer()
        timer.setMinutes(10)
      })
      this.updateTimerProportions()
      await this.syncAllTimers()
    },
    async syncAllTimers() {
      try {
        const timersData = this.timers.map((timer, index) => ({
          id: index + 1,
          isHidden: timer.isHidden
        }))
        await timerAPI.syncTimers(timersData)
      } catch (error) {
        console.error('Ошибка при синхронизации таймеров:', error)
      }
    },
    async saveUserSettings() {
      try {
        await userAPI.saveSettings({
          totalMinutes: this.totalMinutes,
          activeTimers: this.timers.filter(t => !t.isHidden).length
        })
      } catch (error) {
        console.error('Ошибка при сохранении настроек:', error)
      }
    }
  },
  async mounted() {
    try {
      const settings = await userAPI.getSettings()
      if (settings) {
        // Применяем сохраненные настройки
        this.totalMinutes = settings.totalMinutes
      }
    } catch (error) {
      console.error('Ошибка при загрузке настроек:', error)
    }
  },
  watch: {
    // Сохраняем настройки при изменении важных параметров
    totalMinutes: {
      handler: 'saveUserSettings',
      deep: true
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  height: 100vh;
  background: #f8f9fa;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.timers-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.add-timers {
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 3;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style> 