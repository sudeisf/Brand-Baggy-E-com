
  
export type Product = {
    productName: string;
    unitPrice: number;
    products: number;
    status: string;
    image: string;
    sku: string;
    category: "Men" | "Women" | "Kids";
    store: "Addis Ababa" | "Dire Dawa" | "Hawassa"; // New field
  };
  
  export const data: Product[] = [
    {
      productName: "Product 1",
      unitPrice: 200,
      products: 120,
      status: "Active",
      image: "/assets/products/product1.jpg",
      sku: "SKU001",
      category: "Men",
      store: "Addis Ababa", // Added store
    },
    {
      productName: "Product 2",
      unitPrice: 200,
      products: 120,
      status: "Inactive",
      image: "/assets/products/product2.jpg",
      sku: "SKU002",
      category: "Women",
      store: "Dire Dawa", // Added store
    },
    {
      productName: "Product 3",
      unitPrice: 200,
      products: 120,
      status: "Active",
      image: "/assets/products/product3.jpg",
      sku: "SKU003",
      category: "Kids",
      store: "Hawassa", // Added store
    },
    {
      productName: "Product 4",
      unitPrice: 200,
      products: 120,
      status: "Inactive",
      image: "/assets/products/product4.jpg",
      sku: "SKU004",
      category: "Men",
      store: "Addis Ababa", // Added store
    },
    {
      productName: "Product 5",
      unitPrice: 200,
      products: 120,
      status: "Inactive",
      image: "/assets/products/product5.jpg",
      sku: "SKU005",
      category: "Women",
      store: "Dire Dawa", // Added store
    },
    {
      productName: "Product 6",
      unitPrice: 200,
      products: 120,
      status: "Active",
      image: "/assets/products/product6.jpg",
      sku: "SKU006",
      category: "Kids",
      store: "Hawassa", // Added store
    },
    {
      productName: "Product 7",
      unitPrice: 200,
      products: 120,
      status: "Active",
      image: "/assets/products/product7.jpg",
      sku: "SKU007",
      category: "Men",
      store: "Addis Ababa", // Added store
    },
    {
      productName: "Product 8",
      unitPrice: 200,
      products: 120,
      status: "Active",
      image: "/assets/products/product8.jpg",
      sku: "SKU008",
      category: "Women",
      store: "Dire Dawa", // Added store
    },
    {
      productName: "Product 9",
      unitPrice: 200,
      products: 120,
      status: "Active",
      image: "/assets/products/product9.jpg",
      sku: "SKU009",
      category: "Kids",
      store: "Hawassa", // Added store
    },
  ];
  