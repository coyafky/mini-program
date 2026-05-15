import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/create-package.dto';
export declare class PackagesController {
    private readonly packagesService;
    constructor(packagesService: PackagesService);
    findAll(page?: string, pageSize?: string): Promise<{
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
                packageId: string;
                carModelId: string;
            })[];
            packageProducts: ({
                product: {
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
                };
            } & {
                id: string;
                productId: string;
                packageId: string;
            })[];
        } & {
            id: string;
            status: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            deletedAt: Date | null;
            mainImages: string | null;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal | null;
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
            packageId: string;
            carModelId: string;
        })[];
        packageProducts: ({
            product: {
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
            };
        } & {
            id: string;
            productId: string;
            packageId: string;
        })[];
    } & {
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deletedAt: Date | null;
        mainImages: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    create(dto: CreatePackageDto): Promise<{
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
            packageId: string;
            carModelId: string;
        })[];
        packageProducts: ({
            product: {
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
            };
        } & {
            id: string;
            productId: string;
            packageId: string;
        })[];
    } & {
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deletedAt: Date | null;
        mainImages: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, dto: UpdatePackageDto): Promise<{
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
            packageId: string;
            carModelId: string;
        })[];
        packageProducts: ({
            product: {
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
            };
        } & {
            id: string;
            productId: string;
            packageId: string;
        })[];
    } & {
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deletedAt: Date | null;
        mainImages: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        deletedAt: Date | null;
        mainImages: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
