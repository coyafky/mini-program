export declare class CreateProductDto {
    name: string;
    mainImages?: string;
    priceDescription?: string;
    brief?: string;
    description?: string;
    specifications?: string;
    category?: string;
    carModelIds?: string[];
}
export declare class UpdateProductDto {
    name?: string;
    mainImages?: string;
    priceDescription?: string;
    brief?: string;
    description?: string;
    specifications?: string;
    category?: string;
    status?: number;
    carModelIds?: string[];
}
