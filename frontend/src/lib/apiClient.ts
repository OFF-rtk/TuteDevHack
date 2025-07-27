import axios from 'axios';
import { useAppStore } from '@/stores/appStores';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(config => {
    const session = useAppStore.getState().session;
    if(session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export default apiClient;