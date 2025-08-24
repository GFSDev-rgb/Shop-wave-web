
/**
 * Filters and sorts an array of products based on the provided criteria.
 * This function is designed to run in a Web Worker to offload computation
 * from the main thread.
 */
const filterAndSortProducts = (
  products,
  priceRange,
  selectedCategories,
  sortOption,
  searchQuery
) => {
  let result = products.filter((product) => {
    const inSearch = searchQuery.trim() === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const inCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const inPriceRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return inSearch && inCategory && inPriceRange;
  });

  switch (sortOption) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
    default:
      // The default order is assumed to be "newest" as it comes from the database.
      break;
  }
  return result;
};

/**
 * Listens for messages from the main thread, containing the product list and
 * filter criteria. It processes the data and sends the filtered/sorted list back.
 */
self.onmessage = (
    event
) => {
  const { products, priceRange, selectedCategories, sortOption, searchQuery } = event.data;
  const filteredResult = filterAndSortProducts(products, priceRange, selectedCategories, sortOption, searchQuery);
  self.postMessage(filteredResult);
};

// This export statement is needed to satisfy TypeScript's module system,
// even though we are in a worker context.
export {};
