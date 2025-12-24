// API Configuration
export const config = {
  apiBaseUrl: 'http://localhost:5000',
  endpoints: {
    data: '/data',
  },
};

export const getApiUrl = (endpoint: keyof typeof config.endpoints): string => {
  return `${config.apiBaseUrl}${config.endpoints[endpoint]}`;
};
