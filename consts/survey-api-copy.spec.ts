import { SURVEY_API_COPY, getSurveyApiCopy } from './survey-api-copy';

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
});
