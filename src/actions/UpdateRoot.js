export default {
  execute(store, step = 1) {
    const maxRoot = (store.config.octaveEnd + 1) * 12 - 1;
    const minRoot = (store.config.octaveStart + 1) * 12;
    const range = maxRoot - minRoot + 1;
    
    // Calculate new root with wrapping
    let newRoot = store.config.root + step;
    
    // Handle wrapping around the range
    if (newRoot > maxRoot) {
      newRoot = minRoot + ((newRoot - minRoot) % range);
    } else if (newRoot < minRoot) {
      newRoot = maxRoot - ((minRoot - newRoot - 1) % range);
    }
    
    store.config.root = newRoot;
  }
};
