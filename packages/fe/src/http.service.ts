/**
 * HTTP Service Implementation
 * Uses Node.js built-in fetch for HTTP operations
 */

export class HttpService {
  /**
   * Make HTTP request
   */
  async request<T = any>(config: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    retries?: number;
  }): Promise<{ data: T; status: number; headers: Record<string, string> }> {
    const { url, method = 'GET', headers = {}, body, timeout = 30000, retries = 3 } = config;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        let data: T;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = (await response.text()) as T;
        }

        return {
          data,
          status: response.status,
          headers: responseHeaders,
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('HTTP request failed');
  }

  /**
   * Make GET request
   */
  async get<T = any>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'GET', headers });
    return response.data;
  }

  /**
   * Make POST request
   */
  async post<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'POST', body, headers });
    return response.data;
  }

  /**
   * Make PUT request
   */
  async put<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'PUT', body, headers });
    return response.data;
  }

  /**
   * Make DELETE request
   */
  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.request<T>({ url, method: 'DELETE', headers });
    return response.data;
  }
}
