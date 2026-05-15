/**
 * 生成预约单号
 * 格式: YY + MMDD + 6位随机数字
 * 例如: YY261113000001
 */
export function generateOrderNo(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `YY${year}${month}${day}${random}`;
}
