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
