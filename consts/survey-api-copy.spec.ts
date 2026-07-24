import {
  SURVEY_API_COPY,
  getSurveyApiCopy,
  isConcurrencyRetry,
} from './survey-api-copy';

describe('survey api copy', () => {
  it('has copy for known domain codes', () => {
    expect(SURVEY_API_COPY.ICS_NOT_REJECTED).toBeDefined();
    expect(SURVEY_API_COPY.MEMBERS_ADDRESS_ALREADY_ACTIVE).toBeDefined();
  });
  it('falls back to the envelope message for unknown codes', () => {
    expect(getSurveyApiCopy('TOTALLY_NEW_CODE', 'raw msg')).toBe('raw msg');
  });
  it('returns mapped copy for a known code', () => {
    expect(getSurveyApiCopy('ICS_NOT_REJECTED', 'raw')).toMatch(/rejected/i);
  });

  it('every entry in the catalog has a non-empty string value', () => {
    Object.entries(SURVEY_API_COPY).forEach(([_key, value]) => {
      expect(typeof value).toBe('string');
      expect(value.trim().length).toBeGreaterThan(0);
    });
  });

  it('does NOT contain JWT auth codes (covered by static ERROR_META map)', () => {
    expect(SURVEY_API_COPY).not.toHaveProperty('AUTH_JWT_EXPIRED');
    expect(SURVEY_API_COPY).not.toHaveProperty('AUTH_JWT_INVALID');
    expect(SURVEY_API_COPY).not.toHaveProperty('AUTH_JWT_MISSING');
  });
});

describe('isConcurrencyRetry', () => {
  it('matches MEMBERS_CONCURRENT_SUBMISSION', () => {
    expect(isConcurrencyRetry('MEMBERS_CONCURRENT_SUBMISSION')).toBe(true);
  });
  it('matches MEMBERS_FORM_CONCURRENTLY_BOUND', () => {
    expect(isConcurrencyRetry('MEMBERS_FORM_CONCURRENTLY_BOUND')).toBe(true);
  });
  it('returns false for non-concurrency codes', () => {
    expect(isConcurrencyRetry('MEMBERS_DUPLICATE_ADDRESS')).toBe(false);
  });
  it('returns false for undefined', () => {
    expect(isConcurrencyRetry(undefined)).toBe(false);
  });
});
