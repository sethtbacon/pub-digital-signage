<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-logo">
        <img src="../../assets/images/logo.svg" alt="Pub Logo" />
        <h1>Pub Digital Signage</h1>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <h2>Admin Login</h2>
        
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Enter your username"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button type="submit" :disabled="loading" class="login-button">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="login-footer">
        <router-link to="/" class="back-link">Back to pub displays</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../store/modules/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Use the auth store to handle login
    await authStore.login(username.value, password.value);
    
    // Redirect to the admin dashboard or to the redirected path if available
    const redirectPath = route.query.redirect || '/admin';
    router.push(redirectPath);
  } catch (err) {
    error.value = err.message || 'Failed to login';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #111;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../../assets/images/pub-background.jpg');
  background-size: cover;
  background-position: center;
}

.login-card {
  width: 400px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  
  img {
    height: 80px;
    width: auto;
    margin-bottom: 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
    color: #ff6b01; // Primary color
    margin: 0;
  }
}

.login-form {
  h2 {
    color: #fff;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #ecf0f1;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border-radius: 4px;
      border: 1px solid #2c3e50;
      background-color: #1a1a1a;
      color: #fff;
      font-size: 1rem;
      
      &::placeholder {
        color: #7f8c8d;
      }
      
      &:focus {
        outline: none;
        border-color: #ff6b01;
      }
    }
  }
  
  .error-message {
    background-color: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #ff6b01;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #d35400;
    }
    
    &:disabled {
      background-color: #7f8c8d;
      cursor: not-allowed;
    }
  }
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
  
  .back-link {
    color: #3498db;
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>