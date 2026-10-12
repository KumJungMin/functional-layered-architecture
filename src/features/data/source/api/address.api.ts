import type {
  SearchAddressRequestDTO,
  SearchAddressResponseDTO,
} from '../../../mapping/address/address.mapper';

export function createAddressApi(
  request: typeof fetch = (...args) => fetch(...args),
) {
  return {
    async searchAddress(
      body: SearchAddressRequestDTO,
    ): Promise<SearchAddressResponseDTO> {
      const response = await request('/address/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok)
        throw new Error(`Address search failed (${response.status})`);
      // The original repository consumes the response DTO directly. No envelope is assumed.
      return response.json() as Promise<SearchAddressResponseDTO>;
    },
  };
}
export const addressApi = createAddressApi();
