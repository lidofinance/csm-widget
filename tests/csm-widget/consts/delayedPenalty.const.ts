export const REPORT_GENERAL_DELAYED_PENALTY_ROLE =
  'REPORT_GENERAL_DELAYED_PENALTY_ROLE';

// Amounts on the forms and tables are shown with 4 decimals
export const AMOUNT_TOLERANCE = 0.0002;

export const parseAmount = (text: string | null) =>
  parseFloat((text ?? '').replace(/[^\d.]/g, ''));
