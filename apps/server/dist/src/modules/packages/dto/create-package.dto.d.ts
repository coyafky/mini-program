export declare class CreatePackageDto {
    name: string;
    mainImages?: string;
    price?: number;
    description?: string;
    productIds?: string[];
    carModelIds?: string[];
}
export declare class UpdatePackageDto {
    name?: string;
    mainImages?: string;
    price?: number;
    description?: string;
    status?: number;
    productIds?: string[];
    carModelIds?: string[];
}
