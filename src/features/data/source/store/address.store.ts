import type { Address } from '../../../mapping/address/address.mapper';

export function createAddressStore() {
  let address: Address | null = null;
  return {
    getAddress: () => address,
    setAddress(value: Address) {
      address = { ...value };
    },
  };
}
export const addressStore = createAddressStore();
