import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SearchAddressPage } from './features/presentation/address/searchAddress/pages/SearchAddressPage';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchAddressPage />
  </StrictMode>,
);
