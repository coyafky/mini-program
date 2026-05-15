export declare class CreateReservationDto {
    storeId: string;
    productId?: string;
    packageId?: string;
    userPhone: string;
    carModel: string;
    appointmentDate: string;
    timeSlot?: string;
    remark?: string;
}
export declare class UpdateReservationStatusDto {
    status: string;
    handleRemark?: string;
}
