import { PrismaService } from "../../common/prisma/prisma.service";
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverview(startDate?: string, endDate?: string): Promise<{
        totalReservations: number;
        byStatus: {
            pending: number;
            contacted: number;
            confirmed: number;
            completed: number;
            closed: number;
        };
        stores: number;
        products: number;
        packages: number;
    }>;
    getReservationTrend(days?: number): Promise<{
        dates: string[];
        data: number[];
    }>;
    getStoreDistribution(): Promise<{
        name: string;
        count: number;
    }[]>;
    getFunnel(): Promise<{
        stage: string;
        count: number;
        rate: string;
    }[]>;
    getTopProducts(limit?: number): Promise<{
        name: string;
        count: number;
    }[]>;
}
