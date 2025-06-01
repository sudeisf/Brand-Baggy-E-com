export type Customer = {
    id: string;
    name: string;
    email: string;
    orderCount: number;
    location: string;
    totalSpent: number;
  };
  
  export const data: Customer[] = [
    {
      id: "CUST-1001",
      name: "John Smith",
      email: "john.smith@example.com",
      orderCount: 5,
      location: "New York, USA",
      totalSpent: 1245.99,
    },
    {
      id: "CUST-1002",
      name: "Emily Johnson",
      email: "emily.j@example.com",
      orderCount: 2,
      location: "London, UK",
      totalSpent: 329.50,
    },
    {
      id: "CUST-1003",
      name: "Michael Brown",
      email: "michael.b@example.com",
      orderCount: 8,
      location: "Toronto, Canada",
      totalSpent: 2100.00,
    },
    {
      id: "CUST-1004",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      orderCount: 1,
      location: "Sydney, Australia",
      totalSpent: 149.99,
    },
    {
      id: "CUST-1005",
      name: "David Lee",
      email: "david.lee@example.com",
      orderCount: 12,
      location: "San Francisco, USA",
      totalSpent: 3540.75,
    },
    {
      id: "CUST-1006",
      name: "Jessica Martinez",
      email: "jessica.m@example.com",
      orderCount: 3,
      location: "Madrid, Spain",
      totalSpent: 487.30,
    },
    {
      id: "CUST-1007",
      name: "Robert Wilson",
      email: "robert.w@example.com",
      orderCount: 7,
      location: "Berlin, Germany",
      totalSpent: 1299.00,
    },
    {
      id: "CUST-1008",
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      orderCount: 4,
      location: "Paris, France",
      totalSpent: 876.45,
    },
    {
      id: "CUST-1009",
      name: "James Taylor",
      email: "james.t@example.com",
      orderCount: 6,
      location: "Tokyo, Japan",
      totalSpent: 1542.80,
    },
    {
      id: "CUST-1010",
      name: "Maria Garcia",
      email: "maria.g@example.com",
      orderCount: 9,
      location: "Mexico City, Mexico",
      totalSpent: 2345.60,
    },
  ];