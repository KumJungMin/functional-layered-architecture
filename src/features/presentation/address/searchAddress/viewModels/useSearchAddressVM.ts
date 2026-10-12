import { useEffect, useRef, useState } from 'react';
import { addressFeature } from '../../address.feature';
import type {
  Address,
  SearchAddressRequest,
} from '../../../../mapping/address/address.mapper';

export function useSearchAddressVM(feature = addressFeature) {
  const [request, setRequest] = useState<SearchAddressRequest>({
    searchText: '',
    fields: '',
    sortedBy: 'asc',
    country: '',
  });
  const [result, setResult] = useState<Address | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const active = useRef(0);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      active.current += 1;
    };
  }, []);

  async function search() {
    const id = ++active.current;
    setIsSearching(true);
    setError('');
    setResult(null);
    try {
      const response = await feature.searchAddress(request);
      if (!mounted.current || id !== active.current) return;
      if (response.type === 'error') {
        setError(response.message);
        return;
      }
      await feature.saveAddress(response.data);
      if (mounted.current && id === active.current) setResult(response.data);
    } catch (cause) {
      if (mounted.current && id === active.current)
        setError(
          cause instanceof Error ? cause.message : 'Unexpected error occurred',
        );
    } finally {
      if (mounted.current && id === active.current) setIsSearching(false);
    }
  }
  return { request, setRequest, result, error, isSearching, search };
}
