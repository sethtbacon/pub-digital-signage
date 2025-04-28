// Re-export the existing eventStore to maintain compatibility
import { useEventStore } from './eventStore';

// Export the store with the plural name that is being imported in EventDisplay.vue
export const useEventsStore = useEventStore;