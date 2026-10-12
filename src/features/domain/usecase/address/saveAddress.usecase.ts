import type { Address } from '../../../mapping/address/address.mapper';

export function createSaveAddressUseCase(
  save: (address: Address) => void | Promise<void>,
) {
  return async (address: Address): Promise<void> => {
    await save(address);
  };
}
