import type { Product, ParkingRecord, ProductCategory } from '@/lib/types';
import { Flame, TestTube2, Droplets, Plane, Container, FlaskConical, Sparkles } from 'lucide-react';

export const products: Product[] = [
  { id: 'LPG', name: 'LPG', maxSlots: 100, icon: Flame },
  { id: 'Propylene', name: 'Propylene', maxSlots: 77, icon: TestTube2 },
  { id: 'Bitumen Bulk', name: 'Bitumen Bulk', maxSlots: 25, icon: Droplets },
  { id: 'ATF', name: 'ATF', maxSlots: 40, icon: Plane },
  { id: 'Container', name: 'Container', maxSlots: 30, icon: Container },
  { id: 'Chemical', name: 'Chemical', maxSlots: 20, icon: FlaskConical },
  { id: 'Sulphur', name: 'Sulphur', maxSlots: 12, icon: Sparkles },
];

// In-memory "database"
let parkedVehicles: ParkingRecord[] = [
    { id: 'TKN001', truckNumber: 'MH04AB1234', product: 'LPG', timeIn: new Date(Date.now() - 3600 * 1000 * 5) },
    { id: 'TKN002', truckNumber: 'GJ01CD5678', product: 'Propylene', timeIn: new Date(Date.now() - 3600 * 1000 * 2) },
    { id: 'TKN003', truckNumber: 'KA05EF9012', product: 'LPG', timeIn: new Date(Date.now() - 3600 * 1000 * 26) }, // Overstaying
];
let parkingHistory: ParkingRecord[] = [
    { id: 'HIST001', truckNumber: 'TN07GH3456', product: 'ATF', timeIn: new Date(Date.now() - 3600 * 1000 * 10), timeOut: new Date(Date.now() - 3600 * 1000 * 4), duration: '6h 0m' },
    { id: 'HIST002', truckNumber: 'AP09IJ7890', product: 'Container', timeIn: new Date(Date.now() - 3600 * 1000 * 12), timeOut: new Date(Date.now() - 3600 * 1000 * 8), duration: '4h 0m' },
];
let tokenCounter = 4;

// API to interact with the "database"
export const getParkedVehicles = () => [...parkedVehicles];
export const getParkingHistory = () => [...parkingHistory];
export const getProducts = () => [...products];

export const getProductByName = (name: ProductCategory) => products.find(p => p.name === name);

export const getParkedCountByProduct = (product: ProductCategory) => {
    return parkedVehicles.filter(v => v.product === product).length;
}

export const addParkingRecord = (truckNumber: string, product: ProductCategory): { success: boolean, message: string, record?: ParkingRecord } => {
    const productInfo = getProductByName(product);
    if (!productInfo) {
        return { success: false, message: 'Invalid product selected.' };
    }

    const currentParked = getParkedCountByProduct(product);
    if (currentParked >= productInfo.maxSlots) {
        return { success: false, message: `No available slots for ${product}.` };
    }

    const token = `TKN${String(tokenCounter++).padStart(3, '0')}`;
    const newRecord: ParkingRecord = {
        id: token,
        truckNumber,
        product,
        timeIn: new Date(),
    };

    parkedVehicles.push(newRecord);
    return { success: true, message: 'Vehicle checked in successfully.', record: newRecord };
}

export const completeParkingRecord = (id: string): { success: boolean, message: string, record?: ParkingRecord } => {
    const vehicleIndex = parkedVehicles.findIndex(v => v.id === id);
    if (vehicleIndex === -1) {
        return { success: false, message: 'Vehicle not found.' };
    }

    const [vehicle] = parkedVehicles.splice(vehicleIndex, 1);
    
    const timeOut = new Date();
    const durationMs = timeOut.getTime() - vehicle.timeIn.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    vehicle.timeOut = timeOut;
    vehicle.duration = `${hours}h ${minutes}m`;

    parkingHistory.unshift(vehicle);
    return { success: true, message: 'Vehicle checked out successfully.', record: vehicle };
}
