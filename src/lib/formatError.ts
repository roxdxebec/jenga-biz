export function formatError(error: any): string {
  if (!error) return 'Unknown error';
  // Supabase PostgrestError
  if (typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') return error.message;
    if ('error' in error && typeof error.error === 'string') return error.error;
    if ('status' in error && 'statusText' in error) return `${error.status} ${error.statusText}`;
    try {
      return JSON.stringify(error);
    } catch (e) {
      return String(error);
    }
  }
  return String(error);
}
