"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNo = generateOrderNo;
function generateOrderNo() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    return `YY${year}${month}${day}${random}`;
}
//# sourceMappingURL=order-no.js.map