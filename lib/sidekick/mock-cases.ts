import type { CaseContext } from "@/lib/sidekick/types";

export const MOCK_CASES: CaseContext[] = [
  {
    caseId: "case_2091",
    caseNumber: "2091",
    subject: "Late shipment · Order #4412",
    channel: "Email",
    account: "AcmeCare",
    source: "mock",
    tags: { category: "Shipping", brand: "Acme", campaign: null },
    crm: {
      name: "Pat Nguyen",
      email: "pat.nguyen@example.com",
      phone: "+1 415-555-0198",
      accountId: "CRM-88421",
      lifetimeValue: "$1,240",
      lastPurchase: "Aug 12, 2026",
      segment: "Repeat · Care preferred",
    },
    order: {
      id: "4412",
      placedAt: "Aug 28, 2026",
      status: "In transit · delayed",
      total: "$186.40",
      items: [
        { sku: "ACM-KTL-12", name: "Acme kettle — brushed steel", qty: 1, status: "Shipped" },
        { sku: "ACM-FLT-02", name: "Replacement filter 2-pack", qty: 1, status: "Held" },
      ],
    },
    thread: [
      {
        from: "customer",
        author: "Pat Nguyen",
        at: "Tue 9:14 AM",
        text: "My package is 4 days late. Order #4412. Tracking hasn't moved at all.",
      },
      {
        from: "agent",
        author: "Jordan Hale",
        at: "Tue 9:22 AM",
        text: "Looking this up now — I can see 4412 on the account.",
      },
      {
        from: "customer",
        author: "Pat Nguyen",
        at: "Tue 9:25 AM",
        text: "The filter is the one I need for Friday. The kettle can wait.",
      },
    ],
  },
  {
    caseId: "case_2044",
    caseNumber: "2044",
    subject: "Listing vs box · dishwasher safe?",
    channel: "Sprinklr Care",
    account: "NorthwindHome",
    source: "mock",
    tags: { category: "Product Quality", brand: "Northwind Home", campaign: null },
    crm: {
      name: "Riley Cho",
      email: "riley.cho@example.com",
      phone: "+1 206-555-0144",
      accountId: "CRM-11092",
      lifetimeValue: "$410",
      lastPurchase: "Sep 1, 2026",
      segment: "First order",
    },
    order: {
      id: "9901",
      placedAt: "Sep 1, 2026",
      status: "Delivered",
      total: "$79.00",
      items: [
        { sku: "NWH-BWL-08", name: "Northwind mixing bowl 8\"", qty: 1, status: "Delivered" },
      ],
    },
    thread: [
      {
        from: "customer",
        author: "Riley Cho",
        at: "Wed 2:03 PM",
        text: "Is this dishwasher safe? The listing is confusing and the box says something else.",
      },
    ],
  },
  {
    caseId: "case_2188",
    caseNumber: "2188",
    subject: "Advocacy · Harbor kettle unboxing",
    channel: "Instagram",
    account: "HarborOfficial",
    source: "mock",
    tags: {
      category: "Advocacy",
      brand: "Harbor & Co",
      campaign: "Spring Launch",
    },
    crm: {
      name: "Ria Mendes",
      email: "ria@homewithria.com",
      phone: "",
      accountId: "CRM-55201",
      lifetimeValue: "$620",
      lastPurchase: "Sep 2, 2026",
      segment: "Advocate",
    },
    order: {
      id: "7720",
      placedAt: "Sep 2, 2026",
      status: "Delivered",
      total: "$149.00",
      items: [
        { sku: "HBR-KTL-01", name: "Harbor & Co kettle", qty: 1, status: "Delivered" },
      ],
    },
    thread: [
      {
        from: "customer",
        author: "@homewithria",
        at: "Thu 11:40 AM",
        text: "Just got the Harbor & Co kettle — obsessed. Thank you @HarborOfficial #unboxing #SpringLaunch",
      },
    ],
  },
];

export function getMockCase(id?: string | null) {
  return MOCK_CASES.find((c) => c.caseId === id) ?? MOCK_CASES[0];
}
