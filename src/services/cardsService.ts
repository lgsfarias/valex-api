import * as companiesRepository from '../repositories/companyRepository.js';

const isValidApiKey = async (apiKey: string) => {
  const validCompany = await companiesRepository.findByApiKey(apiKey);

  return !!validCompany;
};

export { isValidApiKey };
