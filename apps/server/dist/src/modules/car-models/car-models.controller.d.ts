import { CarModelsService } from './car-models.service';
export declare class CarModelsController {
    private readonly carModelsService;
    constructor(carModelsService: CarModelsService);
    findAll(brand?: string): Promise<{
        id: string;
        createdAt: Date;
        brand: string;
        model: string;
        year: string | null;
    }[]>;
    findBrands(): Promise<string[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        brand: string;
        model: string;
        year: string | null;
    }>;
    create(data: {
        brand: string;
        model: string;
        year?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        brand: string;
        model: string;
        year: string | null;
    }>;
    update(id: string, data: {
        brand?: string;
        model?: string;
        year?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        brand: string;
        model: string;
        year: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        brand: string;
        model: string;
        year: string | null;
    }>;
}
