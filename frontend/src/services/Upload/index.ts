import ApiService from '@/services/api.service';
import store from '@/store';

const UploadService = {
  getAllByUser: async (): Promise<any> => {
    try {
      const { data } = await ApiService.get(
        `/upload/author/${store.getters.getCurrentUser.id}`,
        {
          Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
        }
      );

      return data;
    } catch (error) {
      return {
        error,
      };
    }
  },

  create: async (file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await ApiService.post('/upload', formData, {
        Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
        'Content-Type': 'multipart/form-data',
      });

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },

  delete: async (id: string): Promise<any> => {
    try {
      await ApiService.delete(`/upload/${id}`, {
        Authorization: `Bearer ${store.getters.getCurrentUser.token}`,
      });
    } catch (error) {
      return {
        error,
      };
    }
  },
};

export default UploadService;
