<template>
  <BaseLayout title="Drinks Menu">
    <div class="drinks-display">
      <div class="drink-categories">
        <button
          v-for="(drinks, category) in drinkCategories"
          :key="category"
          class="category-button"
          :class="{ active: selectedCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>

      <div class="drinks-grid">
        <template v-if="drinksStore.loading">
          <div class="loading-state">Loading drinks...</div>
        </template>

        <template v-else-if="drinksStore.error">
          <div class="error-state">{{ drinksStore.error }}</div>
        </template>

        <template v-else-if="filteredDrinks.length === 0">
          <div class="empty-state" data-test="empty-state">
            No drinks available in this category
          </div>
        </template>

        <template v-else>
          <div
            v-for="drink in filteredDrinks"
            :key="drink.id"
            class="drink-card"
            :class="{ featured: drink.featured }"
          >
            <div v-if="drink.imageUrl" class="drink-image">
              <img :src="drink.imageUrl" :alt="drink.name" />
            </div>
            <div class="drink-content">
              <h3>{{ drink.name }}</h3>
              <div class="drink-badges">
                <span v-if="drink.featured" class="badge featured">
                  <span class="dot"></span>
                  <span class="label">Featured</span>
                </span>
                <span v-if="drink.new" class="badge new">
                  <span class="dot"></span>
                  <span class="label">New</span>
                </span>
                <span v-if="drink.special" class="badge special">
                  <span class="dot"></span>
                  <span class="label">Special</span>
                </span>
              </div>
              <div class="drink-details">
                <div class="drink-type">{{ drink.category }}</div>
                <div v-if="drink.abv" class="drink-abv">ABV: {{ drink.abv }}%</div>
              </div>
              <p class="drink-description">{{ drink.description }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="hasFeaturedDrinks" class="featured-banner">
      <h2>Featured Drinks</h2>
      <div class="featured-drinks-carousel">
        <div v-for="drink in featuredDrinks" :key="drink.id" class="featured-drink-card">
          <h3>{{ drink.name }}</h3>
          <p class="featured-description">{{ drink.description }}</p>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseLayout from '../../components/layout/BaseLayout.vue';
import { useDrinksStore } from '../../store/modules/drinksStore';

const drinksStore = useDrinksStore();

const selectedCategory = ref('All');

// Get all drinks organized by category
const drinkCategories = computed(() => {
  const categories = { All: [] };

  drinksStore.drinks.forEach(drink => {
    // Add to 'All' category
    categories['All'].push(drink);

    // Add to specific category
    if (!categories[drink.category]) {
      categories[drink.category] = [];
    }
    categories[drink.category].push(drink);
  });

  return categories;
});

// Get drinks filtered by selected category
const filteredDrinks = computed(() => {
  if (selectedCategory.value === 'All') {
    return drinksStore.drinks;
  }
  return drinkCategories.value[selectedCategory.value] || [];
});

// Get featured drinks
const featuredDrinks = computed(() => {
  return drinksStore.featuredDrinks;
});

// Check if we have any featured drinks
const hasFeaturedDrinks = computed(() => {
  return featuredDrinks.value.length > 0;
});

// Select a category
const selectCategory = category => {
  selectedCategory.value = category;
};

onMounted(async () => {
  // Load all drinks
  await drinksStore.fetchAllDrinks();

  // Load featured drinks
  await drinksStore.fetchFeaturedDrinks();
});
</script>

<style lang="scss" scoped>
.drinks-display {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-large);
}

.drink-categories {
  display: flex;
  gap: var(--spacing-medium);
  flex-wrap: wrap;
  padding-bottom: var(--spacing-medium);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .category-button {
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--primary-color);
    color: var(--text-color);
    padding: var(--spacing-small) var(--spacing-medium);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background-color: var(--primary-color);
      color: white;
    }

    &:hover {
      background-color: rgba(255, 107, 1, 0.2);
    }
  }
}

.drinks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-large);
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-small);
}

.loading-state,
.error-state,
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-large);
  color: #888;
  height: 200px;
}

.error-state {
  color: var(--accent-color);
}

.drink-card {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &.featured {
    border: 2px solid var(--primary-color);
    box-shadow: 0 0 15px rgba(255, 107, 1, 0.3);
  }

  .drink-image {
    height: 180px;
    width: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .drink-content {
    padding: var(--spacing-medium);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-small);

    h3 {
      margin: 0;
      font-size: var(--font-size-medium);
      color: var(--text-color);
    }

    .drink-badges {
      display: flex;
      gap: var(--spacing-small);
      margin-top: var(--spacing-small);

      .badge {
        font-size: 0.8rem;
        padding: 2px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;

        .dot {
          height: 8px;
          width: 8px;
          border-radius: 50%;
          margin-right: 4px;
        }

        &.featured {
          background-color: var(--primary-color);
          color: white;

          .dot {
            background-color: white;
          }
        }

        &.new {
          background-color: var(--accent-color);
          color: white;

          .dot {
            background-color: white;
          }
        }

        &.special {
          background-color: var(--secondary-color);
          color: white;

          .dot {
            background-color: white;
          }
        }
      }
    }

    .drink-details {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #ccc;
      margin-top: var(--spacing-small);
    }

    .drink-description {
      margin: var(--spacing-small) 0 0;
      font-size: 0.9rem;
      line-height: 1.4;
      color: #bbb;
    }
  }
}

.featured-banner {
  background-color: rgba(0, 0, 0, 0.5);
  padding: var(--spacing-medium);
  margin-top: var(--spacing-large);
  border-radius: 8px;

  h2 {
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: var(--spacing-medium);
  }

  .featured-drinks-carousel {
    display: flex;
    gap: var(--spacing-medium);
    overflow-x: auto;
    padding-bottom: var(--spacing-small);

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
  }

  .featured-drink-card {
    min-width: 250px;
    background-color: rgba(255, 107, 1, 0.1);
    border-left: 3px solid var(--primary-color);
    padding: var(--spacing-medium);
    border-radius: 0 8px 8px 0;

    h3 {
      margin: 0;
      color: var(--primary-color);
    }

    .featured-description {
      margin: var(--spacing-small) 0 0;
      font-size: 0.9rem;
      color: #ddd;
    }
  }
}
</style>
