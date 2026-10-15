import { plainToInstance } from 'class-transformer';
import type { ClassTransformOptions } from 'class-transformer';
import {
  AddressModel,
  SearchAddressRequestPayload,
} from '../../mapping/address/address.mapper';
import type {
  Address,
  SearchAddressRequest,
  SearchAddressRequestDTO,
  SearchAddressResponseDTO,
} from '../../mapping/address/address.mapper';

const transformationOptions: ClassTransformOptions = {
  excludeExtraneousValues: true,
  enableImplicitConversion: false,
};

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
      const response = await api.searchAddress({
        ...plainToInstance(
          SearchAddressRequestPayload,
          request,
          transformationOptions,
        ),
      });
      return {
        ...plainToInstance(AddressModel, response, transformationOptions),
      };
    },
    saveAddress: (address: Address) => store.setAddress(address),
    getAddress: () => store.getAddress(),
  };
}
