import { prisma } from "@/lib/prisma";

const DEFAULT_PLATFORM_FEE = 0.15; // 15% default

/**
 * Get the current platform fee as a decimal (e.g. 0.15 for 15%)
 * Falls back to 15% if not set in DB
 */
export async function getPlatformFee(): Promise<number> {
  try {
    const setting = await prisma.platformSetting.findUnique({
      where: { key: "platform_fee_percent" },
    });
    if (!setting) return DEFAULT_PLATFORM_FEE;
    const val = parseFloat(setting.value);
    if (isNaN(val) || val < 0 || val > 100) return DEFAULT_PLATFORM_FEE;
    return val / 100; // stored as percentage (e.g. "15"), returned as decimal (0.15)
  } catch {
    return DEFAULT_PLATFORM_FEE;
  }
}

/**
 * Get the platform fee as a percentage integer (e.g. 15 for 15%)
 */
export async function getPlatformFeePercent(): Promise<number> {
  try {
    const setting = await prisma.platformSetting.findUnique({
      where: { key: "platform_fee_percent" },
    });
    if (!setting) return 15;
    const val = parseFloat(setting.value);
    if (isNaN(val) || val < 0 || val > 100) return 15;
    return val;
  } catch {
    return 15;
  }
}

/**
 * Update the platform fee percentage
 */
export async function setPlatformFeePercent(percent: number, updatedBy?: string): Promise<void> {
  await prisma.platformSetting.upsert({
    where: { key: "platform_fee_percent" },
    update: { value: percent.toString(), updatedBy },
    create: { key: "platform_fee_percent", value: percent.toString(), updatedBy },
  });
}
