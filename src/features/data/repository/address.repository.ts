import {
  searchAddressRequestMapper,
  searchAddressResponseMapper,
} from '../../mapping/address/address.mapper';
import type {
  Address,
  SearchAddressRequest,
  SearchAddressRequestDTO,
  SearchAddressResponseDTO,
} from '../../mapping/address/address.mapper';

export function createAddressRepository({
  api,
  store,
}: {
  api: {
    searchAddress: (
      request: SearchAddressRequestDTO,
    ) => Promise<SearchAddressResponseDTO>;
  };
  store: {
    getAddress: () => Address | null;
    setAddress: (address: Address) => void;
  };
}) {
  return {
    async searchAddress(request: SearchAddressRequest): Promise<Address> {
      const response = await api.searchAddress(
        searchAddressRequestMapper(request),
      );
      return searchAddressResponseMapper(response);
    },
    saveAddress: (address: Address) => store.setAddress(address),
    getAddress: () => store.getAddress(),
  };
}
