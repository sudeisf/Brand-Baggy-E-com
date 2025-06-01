interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
}

interface Order {
  id: string;
  productName: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  payment: 'paid' | 'pending' | 'failed';
  price: number;
}

interface OrderStats {
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
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
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
  }
];

export const orderStats: OrderStats = {
  totalCost: 679.96,
  totalOrders: 4,
  completed: 2,
  cancelled: 1
};
