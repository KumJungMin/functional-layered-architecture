import { addressApi } from '../../data/source/api/address.api';
import { addressStore } from '../../data/source/store/address.store';
import { createAddressRepository } from '../../data/repository/address.repository';
import { createSearchAddressUseCase } from '../../domain/usecase/address/searchAddress.usecase';
import { createSaveAddressUseCase } from '../../domain/usecase/address/saveAddress.usecase';

export function createAddressFeature(
  dependencies: Parameters<typeof createAddressRepository>[0],
) {
  const repository = createAddressRepository(dependencies);
  return {
    searchAddress: createSearchAddressUseCase(repository.searchAddress),
    saveAddress: createSaveAddressUseCase(repository.saveAddress),
    getAddress: repository.getAddress,
  };
}
export const addressFeature = createAddressFeature({
  api: addressApi,
  store: addressStore,
});
