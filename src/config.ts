// API Configuration
export const config = {
  apiBaseUrl: 'http://localhost:5000',
  endpoints: {
    data: '/data',
  },
};

// Helper to build API URLs
export const getApiUrl = (endpoint: keyof typeof config.endpoints): string => {
  return `${config.apiBaseUrl}${config.endpoints[endpoint]}`;
};

// Clause API URLs
export const getClauseUrl = (docId: string, clauseIndex?: number): string => {
  const base = `${config.apiBaseUrl}/data/${docId}/clauses`;
  return clauseIndex !== undefined ? `${base}/${clauseIndex}` : base;
};

// Field API URLs
export const getFieldUrl = (docId: string, fieldId?: string): string => {
  const base = `${config.apiBaseUrl}/data/${docId}/fields`;
  return fieldId ? `${base}/${fieldId}` : base;
};
