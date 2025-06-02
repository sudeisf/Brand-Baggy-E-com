export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface Order {
  id: string;
  productName: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  payment: 'paid' | 'pending' | 'failed';
  price: number;
}

export interface OrderStats {
  totalCost: number;
  totalOrders: number;
  completed: number;
  cancelled: number;
}

export const customerData: CustomerInfo = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  billingAddress: {
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    country: "USA"
  }
};

export const orders: Order[] = [
  {
    id: "ORD-001",
    productName: "Premium Headphones",
    date: "2024-03-15",
    status: "completed",
    payment: "paid",
    price: 199.99
  },
  {
    id: "ORD-002",
    productName: "Wireless Mouse",
    date: "2024-03-10",
    status: "completed",
    payment: "paid",
    price: 49.99
  },
  {
    id: "ORD-003",
    productName: "Mechanical Keyboard",
    date: "2024-03-05",
    status: "cancelled",
    payment: "failed",
    price: 129.99
  },
  {
    id: "ORD-004",
    productName: "Gaming Monitor",
    date: "2024-03-01",
    status: "pending",
    payment: "pending",
    price: 299.99
  },
  {
    id: "ORD-005",
    productName: "4K Webcam",
    date: "2024-02-28",
    status: "completed",
    payment: "paid",
    price: 89.99
  },
  {
    id: "ORD-006",
    productName: "Ergonomic Chair",
    date: "2024-02-20",
    status: "completed",
    payment: "paid",
    price: 249.99
  },
  {
    id: "ORD-007",
    productName: "USB-C Hub",
    date: "2024-02-15",
    status: "cancelled",
    payment: "failed",
    price: 39.99
  },
  {
    id: "ORD-008",
    productName: "Noise-Cancelling Earbuds",
    date: "2024-02-10",
    status: "completed",
    payment: "paid",
    price: 159.99
  }
];

export const orderStats: OrderStats = {
  totalCost: 1209.92,
  totalOrders: 8,
  completed: 5,
  cancelled: 2
};
