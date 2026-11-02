import { computed, ref, type Ref } from "vue";
import type { CampusEvent, Category } from "../types";

// TODO E1 (refactor): move the filtering logic from week 4's EventList.vue here,
// so any page can reuse it. Return { search, category, visible }.
// The test "filters the list with the search box" in EventsPage.test.ts checks it.
export function useEventFilters(events: Ref<CampusEvent[]>) {
  const search = ref("");
  const category = ref<Category | "all">("all");

  const visible = computed(() => {
    const query = search.value.trim().toLowerCase();
    const selectedCategory = category.value;

    return events.value.filter((event) => {
      // Category filter: match exact category or allow all
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      // Search filter: if query is empty, pass through
      if (!query) {
        return true;
      }

      // Check text fields (title, description, location) case-insensitively
      const titleMatch = event.title?.toLowerCase().includes(query) ?? false;
      const descMatch =
        "description" in event && typeof event.description === "string"
          ? event.description.toLowerCase().includes(query)
          : false;
      const locationMatch =
        "location" in event && typeof event.location === "string"
          ? event.location.toLowerCase().includes(query)
          : false;

      return titleMatch || descMatch || locationMatch;
    });
  });

  return { search, category, visible };
}