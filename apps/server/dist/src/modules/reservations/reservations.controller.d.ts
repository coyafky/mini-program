import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/create-reservation.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(dto: CreateReservationDto, req: any): Promise<{
        store: {
            id: string;
            status: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string;
            phone: string;
            businessHours: string | null;
            deletedAt: Date | null;
        };
        user: {
            nickname: string | null;
            phone: string | null;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        carModel: string;
        storeId: string;
        productId: string | null;
        packageId: string | null;
        userPhone: string;
        appointmentDate: Date;
        timeSlot: string | null;
        remark: string | null;
        handleRemark: string | null;
        orderNo: string;
        userId: string;
    }>;
    findMyReservations(req: any, status?: string): Promise<({
        store: {
            id: string;
            name: string;
            address: string;
            phone: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        carModel: string;
        storeId: string;
        productId: string | null;
        packageId: string | null;
        userPhone: string;
        appointmentDate: Date;
        timeSlot: string | null;
        remark: string | null;
        handleRemark: string | null;
        orderNo: string;
        userId: string;
    })[]>;
    findMyReservation(id: string, req: any): Promise<{
        store: {
            id: string;
            name: string;
            address: string;
            phone: string;
            businessHours: string | null;
        };
        statusLogs: {
            id: string;
            createdAt: Date;
            remark: string | null;
            oldStatus: string | null;
            newStatus: string;
            operatorId: string | null;
            reservationId: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        carModel: string;
        storeId: string;
        productId: string | null;
        packageId: string | null;
        userPhone: string;
        appointmentDate: Date;
        timeSlot: string | null;
        remark: string | null;
        handleRemark: string | null;
        orderNo: string;
        userId: string;
    }>;
    findAll(page?: string, pageSize?: string, status?: string, storeId?: string, startDate?: string, endDate?: string): Promise<{
        list: ({
            store: {
                id: string;
                name: string;
                phone: string;
            };
            user: {
                id: string;
                nickname: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            carModel: string;
            storeId: string;
            productId: string | null;
            packageId: string | null;
            userPhone: string;
            appointmentDate: Date;
            timeSlot: string | null;
            remark: string | null;
            handleRemark: string | null;
            orderNo: string;
            userId: string;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<{
        store: {
            id: string;
            status: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string;
            phone: string;
            businessHours: string | null;
            deletedAt: Date | null;
        };
        user: {
            id: string;
            nickname: string | null;
            phone: string | null;
            avatarUrl: string | null;
        };
        statusLogs: {
            id: string;
            createdAt: Date;
            remark: string | null;
            oldStatus: string | null;
            newStatus: string;
            operatorId: string | null;
            reservationId: string;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        carModel: string;
        storeId: string;
        productId: string | null;
        packageId: string | null;
        userPhone: string;
        appointmentDate: Date;
        timeSlot: string | null;
        remark: string | null;
        handleRemark: string | null;
        orderNo: string;
        userId: string;
    }>;
    updateStatus(id: string, dto: UpdateReservationStatusDto, req: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        carModel: string;
        storeId: string;
        productId: string | null;
        packageId: string | null;
        userPhone: string;
        appointmentDate: Date;
        timeSlot: string | null;
        remark: string | null;
        handleRemark: string | null;
        orderNo: string;
        userId: string;
    }>;
}
