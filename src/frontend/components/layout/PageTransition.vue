<template>
  <transition :name="transitionName" :mode="transitionMode" :duration="transitionDuration">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'PageTransition',
  props: {
    name: {
      type: String,
      default: 'fade',
    },
    mode: {
      type: String,
      default: 'out-in',
    },
    duration: {
      type: [Number, Object],
      default: 300,
    },
  },
  computed: {
    transitionName() {
      return `page-${this.name}`;
    },
    transitionMode() {
      return this.mode;
    },
    transitionDuration() {
      return this.duration;
    },
  },
};
</script>

<style lang="scss" scoped>
// Fade transition
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

// Slide transition
.page-slide-enter-active,
.page-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// Zoom transition
.page-zoom-enter-active,
.page-zoom-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.page-zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.page-zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

// Flip transition
.page-flip-enter-active,
.page-flip-leave-active {
  transition:
    transform 0.6s ease,
    opacity 0.6s ease;
  transform-style: preserve-3d;
}

.page-flip-enter-from {
  opacity: 0;
  transform: rotateY(-90deg);
}

.page-flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}
</style>
