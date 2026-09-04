export type CaseSku = {
  sku: string;
  name: string;
  qty: number;
  status: string;
};

export type CaseOrder = {
  id: string;
  placedAt: string;
  status: string;
  total: string;
  items: CaseSku[];
};

export type CaseCrm = {
  name: string;
  email: string;
  phone: string;
  accountId: string;
  lifetimeValue: string;
  lastPurchase: string;
  segment: string;
};

export type CaseThreadLine = {
  from: "customer" | "agent";
  author: string;
  text: string;
  at: string;
};

export type CaseContext = {
  caseId: string;
  caseNumber: string;
  subject: string;
  channel: string;
  account: string;
  tags: { category: string | null; brand: string | null; campaign: string | null };
  crm: CaseCrm;
  order: CaseOrder | null;
  thread: CaseThreadLine[];
  source: "mock" | "live";
};
