import { UserProps } from '@/types/auth.type';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import UserService from '@/services/User';
import UploadService from '@/services/Upload';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: {} as UserProps,
    userList: [] as UserProps[],
    uploadList: [] as any[],
    selectedUpload: {},
    isLoading: false,
    isPreviewOpen: false,
  },

  getters: {
    getCurrentUser(state) {
      return state.currentUser;
    },

    getIsLoading(state) {
      return state.isLoading;
    },

    getIsPreviewOpen(state) {
      return state.isPreviewOpen;
    },

    getUserList(state) {
      return state.userList;
    },

    getUploadList(state) {
      return state.uploadList;
    },

    getSelectedUpload(state) {
      return state.selectedUpload;
    },
  },

  mutations: {
    setCurrentUser(state, data) {
      state.currentUser = data;
    },

    setIsLoading(state, data) {
      state.isLoading = data;
    },

    setIsPreviewOpen(state, data) {
      state.isPreviewOpen = data;
    },

    setUserList(state, data) {
      state.userList = data;
    },

    setUploadList(state, data) {
      state.uploadList = data;
    },

    setSelectedUpload(state, data) {
      state.selectedUpload = data;
    },
  },

  actions: {
    saveAccessData({ commit }, data) {
      if (data.token) {
        commit('setCurrentUser', data);
      }
    },

    async getAllUsers({ commit }) {
      try {
        commit('setIsLoading', true);
        commit('setUserList', await UserService.getAll());
      } catch (error: any) {
        throw new Error(error);
      } finally {
        commit('setIsLoading', false);
      }
    },

    async deleteUser({ commit }, id) {
      try {
        const userList = this.state.userList;
        const index = this.state.userList.findIndex((user) => user.id === id);
        userList.splice(index, 1);
        commit('setUserList', userList);

        UserService.delete(id);
      } catch (error: any) {
        throw new Error(error);
      }
    },

    async getUploads({ commit }) {
      try {
        commit('setIsLoading', true);
        commit('setUploadList', await UploadService.getAllByUser());
      } catch (error: any) {
        throw new Error(error);
      } finally {
        commit('setIsLoading', false);
      }
    },

    async createUpload({ commit }, file) {
      const uploadList = this.state.uploadList;
      let newUpload: any = {};

      try {
        commit('setIsLoading', true);
        newUpload = await UploadService.create(file);
        uploadList.push(newUpload);
      } catch (error: any) {
        return {
          error,
        };
      } finally {
        commit('setIsLoading', false);
        commit('setUploadList', uploadList);
        commit('setSelectedUpload', newUpload);
        commit('setIsPreviewOpen', true);
      }
    },

    async deleteUpload({ commit }, id) {
      try {
        const uploadList = this.state.uploadList;
        const index = this.state.uploadList.findIndex((user) => user.id === id);
        uploadList.splice(index, 1);
        commit('setUploadList', uploadList);

        UploadService.delete(id);
      } catch (error: any) {
        throw new Error(error);
      }
    },
  },

  plugins: [
    createPersistedState({
      storage: window.localStorage,
    }),
  ],
});
