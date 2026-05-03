import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_LARAVEL_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});



// axiosClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // If the backend returns 401, the session is gone in the DB
//         if (error.response && error.response.status === 401) {
//             // Redirect to login (or clear your React Auth state)
//             window.location.href = ''; 
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosClient;
