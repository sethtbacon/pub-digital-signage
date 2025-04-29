import { defineStore } from 'pinia';
import { drinksApi } from '../../services/api/drinksApi';

export const useDrinksStore = defineStore('drinks', {
  state: () => ({
    drinks: [],
    featuredDrinks: [],
    currentDrink: null,
    loading: false,
    error: null,
  }),

  getters: {
    getDrinkById: state => id => {
      return state.drinks.find(drink => drink.id === id);
    },

    drinksByCategory: state => {
      const categories = {};
      state.drinks.forEach(drink => {
        if (!categories[drink.category]) {
          categories[drink.category] = [];
        }
        categories[drink.category].push(drink);
      });
      return categories;
    },
  },

  actions: {
    async fetchAllDrinks() {
      this.loading = true;
      this.error = null;
      try {
        const drinksFromApi = await drinksApi.getAllDrinks();
        // Map API response fields to component properties
        this.drinks = drinksFromApi.map(drink => ({
          id: drink.drink_id,
          name: drink.name,
          category: drink.category,
          description: drink.description,
          imageUrl: drink.image_path,
          featured: drink.is_featured === 1,
          abv: drink.abv,
          price: drink.price,
          new: drink.new === 1,
          special: drink.special === 1
        }));
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
        const featuredFromApi = await drinksApi.getFeaturedDrinks();
        // Map API response fields to component properties
        this.featuredDrinks = featuredFromApi.map(drink => ({
          id: drink.drink_id,
          name: drink.name,
          category: drink.category,
          description: drink.description,
          imageUrl: drink.image_path,
          featured: true,
          abv: drink.abv,
          price: drink.price,
          new: drink.new === 1,
          special: drink.special === 1
        }));
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
        // Map API response fields to component properties
        this.currentDrink = {
          id: drink.drink_id,
          name: drink.name,
          category: drink.category,
          description: drink.description,
          imageUrl: drink.image_path,
          featured: drink.is_featured === 1,
          abv: drink.abv,
          price: drink.price,
          new: drink.new === 1,
          special: drink.special === 1
        };
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
        const result = await drinksApi.createDrink(drinkData);
        
        // Create new drink object with correct property mappings
        const newDrink = {
          id: result.drinkId,
          name: drinkData.name,
          category: drinkData.category,
          description: drinkData.description,
          imageUrl: drinkData.image_path,
          featured: drinkData.is_featured === 1,
          abv: drinkData.abv,
          price: drinkData.price
        };
        
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
        const result = await drinksApi.updateDrink(id, drinkData);
        
        // Create updated drink object with correct property mappings
        const updatedDrink = {
          id: id,
          name: drinkData.name,
          category: drinkData.category,
          description: drinkData.description,
          imageUrl: drinkData.image_path,
          featured: drinkData.is_featured === 1,
          abv: drinkData.abv,
          price: drinkData.price
        };
        
        // Update in the array
        const index = this.drinks.findIndex(drink => drink.id === id);
        if (index !== -1) {
          this.drinks[index] = updatedDrink;
        }
        
        // Update current drink if it's the one being edited
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
    },
  },
});
