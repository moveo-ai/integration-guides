export type PurchaseType = 'TV' | 'Laptop' | 'Keyboard' | 'XBOX' | 'Mouse';
export type PurchaseStatus = 'Completed' | 'Failed' | 'Pending';

export type Purchase = {
  PurchaseId: number;
  Price: number;
  Type: PurchaseType;
  ReturnURL: string;
  ProductURL: string;
  Status: PurchaseStatus;
  Description?: string;
  Date: string;
  ImageURL: string;
};
