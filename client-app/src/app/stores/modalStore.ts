import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable.shallow modal : {
        open: boolean,
        content: any
    } = {
        open: false,
        content: null
    }

    @action openModal = (content: any) => {
        this.modal.open = true;
        this.modal.content = content;
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.content = null;
    }
}