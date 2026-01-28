const MiniSearch = require('minisearch');

const products = [
  { id: 1, title: "Backpack", category: "men" },
  { id: 2, title: "T-Shirt", category: "men" }
];

const config = {
  idField: 'id',
  fields: ['title', 'category'],
  storeFields: ['title', 'category'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: { title: 2 }
  }
};

console.log("--- Debugging MiniSearch ---");
const miniSearch = new MiniSearch(config);
miniSearch.addAll(products);

console.log("Documents indexed:", miniSearch.documentCount);

// Inspect terms in index
console.log("Suggest 'back':", miniSearch.autoSuggest('back'));
console.log("Suggest 'men':", miniSearch.autoSuggest('men'));

console.log("Search 'back':", miniSearch.search('back'));
console.log("Search 'men':", miniSearch.search('men'));
