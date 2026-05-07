// ============================================================
// STRANGEFREGETRUST — Central Brand Configuration
// All brand references must be imported from this file.
// ============================================================

export const BRAND = {
  name: 'Strangefregetrust',
  shortName: 'SFT',
  tagline: 'Trust. Built Different.',
  fullLegalName: 'Strangefregetrust Financial Institution',
  email: 'admin@strangefregetrust.com',
  supportEmail: 'admin@strangefregetrust.com',
  domain: 'strangefregetrust.com',
  website: 'https://www.strangefregetrust.com',
  nmls: 'NMLS #2025001',
  copyright: `© ${new Date().getFullYear()} Strangefregetrust Financial Institution. All rights reserved.`,
  address: '100 Financial District, Suite 2500, New York, NY 10005',
  colors: {
    primary: '#0F172A',    // Deep Navy
    accent: '#B8960C',     // Gold
    blue: '#1E40AF',       // Brand Blue
    lightBlue: '#3B82F6',  // Light Blue
  },
} as const;

// Legacy constants — kept for backward compatibility
export const OWNER_EMAIL = BRAND.email;
export const ADMIN_EMAILS = [BRAND.email];
export const BANK_NAME = BRAND.name;
export const SUPPORT_EMAIL = BRAND.supportEmail;
