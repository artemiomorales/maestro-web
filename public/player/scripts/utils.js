// debounce function
export function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// deepClone function
export function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj; // Handle primitives (null, undefined, number, string, etc.)
    if (hash.has(obj)) return hash.get(obj); // Handle circular references
    
    const result = Array.isArray(obj) ? [] : {};
    hash.set(obj, result); // Store reference to handle circular references
  
    Object.keys(obj).forEach(key => {
      result[key] = deepClone(obj[key], hash); // Recursively copy properties
    });
  
    return result;
  }