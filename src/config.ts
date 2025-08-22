export const config = {
    api: {
        baseUrl: 'http://localhost:8080/api',
        timeout: 5000, // мс
        defaultHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
};