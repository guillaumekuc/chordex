# Chordex Codebase Style Guide

## Function Declaration Patterns

### Arrow Functions
Use for:
- Array method callbacks (`forEach`, `map`, `filter`, `some`, `every`, `reduce`, `sort`)
- Vue computed properties
- Event handlers
- When you want lexical `this` binding

```javascript
// Array methods
array.forEach(item => { /* logic */ });
array.map(item => item.value);
array.filter(item => item.active);

// Vue computed
const computedValue = computed(() => {
  return someValue.value * 2;
});

// Event handlers
element.addEventListener('click', (event) => {
  // handler logic
});
```

### Classic Function Declarations
Use for:
- Standalone utility functions
- Class methods
- When you need `this` context from the calling object
- Functions that benefit from hoisting

```javascript
// Utility functions
function debugLog(message, ...args) {
  if (DEBUG_ENABLED) {
    console.log(`${message}`, ...args);
  }
}

// Class methods
export default class MyClass {
  method() {
    // method logic
  }
}
```

## Vue-Specific Patterns

### Computed Properties
Always use arrow functions:
```javascript
const filtered = computed(() => {
  return data.value.filter(item => item.active);
});
```

### Event Handlers in Templates
```javascript
@click="(event) => { handleClick(event); }"
@keydown.enter="(event) => { submitForm(event); }"
```

### CSS and Styling
- **Avoid inline CSS**: Never use `style` attributes in templates
- **Use proper style sections**: Place all styles in dedicated `<style>` sections
- **Use semantic class names**: Choose descriptive class names that indicate purpose
- **Keep styles organized**: Group related styles together

```vue
<!-- ❌ Bad: Inline styles -->
<div style="display: flex; flex-direction: column;">
  <button style="width: fit-content; margin-bottom: 0.5rem;">Submit</button>
</div>

<!-- ✅ Good: Proper style section -->
<template>
  <div class="filter-actions">
    <button class="submit-button">Submit</button>
  </div>
</template>

<style>
.filter-actions {
  display: flex;
  flex-direction: column;
}

.submit-button {
  width: fit-content;
  margin-bottom: 0.5rem;
}
</style>
```

## Consistency Rules

1. **Be consistent within use cases**: If you use arrow functions for array methods in one place, use them everywhere for array methods.
2. **Follow the majority pattern**: When multiple patterns exist, standardize to the most common pattern.
3. **Context matters**: Choose the pattern that best serves the functional requirements.

## Documentation Standards

### No Icons
- Do not use emoji or icon characters in documentation
- Keep documentation clean and professional

### Variable Naming
- Use descriptive variable names that clearly indicate their purpose
- Avoid single letter variables except for standard conventions:
  - **Loop counters**: `i`, `j`, `k` (nested loops)
  - **Sort/comparison**: `a`, `b` (comparison parameters)
  - **Math operations**: `a`, `b` (simple arithmetic)

### File Naming
- Use uppercase for documentation files: `README.md`, `STYLEGUIDE.md`
- No underscores in documentation file names