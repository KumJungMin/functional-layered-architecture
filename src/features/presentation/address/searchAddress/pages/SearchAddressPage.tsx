import { useState } from 'react';
import { useSearchAddressVM } from '../viewModels/useSearchAddressVM';
import { addressFeature } from '../../address.feature';

export function SearchAddressPage({
  feature = addressFeature,
}: {
  feature?: typeof addressFeature;
}) {
  const vm = useSearchAddressVM(feature);
  const [showTitle, setShowTitle] = useState(true);
  return (
    <main>
      <h1>주소 검색</h1>
      <button
        type="button"
        onClick={() => setShowTitle((value) => !value)}
        aria-expanded={showTitle}
      >
        {showTitle ? '검색 폼 숨기기' : '검색 폼 표시하기'}
      </button>
      {showTitle && (
        <section>
          <h2>주소 찾기</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void vm.search();
            }}
          >
            <label>
              검색어
              <input
                value={vm.request.searchText}
                onChange={(event) =>
                  vm.setRequest({
                    ...vm.request,
                    searchText: event.target.value,
                  })
                }
                placeholder="주소 입력"
              />
            </label>
            <label>
              검색 필드
              <input
                value={vm.request.fields}
                onChange={(event) =>
                  vm.setRequest({ ...vm.request, fields: event.target.value })
                }
              />
            </label>
            <label>
              정렬
              <select
                value={vm.request.sortedBy}
                onChange={(event) =>
                  vm.setRequest({
                    ...vm.request,
                    sortedBy: event.target.value as 'asc' | 'desc',
                  })
                }
              >
                <option value="asc">오름차순</option>
                <option value="desc">내림차순</option>
              </select>
            </label>
            <label>
              국가 코드
              <input
                value={vm.request.country}
                onChange={(event) =>
                  vm.setRequest({ ...vm.request, country: event.target.value })
                }
              />
            </label>
            <button disabled={vm.isSearching} type="submit">
              {vm.isSearching ? '검색 중…' : '검색'}
            </button>
          </form>
        </section>
      )}
      {vm.error && <p role="alert">{vm.error}</p>}
      {vm.result && (
        <section aria-live="polite">
          <h2>{vm.result.title}</h2>
          <p>{vm.result.detail}</p>
          <p>주소를 저장했습니다.</p>
        </section>
      )}
    </main>
  );
}
