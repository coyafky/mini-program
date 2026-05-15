import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        page?: number;
        pageSize?: number;
        category?: string;
        brand?: string;
        carModel?: string;
        keyword?: string;
    }): Promise<{
        list: ({
            carModelRelations: ({
                carModel: {
                    id: string;
                    createdAt: Date;
                    brand: string;
                    model: string;
                    year: string | null;
                };
            } & {
                id: string;
                productId: string;
                carModelId: string;
            })[];
        } & {
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
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<{
        carModelRelations: ({
            carModel: {
                id: string;
                createdAt: Date;
                brand: string;
                model: string;
                year: string | null;
            };
        } & {
            id: string;
            productId: string;
            carModelId: string;
        })[];
    } & {
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
    }>;
    create(dto: CreateProductDto): Promise<{
        carModelRelations: ({
            carModel: {
                id: string;
                createdAt: Date;
                brand: string;
                model: string;
                year: string | null;
            };
        } & {
            id: string;
            productId: string;
            carModelId: string;
        })[];
    } & {
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
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        carModelRelations: ({
            carModel: {
                id: string;
                createdAt: Date;
                brand: string;
                model: string;
                year: string | null;
            };
        } & {
            id: string;
            productId: string;
            carModelId: string;
        })[];
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
