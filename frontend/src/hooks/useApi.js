import { useState, useCallback } from 'react';

const useApi = (baseURL = import.meta.env.VITE_SERVER_URL) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
        async (endpoint, options = {}) => {
            const {
                method = 'GET',
                body = null,
                headers = {},
                ...customConfig
            } = options;

            setLoading(true);
            setError(null);

            const config = {
                method,
                cache: 'no-store',
                credentials: 'include',
                ...customConfig,
            };

            // ✅ Auto-handle FormData vs JSON
            if (body && method !== 'GET' && method !== 'DELETE') {
                if (body instanceof FormData) {
                    // Don’t set Content-Type, browser will do it
                    config.body = body;
                    config.headers = { ...headers };
                } else {
                    // Normal JSON request
                    config.body = JSON.stringify(body);
                    config.headers = {
                        'Content-Type': 'application/json',
                        ...headers,
                    };
                }
            } else {
                config.headers = {
                    'Content-Type': 'application/json',
                    ...headers,
                };
            }

            try {
                const url = `${baseURL}${endpoint}`;
                const response = await fetch(url, config);
                const contentType = response.headers.get('content-type');
                let data;

                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                if (!response.ok) {
                    throw new Error(
                        data.message || `HTTP error! status: ${response.status}`
                    );
                }

                setLoading(false);
                return {
                    data: data?.data,
                    success: data?.success ?? true,
                    message: data?.message,
                    statusCode: data?.statusCode,
                };
            } catch (err) {
                setError(err.message);
                setLoading(false);
                throw err;
            }
        },
        [baseURL]
    );

    // Convenience methods
    const get = useCallback(
        (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
        [request]
    );

    const post = useCallback(
        (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
        [request]
    );

    const put = useCallback(
        (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
        [request]
    );

    const del = useCallback(
        (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
        [request]
    );

    return { loading, error, get, post, put, delete: del };
};

export default useApi;
