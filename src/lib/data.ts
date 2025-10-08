import type { Product, ParkingRecord, ProductCategory } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

export const products: Product[] = [
  { id: 'LPG', name: 'LPG', maxSlots: 100, iconName: 'Flame' },
  { id: 'Propylene', name: 'Propylene', maxSlots: 77, iconName: 'TestTube2' },
  { id: 'Bitumen Bulk', name: 'Bitumen Bulk', maxSlots: 25, iconName: 'Droplets' },
  { id: 'ATF', name: 'ATF', maxSlots: 40, iconName: 'Plane' },
  { id: 'Container', name: 'Container', maxSlots: 30, iconName: 'Container' },
  { id: 'Chemical', name: 'Chemical', maxSlots: 20, iconName: 'FlaskConical' },
  { id: 'Sulphur', name: 'Sulphur', maxSlots: 12, iconName: 'Sparkles' },
];

const generateMockData = () => {
    const parked: ParkingRecord[] = [];
    const history: ParkingRecord[] = [];
    let token = 1;

    // Generate some currently parked vehicles
    parked.push({ id: `TKN${String(token++).padStart(3, '0')}`, truckNumber: 'MH04AB1234', product: 'LPG', timeIn: new Date(Date.now() - 3600 * 1000 * 5) });
    parked.push({ id: `TKN${String(token++).padStart(3, '0')}`, truckNumber: 'GJ01CD5678', product: 'Propylene', timeIn: new Date(Date.now() - 3600 * 1000 * 2) });
    parked.push({ id: `TKN${String(token++).padStart(3, '0')}`, truckNumber: 'KA05EF9012', product: 'LPG', timeIn: new Date(Date.now() - 3600 * 1000 * 26) }); // Overstaying

    // Generate history for the last 2 years
    const now = new Date();
    for (let i = 0; i < 200; i++) {
        const timeOut = new Date(now.getTime() - Math.random() * 2 * 365 * 24 * 3600 * 1000);
        const durationHours = Math.random() * 20 + 1;
        const timeIn = new Date(timeOut.getTime() - durationHours * 3600 * 1000);
        const duration = `${Math.floor(durationHours)}h ${Math.floor((durationHours % 1) * 60)}m`;
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
        history.push({
            id: `HIST${String(i + 1).padStart(3, '0')}`,
            truckNumber: `XX${Math.floor(Math.random()*9)}${Math.floor(Math.random()*9)}YY${Math.floor(Math.random()*9000)+1000}`,
            product: randomProduct.id,
            timeIn,
            timeOut,
            duration,
        });
    }

    return { parked, history, token };
};

const mockData = generateMockData();

// In-memory "database"
let parkedVehicles: ParkingRecord[] = mockData.parked;
let parkingHistory: ParkingRecord[] = mockData.history.sort((a,b) => b.timeIn.getTime() - a.timeIn.getTime());
let tokenCounter = mockData.token;

// API to interact with the "database"
export const getParkedVehicles = () => [...parkedVehicles];
export const getParkingHistory = () => [...parkingHistory];
export const getProducts = () => [...products.map(p => {
    const Icon = LucideIcons[p.iconName as keyof typeof LucideIcons] as React.ElementType;
    return { ...p, icon: Icon };
})];

export const getProductById = (id: string) => getProducts().find(p => p.id === id);
export const getProductByName = (name: ProductCategory) => getProducts().find(p => p.name === name);

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
