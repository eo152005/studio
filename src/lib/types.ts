import type { LucideIcon } from "lucide-react";

export type ProductCategory =
  | 'LPG'
  | 'Propylene'
  | 'Bitumen Bulk'
  | 'ATF'
  | 'Container'
  | 'Chemical'
  | 'Sulphur';

export interface Product {
  id: ProductCategory;
  name: ProductCategory;
  maxSlots: number;
  icon: React.ElementType;
  iconName: string;
}

export interface ParkingRecord {
  id: string; // token number
  truckNumber: string;
  product: ProductCategory;
  timeIn: Date;
  timeOut?: Date;
  duration?: string; // e.g., "2h 30m"
}
