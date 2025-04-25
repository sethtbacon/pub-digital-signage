import { defineStore } from 'pinia';
import { drinksApi } from '../../services/api/drinksApi';

export const useDrinksStore = defineStore('drinks', {
  state: () => ({
    drinks: [],
    featuredDrinks: [],
    currentDrink: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getDrinkById: (state) => (id) => {
      return state.drinks.find(drink => drink.id === id);
    },
    
    drinksByCategory: (state) => {
      const categories = {};
      state.drinks.forEach(drink => {
        if (!categories[drink.category]) {
          categories[drink.category] = [];
        }
        categories[drink.category].push(drink);
      });
      return categories;
    }
  },
  
  actions: {
    async fetchAllDrinks() {
      this.loading = true;
      this.error = null;
      try {
        const drinks = await drinksApi.getAllDrinks();
        this.drinks = drinks;
      } catch (error) {
        this.error = error.message || 'Failed to fetch drinks';
        console.error('Error fetching drinks:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchFeaturedDrinks() {
      this.loading = true;
      this.error = null;
      try {
        const featuredDrinks = await drinksApi.getFeaturedDrinks();
        this.featuredDrinks = featuredDrinks;
      } catch (error) {
        this.error = error.message || 'Failed to fetch featured drinks';
        console.error('Error fetching featured drinks:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchDrinkById(id) {
      this.loading = true;
      this.error = null;
      try {
        const drink = await drinksApi.getDrink(id);
        this.currentDrink = drink;
      } catch (error) {
        this.error = error.message || `Failed to fetch drink with ID: ${id}`;
        console.error(`Error fetching drink ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    async createDrink(drinkData) {
      this.loading = true;
      this.error = null;
      try {
        const newDrink = await drinksApi.createDrink(drinkData);
        this.drinks.push(newDrink);
        return newDrink;
      } catch (error) {
        this.error = error.message || 'Failed to create drink';
        console.error('Error creating drink:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateDrink(id, drinkData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedDrink = await drinksApi.updateDrink(id, drinkData);
        const index = this.drinks.findIndex(drink => drink.id === id);
        if (index !== -1) {
          this.drinks[index] = updatedDrink;
        }
        if (this.currentDrink && this.currentDrink.id === id) {
          this.currentDrink = updatedDrink;
        }
        return updatedDrink;
      } catch (error) {
        this.error = error.message || `Failed to update drink with ID: ${id}`;
        console.error(`Error updating drink ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteDrink(id) {
      this.loading = true;
      this.error = null;
      try {
        await drinksApi.deleteDrink(id);
        this.drinks = this.drinks.filter(drink => drink.id !== id);
        if (this.currentDrink && this.currentDrink.id === id) {
          this.currentDrink = null;
        }
      } catch (error) {
        this.error = error.message || `Failed to delete drink with ID: ${id}`;
        console.error(`Error deleting drink ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});