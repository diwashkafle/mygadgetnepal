export function extractFirebasePath(url: string): string | null {
    try {
      const decodedUrl = decodeURIComponent(url);
      const match = decodedUrl.match(/\/o\/(.+?)\?alt=/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
  