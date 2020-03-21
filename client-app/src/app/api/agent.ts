import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";
import { history } from "../..";
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/user";

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost:5000/api";
}

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if(token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
})

axios.interceptors.response.use((res) => res, (error) => {

  if(error.message === 'Network Error' && !error.response) {
    toast.error('Network error');
    return;
  }

  const {status, data, config} = error.response;

  if(status === 404)
    history.push('/notfound');

  if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))
    history.push('/notfound');

  if(status === 500)
    toast.error('Server error');

  throw error.response;

})

const activitiesURL = "/activities";
const userURL = "/user"
const responseBody = (response: AxiosResponse) => response.data;
const sleep = (ms: number) => (response: AxiosResponse) => {
  return new Promise<AxiosResponse>((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, ms);
  })
}

const Requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
};

const Activities = {
  list: (): Promise<IActivity[]> => Requests.get(activitiesURL),
  details: (id: string): Promise<IActivity> =>
    Requests.get(`${activitiesURL}/${id}`),
  create: (activity: IActivity) => Requests.post(activitiesURL, activity),
  update: (activity: IActivity) =>
    Requests.put(`${activitiesURL}/${activity.id}`, activity),
  delete: (id: string) => Requests.delete(`${activitiesURL}/${id}`)
};

const User  = {
  current: ():Promise<IUser> => Requests.get(`${userURL}`),
  login: (user: IUserFormValues): Promise<IUser> => Requests.post(`${userURL}/login`, user),
  register: (user: IUserFormValues): Promise<IUser> => Requests.post(`${userURL}/register`, user)
}

export default {
  Activities,
  User
};
