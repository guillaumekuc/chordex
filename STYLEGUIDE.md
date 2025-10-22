# Chordex Codebase Style Guide

This document outlines the stylistic conventions for the Chordex codebase, established through analysis of existing patterns and standardization for consistency.

## Function Declaration Patterns

### Arrow Functions (Preferred)

Use arrow functions for the following patterns:

#### 1. Array Method Callbacks
```javascript
// Preferred
array.forEach(item => { /* logic */ });
array.map(item => item.value);
array.filter(item => item.active);
array.some(item => item.valid);
array.every(item => item.checked);
array.reduce((acc, item) => acc + item, 0);
```

#### 2. Vue Computed Properties
```javascript
// Preferred
const computedValue = computed(() => {
  return someValue.value * 2;
});

const filteredData = computed(() => {
  return data.value.filter(item => item.active);
});
```

#### 3. Event Handlers
```javascript
// Preferred
element.addEventListener('click', (event) => {
  // handler logic
});

input.onchange = (event) => {
  // handler logic
};
```

#### 4. Sort Functions
```javascript
// Preferred
array.sort((a, b) => a.value - b.value);
array.sort((a, b) => a.name.localeCompare(b.name));
```

#### 5. Object Method Shorthand (for simple methods)
```javascript
// Preferred for simple methods
const obj = {
  method: () => console.log('simple'),
  another: () => this.doSomething()
};
```

### Classic Function Declarations (Preferred)

Use classic function declarations for the following patterns:

#### 1. Standalone Utility Functions
```javascript
// Preferred
function debugLog(message, ...args) {
  if (DEBUG_ENABLED) {
    console.log(`${message}`, ...args);
  }
}

function toLower(string) {
  return string.toLowerCase();
}
```

#### 2. Class Methods
```javascript
// Preferred
export default class MyClass {
  constructor() {
    // constructor logic
  }
  
  method() {
    // method logic
  }
  
  static staticMethod() {
    // static method logic
  }
}
```

#### 3. Complex Event Handlers (when context preservation is needed)
```javascript
// Preferred when you need 'this' context
class EventHandler {
  constructor() {
    this.data = [];
  }
  
  setupHandler() {
    element.addEventListener('click', function(event) {
      this.handleClick(event); // 'this' refers to the class instance
    }.bind(this));
  }
}
```

## Vue-Specific Patterns

### Computed Properties
Always use arrow functions for Vue computed properties:
```javascript
// Preferred
const filtered = computed(() => {
  return data.value.filter(item => item.active);
});

// Avoid
const filtered = computed(function() {
  return data.value.filter(function(item) { return item.active; });
});
```

### Event Handlers in Templates
Use arrow functions for inline event handlers:
```javascript
// Preferred
@click="(event) => { handleClick(event); }"
@keydown.enter="(event) => { submitForm(event); }"
```

## Context Considerations

### When to Use Arrow Functions
- Array method callbacks (forEach, map, filter, etc.)
- Vue computed properties
- Simple event handlers
- Sort functions
- When you want lexical `this` binding

### When to Use Classic Functions
- Standalone utility functions
- Class methods
- When you need `this` context from the calling object
- Functions that benefit from hoisting
- Complex event handlers requiring context preservation

## Consistency Rules

1. **Within a use case, be consistent**: If you use arrow functions for array methods in one place, use them everywhere for array methods.

2. **Follow the majority pattern**: When multiple patterns exist for the same use case, standardize to the most common pattern in the codebase.

3. **Context matters**: Choose the pattern that best serves the functional requirements (context binding, hoisting, etc.).

## Examples from Codebase

### Good Examples

```javascript
// Array methods - consistent arrow functions
const results = data.filter(item => item.active);
const mapped = items.map(item => item.value);
const found = array.some(item => item.id === targetId);

// Vue computed - consistent arrow functions
const filtered = computed(() => {
  return data.value.filter(item => item.visible);
});

// Event handlers - consistent arrow functions
element.addEventListener('click', (event) => {
  handleClick(event);
});

// Utility functions - classic function declarations
function debugLog(message, ...args) {
  if (DEBUG_ENABLED) {
    console.log(`${message}`, ...args);
  }
}
```

### Anti-Patterns to Avoid

```javascript
// Inconsistent array method usage
array.forEach(function(item) { /* logic */ }); // classic
array.map(item => { /* logic */ }); // arrow

// Inconsistent Vue computed usage
const computed1 = computed(() => { /* logic */ }); // arrow
const computed2 = computed(function() { /* logic */ }); // classic

// Mixing patterns in same context
const data = items
  .filter(function(item) { return item.active; }) // classic
  .map(item => item.value) // arrow
  .sort((a, b) => a - b); // arrow
```

## Documentation Standards

### No Icons in Documentation
- Do not use emoji or icon characters in README files, documentation, or comments
- Keep documentation clean and professional
- Use plain text formatting only

### Variable Naming
- Use descriptive variable names that clearly indicate their purpose
- Avoid single letter variables except for standard conventions
- Use meaningful names that make the code self-documenting
- For array elements, use descriptive names like `item`, `element`, `value`
- For function parameters, use descriptive names that indicate their purpose

#### Standard Single Letter Variable Exceptions
- **Loop counters**: `i`, `j`, `k` are acceptable for nested loops (very standard)
- **Sort/comparison functions**: `a`, `b` are acceptable for comparison parameters
- **Mathematical operations**: `a`, `b` are acceptable for simple arithmetic operations

### File Naming
- Use uppercase for documentation files: `README.md`, `STYLEGUIDE.md`
- No underscores in documentation file names
- Use descriptive names that clearly indicate the file's purpose

