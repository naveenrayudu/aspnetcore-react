import { createContext } from "react";
import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import CommonStore from './commonStore';
import { configure } from "mobx";
import ModalStore from "./modalStore";


configure({
    enforceActions: "always"
  });
export class RootStore {
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;

    constructor() {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
    }

}


const RootStoreContext = createContext(new RootStore());
export default RootStoreContext;