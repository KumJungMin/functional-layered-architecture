import type {
  Address,
  SearchAddressRequest,
} from '../../../mapping/address/address.mapper';

export type SearchAddressResult =
  { type: 'success'; data: Address } | { type: 'error'; message: string };
export function createSearchAddressUseCase(
  search: (request: SearchAddressRequest) => Promise<Address>,
) {
  return async (
    request: SearchAddressRequest,
  ): Promise<SearchAddressResult> => {
    try {
      return { type: 'success', data: await search(request) };
    } catch (error) {
      return {
        type: 'error',
        message:
          error instanceof Error && error.name === 'BusinessError'
            ? error.message
            : 'Unexpected error occurred',
      };
    }
  };
}
