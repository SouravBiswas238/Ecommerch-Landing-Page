// High-fidelity fallback products list for instant visual proof even if server is offline
const FALLBACK_PRODUCTS = [
  {
    id: 2807,
    name: "Latte 12 oz",
    price: 750,
    is_active: true,
    description: "Perfectly pulled espresso shots layered with creamy micro-foam milk.",
    attributes: { category: "Hot Drinks" },
    options: {
      select_flavour: {
        max_select: 1,
        min_select: 1,
        modifiers: [
          { name: "Vanilla", price: 0, pos_id: "v-5000" },
          { name: "Caramel", price: 0, pos_id: "c-6000" },
          { name: "Hazelnut", price: 0, pos_id: "h-7000" },
        ],
      },
    },
  },
  {
    id: 2806,
    name: "Espresso 16 oz",
    price: 650,
    is_active: true,
    description: "Rich, full-bodied espresso shot serving intense flavor and amazing crema.",
    attributes: { category: "Hot Drinks" },
  },
  {
    id: 2803,
    name: "Iced Latte",
    price: 850,
    is_active: true,
    description: "Espresso combined with milk and poured over cold ice for refreshment.",
    attributes: { category: "Cold Drinks" },
  },
  {
    id: 2798,
    name: "Smoothie 16 oz",
    price: 800,
    is_active: true,
    description: "Fresh blended premium fruits blended together for a cooling thick smoothie.",
    attributes: { category: "Cold Drinks" },
    options: {
      select_flavour: {
        max_select: 1,
        min_select: 1,
        modifiers: [
          { name: "Fruit Punch", price: 0, pos_id: "fp-1" },
          { name: "Banana", price: 0, pos_id: "b-1" },
        ],
      },
    },
  },
  {
    id: 2792,
    name: "Chocolate Fudge Cake Slice",
    price: 900,
    is_active: true,
    description: "Rich layered chocolate cake covered in dense premium fudge icing.",
    attributes: { category: "Cakes" },
  },
  {
    id: 2790,
    name: "Gourmet Club Sandwich",
    price: 1100,
    is_active: true,
    description:
      "Triple-decker sandwich loaded with turkey, lettuce, tomato and signature garlic aioli.",
    attributes: { category: "Sandwiches" },
  },
];

export default FALLBACK_PRODUCTS;
