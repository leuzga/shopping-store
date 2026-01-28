const MiniSearch = require('minisearch');

// Mock Product Data (based on Product model)
const products = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    category: "men's clothing",
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: { rate: 3.9, count: 120 }
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts ",
    category: "men's clothing",
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: { rate: 4.1, count: 259 }
  },
  {
    id: 12,
    title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    category: "electronics",
    description: "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
    image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
    rating: { rate: 4.8, count: 400 }
  },
  {
    id: 15,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    category: "women's clothing",
    description: "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: { rate: 2.6, count: 235 }
  },
  // Add a product that SHOULD match "cat" but isn't explicit
  {
    id: 99,
    title: "Cat Food Premium",
    category: "pets", // Not in standard types but for testing
    description: "Delicious food for your cat",
    image: "",
    rating: { rate: 5, count: 10 }
  }
];

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
  storeFields: ['id'],
  searchOptions: {
    prefix: true,
    fuzzy: (term) => term.length > 2 ? 0.2 : 0,
    combineWith: 'OR',
    boost: { title: 3, category: 2 }
  }
};

const miniSearch = new MiniSearch(config);
miniSearch.addAll(products);

const query = "cat";
console.log(`Searching for "${query}"...`);
const results = miniSearch.search(query);

console.log(`Found ${results.length} results:`);
results.forEach(r => {
  const product = products.find(p => p.id == r.id);
  console.log(`- [${r.score.toFixed(2)}] ${product.title} (Category: ${product.category})`);
});
