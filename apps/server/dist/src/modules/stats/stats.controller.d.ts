import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
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
    getTrend(days?: string): Promise<{
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
    getTopProducts(limit?: string): Promise<{
        name: string;
        count: number;
    }[]>;
}
