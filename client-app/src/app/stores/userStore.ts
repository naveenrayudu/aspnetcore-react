import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { tryCatchBlock } from "../common/util/util";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class UserStore {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

   @observable user: IUser | null = null;
   @computed get isLoggedIn() {
       return !!this.user;
   }

   @action login = async (values: IUserFormValues) => {
      
       const successCallback = async () => {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
                this.rootStore.commonStore.setToken(this.user.token);
                this.rootStore.modalStore.closeModal();
                history.push('/activities');
            })
       }

       const errorCallback = (e: any) => { throw e };

       await tryCatchBlock(successCallback, errorCallback)
   }

   @action register = async (values: IUserFormValues) => {
    const successCallback = async () => {
        const user = await agent.User.register(values);
        runInAction(() => {
            this.user = user;
            this.rootStore.commonStore.setToken(this.user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        })
   }

   const errorCallback = (e: any) => { throw e };

   await tryCatchBlock(successCallback, errorCallback)
   }

   @action getUser = async () => {
       const successCallback = async () => {
          const user = await agent.User.current();
          runInAction(() => {
              this.user = user;
          })
       }

       const errorCallback = (e: any) => {};

       return await tryCatchBlock(successCallback, errorCallback);
   }

   @action logout = async () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
   }
}