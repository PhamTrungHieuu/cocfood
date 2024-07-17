// authService.ts
import store from '@/store/store';
import { RootState } from '@/store/store';

export const getToken = (): string | null => {
    const state: RootState = store.getState();
    return state.auth.token;
};
