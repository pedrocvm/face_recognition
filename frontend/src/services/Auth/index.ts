import ApiService from '@/services/api.service';
import store from '@/store';
import { CredentialsProps } from '@/types/auth.type';

const AuthService = {
  signin: async (credentials: CredentialsProps): Promise<any> => {
    try {
      const { data } = await ApiService.post('/auth/signin', credentials);

      return data;
    } catch (error: any) {
      return {
        error,
      };
    }
  },

  signup: async (credentials: CredentialsProps): Promise<any> => {
    try {
      const { data } = await ApiService.post('/auth/signup', credentials);

      return data;
    } catch (error) {
      return {
        error,
      };
    }
  },

  logout: (): Promise<void> => {
    localStorage.clear();
    store.commit('setIsPreviewOpen', false);
    return store.dispatch('saveAccessData', {});
  },
};

export default AuthService;
