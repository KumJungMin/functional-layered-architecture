import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchAddressPage } from '../src/features/presentation/address/searchAddress/pages/SearchAddressPage';
import { createAddressFeature } from '../src/features/presentation/address/address.feature';
import { createAddressApi } from '../src/features/data/source/api/address.api';
import { createAddressStore } from '../src/features/data/source/store/address.store';

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});
function input(label: string, value: string) {
  const element = [...host.querySelectorAll('label')]
    .find((node) => node.textContent === label)!
    .querySelector('input')!;
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function submit() {
  await act(async () => {
    host
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}
describe('React address search page', () => {
  it('connects input → real HTTP source → DTO mapping → usecase → save and displays the result', async () => {
    const transport = vi
      .fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            ID: '1',
            TYPE: 'road',
            TITLE: '서울',
            DETAIL: '중구 101',
          }),
        ),
      );
    const store = createAddressStore();
    const feature = createAddressFeature({
      api: createAddressApi(transport),
      store,
    });
    act(() => root.render(<SearchAddressPage feature={feature} />));
    expect(transport).not.toHaveBeenCalled();
    input('검색어', '서울');
    input('검색 필드', 'all');
    input('국가 코드', 'KR');
    await submit();
    expect(JSON.parse(transport.mock.calls[0][1]!.body as string)).toEqual({
      SEARCH_TXT: '서울',
      FIELDS: 'all',
      SORT: true,
      COUNTRY: 'KR',
    });
    expect(host.textContent).toContain('중구 101');
    expect(host.textContent).toContain('주소를 저장했습니다.');
    expect(store.getAddress()).toEqual({
      id: '1',
      type: 'road',
      title: '서울',
      detail: '중구 101',
    });
    act(() => host.querySelector<HTMLButtonElement>('button')!.click());
    expect(host.querySelector('form')).toBeNull();
    act(() => host.querySelector<HTMLButtonElement>('button')!.click());
    expect(host.querySelector('input')!.value).toBe('서울');
    expect(transport).toHaveBeenCalledTimes(1);
  });
  it('shows loading, blocks duplicate button submits, and displays errors without saving', async () => {
    let reject!: (reason: Error) => void;
    const api = {
      searchAddress: () =>
        new Promise<never>((_resolve, fail) => {
          reject = fail;
        }),
    };
    const store = createAddressStore();
    act(() =>
      root.render(
        <SearchAddressPage feature={createAddressFeature({ api, store })} />,
      ),
    );
    await submit();
    expect(
      host.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled,
    ).toBe(true);
    expect(host.textContent).toContain('검색 중');
    await act(async () => reject(new Error('network')));
    expect(host.querySelector('[role=alert]')!.textContent).toBe(
      'Unexpected error occurred',
    );
    expect(store.getAddress()).toBeNull();
    expect(
      host.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled,
    ).toBe(false);
  });
  it('discards an older response when a newer search wins', async () => {
    let resolveFirst!: (value: {
      ID: string;
      TYPE: string;
      TITLE: string;
      DETAIL: string;
    }) => void;
    const api = {
      searchAddress: vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = resolve;
            }),
        )
        .mockResolvedValue({
          ID: '2',
          TYPE: '',
          TITLE: '새 주소',
          DETAIL: 'new',
        }),
    };
    const store = createAddressStore();
    act(() =>
      root.render(
        <SearchAddressPage feature={createAddressFeature({ api, store })} />,
      ),
    );
    await submit();
    await submit();
    await act(async () =>
      resolveFirst({ ID: '1', TYPE: '', TITLE: '이전 주소', DETAIL: 'old' }),
    );
    expect(host.textContent).toContain('새 주소');
    expect(host.textContent).not.toContain('이전 주소');
    expect(store.getAddress()?.id).toBe('2');
  });
});
