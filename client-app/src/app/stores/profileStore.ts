import { observable, action, runInAction, computed } from "mobx";
import { IProfile } from "../models/profile";
import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { tryCatchBlock } from "../common/util/util";
import { toast } from "react-toastify";

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable userProfile: IProfile | null = null
    @observable loadingProfile: boolean = false
    @observable uploadingPhoto: boolean = false;
    @observable settingMainPhoto: boolean = false;
    @observable deleteingPhoto: boolean = false;

    @action getUserProfile = async (userName: string) => {
        this.loadingProfile = true;
        const successCallback = async () => {
            const profile = await agent.Profiles.get(userName);
            runInAction(() => {
              this.loadingProfile = false;
              this.userProfile = profile;
            })
        }

        const errorCallback = () => {
            runInAction(() => {
                this.loadingProfile = false;
            })
        }

        return tryCatchBlock(successCallback, errorCallback);
    }

    @action uplaodPhoto = async (photo: Blob) => {
        this.uploadingPhoto = true;

        const successCallback = async () => {
            const uploadedPhoto = await agent.Profiles.uploadPhoto(photo);

            runInAction(()=> {
                this.uploadingPhoto = false;
                if(this.userProfile) {
                    this.userProfile.photos.push(uploadedPhoto);
                    if(uploadedPhoto.isMain && this.rootStore.userStore.user) {
                        this.userProfile.image = uploadedPhoto.url;
                        this.rootStore.userStore.user.image = uploadedPhoto.url
                    } 
                }
            })
        }

        const errorCallback = () => {
            toast.error('Error uploaidng file');
            runInAction(() => {
                this.uploadingPhoto = false;
            })
        }

        return tryCatchBlock(successCallback, errorCallback);
    }

    @action setMain = async (id: string) => {
        this.settingMainPhoto = true;
        
        const successCallback = async () => {
            await agent.Profiles.setMain(id);
            runInAction(() => {
                this.settingMainPhoto = false;
                if(this.userProfile) {
                    this.userProfile.photos.find(t => t.isMain)!.isMain = false;
                    const currentImage = this.userProfile.photos.find(t => t.id === id);
                    if(currentImage) {
                        currentImage.isMain = true;
                        this.userProfile.image = currentImage.url;
                    }
                   
                }
              
                if(this.rootStore.userStore.user)
                    this.rootStore.userStore.user.image = this.userProfile?.photos.find(t => t.id === id)!.url
            })
        }

        const errorCallback = () => {
            runInAction(() => {
                this.settingMainPhoto = false
            })
        }

        return tryCatchBlock(successCallback, errorCallback);
    }

    @action deletePhoto = async (id: string) => {
        this.deleteingPhoto= true;

        const successCallback = async () => {
            await agent.Profiles.deletePhoto(id);

            runInAction(() => {
                this.deleteingPhoto = false;
                if(this.userProfile) {
                    this.userProfile.photos = this.userProfile.photos.filter(t => t.id !== id);
                }
            })
        }

        const errorCallback = () => {
            runInAction(() => {
                this.deleteingPhoto = false;
                toast.error('Error while deleting the photo')
            })
        }
         
        return tryCatchBlock(successCallback, errorCallback);
    }

    @computed get isCurrentUser() {
        if(this.rootStore.userStore.user && this.userProfile) {
            return this.rootStore.userStore.user.userName === this.userProfile.userName;
        }

        return false;
    }

}