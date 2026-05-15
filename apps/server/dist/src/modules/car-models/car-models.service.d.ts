import { PrismaService } from "../../common/prisma/prisma.service";
export declare class CarModelsService {
    private prisma;
    constructor(prisma: PrismaService);
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
