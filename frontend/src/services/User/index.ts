import ApiService from '@/services/api.service';
import store from '@/store';
import { UserProps } from '@/types/auth.type';

const UserService = {
  getAll: async (): Promise<any> => {
    try {
      const { data } = await ApiService.get('/user', {
        Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
      });

      return data;
    } catch (error) {
      return {
        error,
      };
    }
  },

  getMe: async (): Promise<UserProps> => {
    try {
      const { data } = await ApiService.get('/auth/me', {
        Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
      });

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },

  delete: async (id: string): Promise<any> => {
    try {
      await ApiService.delete(`/user/${id}`, {
        Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
      });
    } catch (error) {
      return {
        error,
      };
    }
  },
};

export default UserService;
