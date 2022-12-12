import axios from 'axios';

export const ApiService = {
  init(baseURL: string): any {
    axios.defaults.baseURL = baseURL;
  },

  get(resource: string, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .get(resource, { headers })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  },

  post(
    resource: string,
    data: any,
    headers?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .post(resource, data, { headers })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          if (error && error.response && error.response.data) {
            reject(error.response.data.message);
          } else {
            reject(error);
          }
        });
    });
  },

  delete(resource: string, headers?: any) {
    return new Promise((resolve, reject) => {
      axios
        .delete(resource, { headers })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error.response.data.message);
        });
    });
  },
};

export default ApiService;
