export function createServiceCodeLocal(
  getStorage: () => Storage = () => sessionStorage,
) {
  return {
    getLanguageCode: () => getStorage().getItem('languageCode') || 'en',
    setLanguageCode: (code: string) =>
      getStorage().setItem('languageCode', code),
  };
}
