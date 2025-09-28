export function getCurrentHubIdFromStorage(): string | null {
  try {
    return localStorage.getItem('impersonate_hub');
  } catch (err) {
    return null;
  }
}

export function clearImpersonationInStorage() {
  try {
    localStorage.removeItem('impersonate_hub');
  } catch (err) {
    // ignore
  }
}
