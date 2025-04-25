import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import DrinkDisplay from '../../../src/frontend/views/display/DrinkDisplay.vue';
import { useDrinksStore } from '../../../src/frontend/store/modules/drinksStore';

// Mock the BaseLayout component
vi.mock('../../../src/frontend/components/layout/BaseLayout.vue', () => ({
  default: {
    name: 'BaseLayout',
    template: '<div class="mock-base-layout"><slot /></div>',
    props: ['title']
  }
}));

describe('DrinkDisplay.vue', () => {
  let wrapper;
  let drinksStore;
  
  const createComponent = (initialState = {}, storeOptions = {}) => {
    wrapper = mount(DrinkDisplay, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState,
            ...storeOptions
          })
        ]
      }
    });
    
    drinksStore = useDrinksStore();
  };

  beforeEach(() => {
    // Create the component with an empty initial state
    createComponent({
      drinks: {
        drinks: [],
        featuredDrinks: [],
        loading: false,
        error: null
      }
    });
  });

  it('initializes with the correct state', () => {
    // Check if the component has properly initialized
    expect(wrapper.vm.selectedCategory).toBe('All');
    expect(wrapper.vm.filteredDrinks).toEqual([]);
  });

  it('fetches drinks on mount', async () => {
    // Check if the fetch methods were called
    expect(drinksStore.fetchAllDrinks).toHaveBeenCalled();
    expect(drinksStore.fetchFeaturedDrinks).toHaveBeenCalled();
  });

  it('shows loading state when drinks are loading', async () => {
    // Update the store loading state
    drinksStore.loading = true;
    await wrapper.vm.$nextTick();
    
    // Check if loading message is shown
    expect(wrapper.find('.loading-state').exists()).toBe(true);
    expect(wrapper.find('.loading-state').text()).toContain('Loading drinks');
  });

  it('shows error message when there is an error', async () => {
    // Update the store error state
    drinksStore.error = 'Failed to load drinks';
    await wrapper.vm.$nextTick();
    
    // Check if error message is shown
    expect(wrapper.find('.error-state').exists()).toBe(true);
    expect(wrapper.find('.error-state').text()).toBe('Failed to load drinks');
  });

  it('displays drinks correctly when loaded', async () => {
    // Mock drinks data
    const mockDrinks = [
      { id: 1, name: 'Beer 1', category: 'Beer', description: 'A beer', featured: false },
      { id: 2, name: 'Wine 1', category: 'Wine', description: 'A wine', featured: true }
    ];
    
    // Update store with mock data
    drinksStore.drinks = mockDrinks;
    await wrapper.vm.$nextTick();
    
    // Check if drinks are displayed
    const drinkCards = wrapper.findAll('.drink-card');
    expect(drinkCards.length).toBe(2);
    
    // Verify content of first drink card
    const firstDrinkCard = drinkCards[0];
    expect(firstDrinkCard.find('h3').text()).toBe('Beer 1');
    expect(firstDrinkCard.find('.drink-type').text()).toBe('Beer');
  });

  it('filters drinks by category when a category is selected', async () => {
    // Mock drinks data with different categories
    const mockDrinks = [
      { id: 1, name: 'Beer 1', category: 'Beer' },
      { id: 2, name: 'Beer 2', category: 'Beer' },
      { id: 3, name: 'Wine 1', category: 'Wine' },
      { id: 4, name: 'Cocktail 1', category: 'Cocktail' }
    ];
    
    // Update store with mock data
    drinksStore.drinks = mockDrinks;
    await wrapper.vm.$nextTick();
    
    // Initially all drinks should be shown
    expect(wrapper.findAll('.drink-card').length).toBe(4);
    
    // Select a category
    await wrapper.vm.selectCategory('Beer');
    
    // Only Beer category drinks should be shown
    const filteredCards = wrapper.findAll('.drink-card');
    expect(filteredCards.length).toBe(2);
    expect(filteredCards[0].find('h3').text()).toBe('Beer 1');
    expect(filteredCards[1].find('h3').text()).toBe('Beer 2');
  });

  it('shows featured drinks section when there are featured drinks', async () => {
    // Mock featured drinks
    const mockFeaturedDrinks = [
      { id: 1, name: 'Featured Beer', description: 'A featured beer' }
    ];
    
    // Update store with featured drinks
    drinksStore.featuredDrinks = mockFeaturedDrinks;
    await wrapper.vm.$nextTick();
    
    // Featured section should be visible
    expect(wrapper.find('.featured-banner').exists()).toBe(true);
    expect(wrapper.find('.featured-banner h2').text()).toBe('Featured Drinks');
    
    // Featured drink should be displayed
    const featuredDrinkCard = wrapper.find('.featured-drink-card');
    expect(featuredDrinkCard.find('h3').text()).toBe('Featured Beer');
  });

  it('does not show featured drinks section when there are no featured drinks', async () => {
    // Update store with empty featured drinks
    drinksStore.featuredDrinks = [];
    await wrapper.vm.$nextTick();
    
    // Featured section should not be visible
    expect(wrapper.find('.featured-banner').exists()).toBe(false);
  });
});