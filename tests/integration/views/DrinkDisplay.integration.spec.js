import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import DrinkDisplay from '../../../src/frontend/views/display/DrinkDisplay.vue';
import { useDrinksStore } from '../../../src/frontend/store/modules/drinksStore';
import drinksApi from '../../../src/frontend/services/api/drinksApi';
import baseApi from '../../../src/frontend/services/api/baseApi';

// Mock the axios client (baseApi)
vi.mock('../../../src/frontend/services/api/baseApi', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock the BaseLayout component
vi.mock('../../../src/frontend/components/layout/BaseLayout.vue', () => ({
  default: {
    name: 'BaseLayout',
    template: '<div class="mock-base-layout"><slot /></div>',
    props: ['title']
  }
}));

describe('DrinkDisplay Integration Test', () => {
  let wrapper;
  let drinksStore;
  
  // Sample data
  const mockDrinks = [
    { 
      id: 1, 
      name: 'IPA', 
      category: 'Beer', 
      description: 'A hoppy beer', 
      price: 5.50, 
      abv: 6.5, 
      featured: true,
      new: false,
      special: false
    },
    { 
      id: 2, 
      name: 'Stout', 
      category: 'Beer', 
      description: 'A dark beer', 
      price: 6.00, 
      abv: 7.2, 
      featured: false,
      new: true,
      special: false
    },
    { 
      id: 3, 
      name: 'Merlot', 
      category: 'Wine', 
      description: 'A smooth red wine', 
      price: 8.50,
      abv: 13.5,
      featured: false,
      new: false,
      special: false
    }
  ];
  
  const mockFeaturedDrinks = [
    { 
      id: 1, 
      name: 'IPA', 
      category: 'Beer', 
      description: 'A hoppy beer', 
      price: 5.50, 
      abv: 6.5, 
      featured: true,
      new: false,
      special: false
    }
  ];
  
  beforeEach(() => {
    // Mock API responses
    baseApi.get.mockImplementation((url) => {
      if (url === '/api/drinks') {
        return Promise.resolve({ data: mockDrinks });
      } else if (url === '/api/drinks/featured') {
        return Promise.resolve({ data: mockFeaturedDrinks });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    // Create wrapper with pinia
    wrapper = mount(DrinkDisplay, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false
          })
        ]
      }
    });
    
    // Get the drinks store
    drinksStore = useDrinksStore();
  });
  
  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });
  
  it('fetches drinks from API and displays them', async () => {
    // Fetch calls are made in onMounted
    await flushPromises();
    
    // Verify that API calls were made
    expect(baseApi.get).toHaveBeenCalledWith('/api/drinks');
    expect(baseApi.get).toHaveBeenCalledWith('/api/drinks/featured');
    
    // Verify that drinks are stored in the store
    expect(drinksStore.drinks.length).toBe(mockDrinks.length);
    
    // Verify drink categories are created correctly
    expect(Object.keys(wrapper.vm.drinkCategories).length).toBeGreaterThan(1);
    expect(wrapper.vm.drinkCategories).toHaveProperty('All');
    expect(wrapper.vm.drinkCategories).toHaveProperty('Beer');
    expect(wrapper.vm.drinkCategories).toHaveProperty('Wine');
    
    // Verify drink cards are displayed
    await wrapper.vm.$nextTick();
    const drinkCards = wrapper.findAll('.drink-card');
    expect(drinkCards.length).toBe(mockDrinks.length);
    
    // Verify first drink content
    const firstDrink = drinkCards[0];
    expect(firstDrink.find('h3').text()).toBe('IPA');
    expect(firstDrink.find('.drink-type').text()).toBe('Beer');
    expect(firstDrink.find('.drink-description').text()).toBe('A hoppy beer');
    
    // Verify that featured drink has featured class
    expect(firstDrink.classes()).toContain('featured');
  });
  
  it('filters drinks when category is selected', async () => {
    // Wait for initial data to load
    await flushPromises();
    
    // Get category buttons
    const categoryButtons = wrapper.findAll('.category-button');
    
    // Click on the Beer category button (should be the second one, after 'All')
    await categoryButtons[1].trigger('click');
    
    // Verify that selectedCategory is updated
    expect(wrapper.vm.selectedCategory).toBe('Beer');
    
    // Verify that only Beer drinks are displayed
    const drinkCards = wrapper.findAll('.drink-card');
    expect(drinkCards.length).toBe(2); // Two beers in our mock data
    expect(drinkCards[0].find('.drink-type').text()).toBe('Beer');
    expect(drinkCards[1].find('.drink-type').text()).toBe('Beer');
    
    // Now click on Wine category button (should be the third one)
    await categoryButtons[2].trigger('click');
    
    // Verify selectedCategory updated
    expect(wrapper.vm.selectedCategory).toBe('Wine');
    
    // Verify only Wine drinks are displayed
    const wineCards = wrapper.findAll('.drink-card');
    expect(wineCards.length).toBe(1); // One wine in our mock data
    expect(wineCards[0].find('.drink-type').text()).toBe('Wine');
  });
  
  it('displays featured section when there are featured drinks', async () => {
    // Wait for initial data to load
    await flushPromises();
    
    // Verify featured section exists and displays correctly
    const featuredSection = wrapper.find('.featured-banner');
    expect(featuredSection.exists()).toBe(true);
    expect(featuredSection.find('h2').text()).toBe('Featured Drinks');
    
    // Verify featured drink content
    const featuredDrinkCard = featuredSection.find('.featured-drink-card');
    expect(featuredDrinkCard.find('h3').text()).toBe('IPA');
  });
  
  it('handles API errors gracefully', async () => {
    // Change the mock to return an error
    baseApi.get.mockImplementation(() => {
      return Promise.reject(new Error('API Error'));
    });
    
    // Create a new component with the error mock
    const errorWrapper = mount(DrinkDisplay, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false
          })
        ]
      }
    });
    
    const errorStore = useDrinksStore();
    errorStore.error = 'Failed to load drinks';
    
    // Wait for error to be processed
    await flushPromises();
    await errorWrapper.vm.$nextTick();
    
    // Verify error message is displayed
    const errorMessage = errorWrapper.find('.error-state');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Failed to load drinks');
    
    // Clean up
    errorWrapper.unmount();
  });
  
  it('shows empty state when no drinks in a category', async () => {
    // Wait for initial data to load
    await flushPromises();
    
    // Override filteredDrinks computed property to return empty array
    Object.defineProperty(wrapper.vm, 'filteredDrinks', {
      get: () => []
    });
    
    // Force component to update
    await wrapper.vm.$nextTick();
    
    // Verify empty state message is displayed
    const emptyState = wrapper.find('.empty-state');
    expect(emptyState.exists()).toBe(true);
    expect(emptyState.text()).toContain('No drinks available');
  });
});