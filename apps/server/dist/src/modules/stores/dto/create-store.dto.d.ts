export declare class CreateStoreDto {
    name: string;
    address: string;
    phone: string;
    businessHours?: string;
}
export declare class UpdateStoreDto {
    name?: string;
    address?: string;
    phone?: string;
    businessHours?: string;
    status?: number;
}
export declare class StoreProductConfigDto {
    productIds: string[];
    packageIds: string[];
}
