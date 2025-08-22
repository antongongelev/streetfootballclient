import {config} from '../config';
import {ApiError, ApiResponse} from './types';

export class ApiClient {
    private static async request<T>(
        method: 'GET' | 'POST' | 'DELETE',
        endpoint: string,
        body?: any
    ): Promise<ApiResponse<T>> {
        const url = `${config.api.baseUrl}${endpoint}`;
        const headers = {
            ...config.api.defaultHeaders
        };

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: AbortSignal.timeout(config.api.timeout)
            });

            if (response.status === 204) {
                return {data: null as unknown as T, status: response.status};
            }

            const data = await response.json();

            if (!response.ok) {
                throw {
                    message: data.message || 'Request failed',
                    status: response.status,
                    code: data.code
                } as ApiError;
            }

            return {data, status: response.status};
        } catch (error) {
            console.error(`API request failed: ${method} ${endpoint}`, error);
            throw this.normalizeError(error);
        }
    }

    // Специальный метод ТОЛЬКО для FormData
    static async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        const url = `${config.api.baseUrl}${endpoint}`;

        try {
            // ВАЖНО: Не передаем headers вообще!
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(config.api.timeout)
            });

            if (response.status === 204) {
                return {data: null as unknown as T, status: response.status};
            }

            const data = await response.text();

            if (!response.ok) {
                throw {
                    message: data.message || 'Upload failed',
                    status: response.status,
                    code: data.code
                } as ApiError;
            }

            return {data, status: response.status};
        } catch (error) {
            console.error(`File upload failed: ${endpoint}`, error);
            throw this.normalizeError(error);
        }
    }

    private static normalizeError(error: any): ApiError {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return {message: 'Request timeout', code: 'TIMEOUT'};
        }

        return {
            message: error.message || 'Network error',
            status: error.status,
            code: error.code || 'NETWORK_ERROR'
        };
    }

    // Public methods
    static get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>('GET', endpoint);
    }

    static post<T>(endpoint: string, body: any, isFormData: boolean = false): Promise<ApiResponse<T>> {
        return this.request<T>('POST', endpoint, body, isFormData);
    }

    static delete(endpoint: string): Promise<ApiResponse<void>> {
        return this.request<void>('DELETE', endpoint);
    }
}