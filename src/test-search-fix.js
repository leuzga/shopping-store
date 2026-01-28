const MiniSearch = require('minisearch');

const products = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    category: "men's clothing",
    description: "Your perfect pack for everyday use...",
  }
];

// CORRECTED Configuration: fields as strings
const config = {
  idField: 'id',
  fields: ['title', 'category', 'brand', 'description', 'stock'], // Strings only!
  storeFields: ['id', 'title'],
  searchOptions: {
    prefix: true,
    fuzzy: (term) => term.length > 2 ? 0.2 : 0,
    combineWith: 'OR',
    boost: { title: 3, category: 2 } // Boosts go here
  }
};

console.log("--- Testing Corrected Config ---");
const miniSearch = new MiniSearch(config);
miniSearch.addAll(products);

console.log(`Indexed ${miniSearch.documentCount} documents.`);
console.log("Search 'back':", miniSearch.search('back'));
