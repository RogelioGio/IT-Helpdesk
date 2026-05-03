import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axiosClient from './AxiosClient';

window.Pusher = Pusher;

export const echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axiosClient.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                }, {
                    // This prevents the "Route [login] not defined" error
                    headers: {
                        'Accept': 'application/json'
                    },
                    withCredentials: true 
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    },
})

axiosClient.interceptors.request.use((config) => {
    const socketId = echoInstance.socketId();
    if (socketId) {
        config.headers['X-Socket-ID'] = socketId;
    }
    return config;
});