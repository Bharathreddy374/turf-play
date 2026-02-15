export interface Turf {
    id: number;
    name: string;
    description?: string | null;
    location: string;
    address?: string | null;
    city: string;
    state?: string | null;
    pincode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    images: string[];
    pricePerHour: number;
    sportTypes: string[];
    amenities: string[];
    openTime: string;
    closeTime: string;
    isActive: boolean;
    ownerId: number;
    owner?: {
        id: number;
        fullname: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface TurfFormData {
    name: string;
    description: string;
    location: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: string;
    longitude: string;
    images: string[];
    pricePerHour: string;
    sportTypes: string[];
    amenities: string[];
    openTime: string;
    closeTime: string;
    isActive: boolean;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    status: string | null;
}

export interface Booking {
    id: number;
    userId: number;
    turfId: number;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes?: string | null;
    user?: {
        id: number;
        fullname: string;
        email: string;
    };
    turf?: {
        id: number;
        name: string;
        location: string;
        city: string;
        images?: string[];
        pricePerHour: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface BookingStats {
    totalBookings: number;
    pendingCount: number;
    confirmedCount: number;
    cancelledCount: number;
    completedCount: number;
    totalRevenue: number;
    recentBookings: Booking[];
}
