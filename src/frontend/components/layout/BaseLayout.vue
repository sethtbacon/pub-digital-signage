<template>
  <div class="base-layout" :class="{ 'admin-mode': isAdminMode }">
    <header class="header">
      <div class="header-left">
        <slot name="header-left">
          <img src="../../assets/images/logo.svg" alt="Pub Logo" class="logo" />
        </slot>
      </div>
      <div class="header-center">
        <slot name="header-center">
          <h1>{{ title }}</h1>
        </slot>
      </div>
      <div class="header-right">
        <slot name="header-right">
          <div class="time-display">{{ currentTime }} <span class="date-display">{{ currentDate }}</span></div>
        </slot>
      </div>
    </header>
    
    <main class="content">
      <slot />
    </main>
    
    <footer class="footer">
      <div class="footer-left">
        <slot name="footer-left"></slot>
      </div>
      <div class="footer-center">
        <slot name="footer-center">
          <div class="ticker-container" v-if="!isAdminMode && showTicker">
            <div class="ticker-content">
              <slot name="ticker-content">
                <span class="ticker-item">Welcome to The Orange Pig Pub</span>
                <span class="ticker-item">Today's Special: Orange Pig IPA - £4.50</span>
                <span class="ticker-item">Board Game Night: Thursdays at 7PM</span>
                <span class="ticker-item">Live Sports Shown Daily</span>
              </slot>
            </div>
          </div>
        </slot>
      </div>
      <div class="footer-right">
        <slot name="footer-right">
          <nav v-if="!isAdminMode" class="display-nav">
            <router-link to="/" class="nav-item">Home</router-link>
            <router-link to="/display/drinks" class="nav-item">Drinks</router-link>
            <router-link to="/display/games" class="nav-item">Games</router-link>
            <router-link to="/display/visitors" class="nav-item">Visitors</router-link>
            <router-link to="/display/events" class="nav-item">Events</router-link>
            <router-link to="/display/media" class="nav-item">Media</router-link>
          </nav>
        </slot>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from '../../store/modules/themeStore';

const props = defineProps({
  title: {
    type: String,
    default: 'Pub Digital Signage'
  },
  showTicker: {
    type: Boolean,
    default: true
  }
});

const route = useRoute();
const themeStore = useThemeStore();

// Determine if we're in admin mode based on route
const isAdminMode = computed(() => {
  return route.path.includes('/admin');
});

// Current time and date display
const currentTime = ref('');
const currentDate = ref('');
let timeInterval = null;

const updateTime = () => {
  const now = new Date();
  
  // Format time (24-hour)
  currentTime.value = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);
  
  // Format date (e.g., "25 Apr")
  currentDate.value = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(now);
};

onMounted(() => {
  // Initialize theme
  themeStore.initialize();
  
  // Set up clock
  updateTime();
  timeInterval = setInterval(updateTime, 60000); // Update every minute
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
});
</script>

<style lang="scss" scoped>
.base-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: var(--text-color);
  background-color: var(--background-color);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-medium);
  background-color: var(--primary-color);
  color: var(--text-color);
  height: 80px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &-left, &-right {
    width: 20%;
  }
  
  &-center {
    width: 60%;
    text-align: center;
    
    h1 {
      margin: 0;
      font-size: var(--font-size-large);
    }
  }
}

.logo {
  height: 60px;
  width: auto;
}

.time-display {
  font-size: var(--font-size-medium);
  font-weight: bold;
  text-align: right;
  
  .date-display {
    display: block;
    font-size: var(--font-size-small);
    font-weight: normal;
    opacity: 0.8;
  }
}

.content {
  flex: 1;
  padding: var(--spacing-large);
  overflow-y: auto;
  position: relative;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-medium);
  background-color: var(--secondary-color);
  height: 60px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  
  &-left, &-right {
    width: 30%;
  }
  
  &-center {
    width: 40%;
    text-align: center;
  }
}

.ticker-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  
  .ticker-content {
    display: inline-block;
    animation: ticker 30s linear infinite;
    
    .ticker-item {
      display: inline-block;
      padding: 0 var(--spacing-large);
      color: var(--text-color);
      
      &::after {
        content: "•";
        margin-left: var(--spacing-large);
        color: var(--primary-color);
      }
      
      &:last-child::after {
        content: "";
      }
    }
  }
}

@keyframes ticker {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.display-nav {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-medium);
  
  .nav-item {
    color: var(--text-color);
    text-decoration: none;
    font-size: var(--font-size-small);
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out;
    
    &.router-link-active {
      font-weight: bold;
      color: var(--accent-color);
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

/* Admin mode styling */
.admin-mode {
  .header {
    background-color: var(--secondary-color);
    height: 60px;
  }
  
  .footer {
    height: 50px;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .header {
    height: 70px;
    
    &-left, &-right {
      width: 25%;
    }
    
    &-center {
      width: 50%;
    }
  }
  
  .content {
    padding: var(--spacing-medium);
  }
  
  .logo {
    height: 50px;
  }
}

@media (max-width: 768px) {
  .header {
    height: 60px;
    
    &-left {
      width: 30%;
    }
    
    &-center {
      width: 40%;
    }
    
    &-right {
      width: 30%;
    }
    
    h1 {
      font-size: var(--font-size-medium);
    }
  }
  
  .logo {
    height: 40px;
  }
  
  .time-display {
    font-size: 1rem;
  }
  
  .footer {
    height: auto;
    flex-direction: column;
    padding: var(--spacing-small);
    
    &-left, &-center, &-right {
      width: 100%;
      margin: var(--spacing-small) 0;
    }
  }
  
  .display-nav {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>