<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <div class="logo">
        <img src="../../assets/images/logo.svg" alt="Pub Logo" class="logo-image" />
        <h1>Pub Admin</h1>
      </div>
      <div class="user-menu">
        <button class="logout-button" @click="handleLogout">Logout</button>
      </div>
    </header>
    
    <div class="admin-layout">
      <aside class="sidebar">
        <nav class="nav-menu">
          <router-link to="/admin" exact class="nav-item">
            <i class="icon icon-dashboard"></i>
            Dashboard
          </router-link>
          <router-link to="/admin/drinks" class="nav-item">
            <i class="icon icon-drinks"></i>
            Drinks
          </router-link>
          <router-link to="/admin/games" class="nav-item">
            <i class="icon icon-games"></i>
            Games
          </router-link>
          <router-link to="/admin/visitors" class="nav-item">
            <i class="icon icon-visitors"></i>
            Visitors
          </router-link>
          <router-link to="/admin/media" class="nav-item">
            <i class="icon icon-media"></i>
            Media
          </router-link>
          <router-link to="/admin/themes" class="nav-item">
            <i class="icon icon-themes"></i>
            Themes
          </router-link>
        </nav>
      </aside>
      
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  // Clear authentication
  localStorage.removeItem('authenticated');
  localStorage.removeItem('authToken');
  
  // Redirect to login
  router.push('/auth/login');
};
</script>

<style lang="scss" scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  color: #333;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 64px;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .logo {
    display: flex;
    align-items: center;
    
    .logo-image {
      height: 40px;
      margin-right: 1rem;
    }
    
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
  }
  
  .logout-button {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: 1px solid white;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.admin-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background-color: #34495e;
  color: white;
  overflow-y: auto;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: #ecf0f1;
    text-decoration: none;
    font-size: 1rem;
    
    .icon {
      margin-right: 0.75rem;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-position: center;
      opacity: 0.8;
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    &.router-link-active {
      background-color: rgba(255, 255, 255, 0.1);
      color: #ff6b01; // Primary color
      font-weight: 500;
      
      .icon {
        opacity: 1;
      }
    }
  }
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

/* Icons placeholders - these would be replaced with actual SVG icons */
.icon-dashboard::before { content: "📊"; }
.icon-drinks::before { content: "🍺"; }
.icon-games::before { content: "🎲"; }
.icon-visitors::before { content: "👥"; }
.icon-media::before { content: "🖼️"; }
.icon-themes::before { content: "🎨"; }
</style>