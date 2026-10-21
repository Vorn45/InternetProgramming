# Questions and Answers

### 1. In EventList, what goes wrong if you use the array index as `:key` and the list gets filtered while a card has local state (for example an open details panel)?
When using the array index as `:key`, Vue identifies and reuses component instances based on their position in the array rather than the data item's unique identity. When the list is filtered, the items shift positions, but Vue reuses the existing component instances at those indices. As a result, any local component state (such as an open details panel) stays with that index and is incorrectly shown on a completely different event card.

### 2. Why is `visible` a computed and not a function called from the template? What is the difference when you type in the search box?
A `computed` property is automatically cached based on its reactive dependencies (`props.events`, `search`, and `category`), re-evaluating only when those dependencies change. In contrast, a method called directly in the template runs every time the component or any part of its template re-renders, causing unnecessary performance overhead. When you type in the search box, `computed` efficiently recalculates only as `search` updates and caches the filtered array for all template usages.

### 3. EventCard emits `book` instead of changing `event.booked`. Give two reasons.
First, Vue enforces a strict one-way data flow where child components must not directly mutate props received from parent components, preventing unpredictable side effects and Vue runtime warnings. Second, booking involves application-level responsibilities (such as updating user bookings in `myBookings`, checking capacity, and persisting to `localStorage`) that belong in `App.vue`, keeping `EventCard` decoupled and reusable.

### 4. You write `const { booked } = reactive(event); booked++.` The page does not change. Why?
Destructuring a reactive object extracts `booked` as a primitive JavaScript value (a number), breaking its reactive connection to the underlying reactive proxy. When you execute `booked++`, you are only incrementing a local variable in memory rather than mutating the property on the reactive object itself. Because the reactive proxy is never modified, Vue's dependency tracking is never triggered, and the page does not re-render.

### 5. Where does `myBookings` live, and why not in EventCard or EventList?
`myBookings` lives in the top-level `App.vue` component because it represents shared application state needed by both the header (to display the total booked seat count) and persistence logic (saving to `localStorage`). Placing it inside `EventCard` would isolate the state to individual cards, making it impossible to compute overall bookings. Storing it in `EventList` would make it inaccessible to the header in `App.vue`, violating the "lifting state up" pattern and single source of truth.
