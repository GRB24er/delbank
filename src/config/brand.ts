// ============================================================
// FREGETRUST — Central Brand Configuration
// All brand references must be imported from this file.
// ============================================================

export const BRAND = {
  name: 'Fregetrust',
  shortName: 'FGT',
  tagline: 'Trust. Built Different.',
  fullLegalName: 'Fregetrust Financial Institution',
  email: 'admin@fregetrust.com',
  supportEmail: 'admin@fregetrust.com',
  domain: 'fregetrust.com',
  website: 'https://www.fregetrust.com',
  nmls: 'NMLS #2025001',
  copyright: `© ${new Date().getFullYear()} Fregetrust Financial Institution. All rights reserved.`,
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
