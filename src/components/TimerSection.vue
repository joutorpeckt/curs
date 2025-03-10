<template>
  <div :class="['timer-section', sectionClass, { hidden: isHidden }]">
    <div class="progress-container">
      <div class="progress-bar" :style="{ transform: `scaleY(${progress})` }"></div>
    </div>

    <div class="background-info" :class="{ visible: isRunning }">
      <div class="user-name">{{ name }}</div>
      <div class="background-timer">{{ displayTime }}</div>
      <button class="background-pause" @click="toggleTimer">Пауза</button>
    </div>

    <div class="timer-container" :class="{ hidden: isRunning }">
      <div class="input-container">
        <div class="input-group">
          <input type="text" v-model="name" :disabled="isRunning">
        </div>
        <div class="input-group range-group">
          <input 
            type="range" 
            v-model.number="minutes" 
            min="1" 
            max="60"
            :disabled="isRunning"
            @input="handleMinutesChange"
          >
          <span>{{ minutes }}</span>
        </div>
      </div>
      <div class="display">{{ displayTime }}</div>
      <button @click="toggleTimer">{{ isRunning ? 'Пауза' : 'Старт' }}</button>
      <button class="reset" @click="resetTimer">Сброс</button>
      <button 
        v-if="timerId > 1" 
        class="hide-timer-button"
        @click="$emit('hide-timer', timerId)"
      ></button>
    </div>
  </div>
</template>

<script>
import { timerAPI } from '@/services/api'

export default {
  name: 'TimerSection',
  props: {
    timerId: {
      type: Number,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    sectionClass: {
      type: String,
      required: true
    },
    initialName: {
      type: String,
      required: true
    },
    initialMinutes: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      name: this.initialName,
      minutes: this.initialMinutes,
      timeLeft: this.initialMinutes * 60,
      isRunning: false,
      timerId: null,
      warningPlayed: false,
      progress: 1
    }
  },
  computed: {
    displayTime() {
      const minutes = Math.floor(this.timeLeft / 60)
      const seconds = this.timeLeft % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  },
  methods: {
    updateFlex(flex) {
      this.$el.style.flex = flex
    },
    handleMinutesChange() {
      this.timeLeft = this.minutes * 60
      this.progress = 1
      this.$emit('timer-update')
    },
    toggleTimer() {
      if (!this.isRunning) {
        if (!this.name.trim()) {
          alert('Пожалуйста, введите ваше имя!')
          return
        }
        this.startTimer()
      } else {
        this.pauseTimer()
      }
    },
    async startTimer() {
      this.isRunning = true
      this.warningPlayed = false
      this.updateTabTitle()

      this.timerId = setInterval(() => {
        this.timeLeft--
        this.progress = this.timeLeft / (this.minutes * 60)

        if (this.timeLeft === 300 && !this.warningPlayed) {
          this.playWarningSound()
          this.warningPlayed = true
        }

        if (this.timeLeft === 0) {
          this.stopTimer()
          this.playFinishSound()
        }

        this.updateTabTitle()
      }, 1000)

      await this.saveTimerState()
    },
    async pauseTimer() {
      clearInterval(this.timerId)
      this.timerId = null
      this.isRunning = false
      document.title = 'Лимитон'

      await this.saveTimerState()
    },
    stopTimer() {
      this.pauseTimer()
      this.resetTimer()
    },
    async resetTimer() {
      this.pauseTimer()
      this.timeLeft = this.minutes * 60
      this.progress = 1
      this.warningPlayed = false
      this.$emit('timer-update')

      await this.saveTimerState()
    },
    setMinutes(value) {
      this.minutes = value
      this.timeLeft = value * 60
      this.progress = 1
    },
    updateTabTitle() {
      if (this.isRunning) {
        document.title = `${this.name} - ${this.displayTime} | Лимитон`
      }
    },
    playWarningSound() {
      const warningSound = document.getElementById('warningSound')
      warningSound?.play()
    },
    playFinishSound() {
      const finishSound = document.getElementById('finishSound')
      finishSound?.play()
    },
    async saveTimerState() {
      try {
        await timerAPI.saveTimer({
          id: this.timerId,
          name: this.name,
          minutes: this.minutes,
          timeLeft: this.timeLeft,
          isRunning: this.isRunning
        })
      } catch (error) {
        console.error('Ошибка при сохранении таймера:', error)
      }
    },
    async loadTimerState() {
      try {
        const timerData = await timerAPI.getTimers()
        const myTimer = timerData.find(timer => timer.id === this.timerId)
        if (myTimer) {
          this.name = myTimer.name
          this.minutes = myTimer.minutes
          this.timeLeft = myTimer.timeLeft
          if (myTimer.isRunning) {
            this.startTimer()
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке таймера:', error)
      }
    }
  },
  async mounted() {
    await this.loadTimerState()
  }
}
</script>

<style scoped>
.timer-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: flex 0.3s ease-in-out;
  flex: 1;
}

/* Добавьте остальные стили из оригинального CSS */
</style> 