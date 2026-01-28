const MiniSearch = require('minisearch');

// Mock Data similar to what we have in the app (FakeStoreAPI subset)
const products = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    category: "men's clothing",
    description: "Your perfect pack for everyday use...",
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    category: "men's clothing",
    description: "Slim-fitting style...",
  },
  {
    id: 3,
    title: "Cotton Jacket",
    category: "men's clothing",
    description: "Great outerwear...",
  },
  {
    id: 12,
    title: "WD 4TB Gaming Drive",
    category: "electronics",
    description: "Expand your PS4 gaming experience...",
  }
];

console.log("--- Testing MiniSearch Configuration ---");

// Configuration from SearchEngineService
const config = {
  idField: 'id',
  fields: [
    { name: 'title', boost: 12 },
    { name: 'category', boost: 10 },
    { name: 'brand', boost: 8 },
    { name: 'description', boost: 4 },
    { name: 'stock', boost: 1 }
  ],
  storeFields: ['id', 'title', 'category'], // Storimg title/cat for debug
  searchOptions: {
    prefix: true,
    fuzzy: (term) => term.length > 2 ? 0.2 : 0,
    combineWith: 'OR',
    boost: { title: 3, category: 2 }
  }
};

const miniSearch = new MiniSearch(config);
miniSearch.addAll(products);

console.log(`Indexed ${miniSearch.documentCount} documents.`);

const testQueries = ['cat', 'men', 'backpack', 'gaming'];

testQueries.forEach(q => {
  console.log(`\nSearching for: "${q}"`);
  const results = miniSearch.search(q);
  if (results.length === 0) {
    console.log("  No results found.");
  } else {
    results.forEach(r => {
      console.log(`  - [Score: ${r.score.toFixed(2)}] ${r.title} (Cat: ${r.category})`);
    });
  }
});
