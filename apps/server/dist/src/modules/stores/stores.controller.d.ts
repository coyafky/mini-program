import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto, StoreProductConfigDto } from './dto/create-store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    findAll(page?: string, pageSize?: string): Promise<{
        list: {
            id: string;
            status: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string;
            phone: string;
            businessHours: string | null;
            deletedAt: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findActive(): Promise<{
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        phone: string;
        businessHours: string | null;
        deletedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        phone: string;
        businessHours: string | null;
        deletedAt: Date | null;
    }>;
    create(dto: CreateStoreDto): Promise<{
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        phone: string;
        businessHours: string | null;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateStoreDto): Promise<{
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        phone: string;
        businessHours: string | null;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string;
        phone: string;
        businessHours: string | null;
        deletedAt: Date | null;
    }>;
    getStoreProducts(id: string, category?: string): Promise<{
        products: {
            id: string;
            status: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            deletedAt: Date | null;
            mainImages: string | null;
            priceDescription: string | null;
            brief: string | null;
            description: string | null;
            specifications: string | null;
            category: string | null;
        }[];
        packages: {
            id: string;
            status: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            deletedAt: Date | null;
            mainImages: string | null;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    }>;
    configureProducts(id: string, dto: StoreProductConfigDto): Promise<{
        message: string;
    }>;
}
