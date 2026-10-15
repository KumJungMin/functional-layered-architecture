import 'reflect-metadata';
import { Expose, Transform } from 'class-transformer';

export interface SearchAddressRequestDTO {
  SEARCH_TXT: string;
  FIELDS: string;
  SORT: boolean;
  COUNTRY: string;
}

export interface SearchAddressResponseDTO {
  ID: string;
  TYPE: string;
  TITLE: string;
  DETAIL: string;
}

export interface SearchAddressRequest {
  searchText: string;
  fields: string;
  sortedBy: 'asc' | 'desc';
  country: string;
}

export interface Address {
  id: string;
  type: string;
  title: string;
  detail: string;
}

function toSortFlag(value: unknown): boolean {
  if (value == null) throw new Error("Missing code value for 'SORT'.");

  switch (String(value)) {
    case 'asc':
      return true;
    case 'desc':
      return false;
    default:
      throw new Error("No mapped value for 'SORT'.");
  }
}

// Repository에서 변환에 사용하고, 다른 계층에는 일반 객체를 전달한다.
export class SearchAddressRequestPayload implements SearchAddressRequestDTO {
  @Expose({ name: 'searchText' satisfies keyof SearchAddressRequest })
  @Transform(({ value }) => value ?? '', { toClassOnly: true })
  SEARCH_TXT!: string;

  @Expose({ name: 'fields' satisfies keyof SearchAddressRequest })
  @Transform(({ value }) => value ?? '', { toClassOnly: true })
  FIELDS!: string;

  @Expose({ name: 'sortedBy' satisfies keyof SearchAddressRequest })
  @Transform(({ value }) => toSortFlag(value), { toClassOnly: true })
  SORT!: boolean;

  @Expose({ name: 'country' satisfies keyof SearchAddressRequest })
  @Transform(({ value }) => value ?? '', { toClassOnly: true })
  COUNTRY!: string;
}

export class AddressModel implements Address {
  @Expose({ name: 'ID' satisfies keyof SearchAddressResponseDTO })
  @Transform(({ value }) => value ?? '', { toClassOnly: true })
  id!: string;

  @Expose({ name: 'TYPE' satisfies keyof SearchAddressResponseDTO })
  @Transform(({ value }) => value ?? '', { toClassOnly: true })
  type!: string;

  @Expose({ name: 'TITLE' satisfies keyof SearchAddressResponseDTO })
  @Transform(({ value }) => value ?? '', { toClassOnly: true })
  title!: string;

  @Expose({ name: 'DETAIL' satisfies keyof SearchAddressResponseDTO })
  @Transform(({ value }) => value ?? '', { toClassOnly: true })
  detail!: string;
}
