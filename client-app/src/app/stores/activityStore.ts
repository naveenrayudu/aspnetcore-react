import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

configure({
  enforceActions: "always"
});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable selectedActivity: IActivity | null = null;
  @observable editMode: boolean = false;
  @observable isSubmitting: boolean = false;
  @observable isDeleting: boolean = false;
  @observable deletingActivityId: string = "";

  @action loadActivities = async () => {
    this.loadingInitial = true;
    const successCallback = async () => {
      const data: IActivity[] = await agent.Activities.list();
      runInAction(() => {
        data.forEach(activity => {
          activity.date = (activity.date as any).split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    };

    const errorCallback = () => {
      runInAction(() => {
        this.loadingInitial = false;
      })
    };

    tryCatchBlock(successCallback, errorCallback);
  };

  @action createActivity = async (activity: IActivity) => {
    const updatedActivity = { ...activity };
    updatedActivity.id = uuid();
    this.isSubmitting = true;
    const successCallback = async () => {
      await agent.Activities.create(updatedActivity);
      runInAction(() => {
        this.activityRegistry.set(updatedActivity.id, updatedActivity);
        this.isSubmitting = false;
        this.editMode = false;
        this.selectedActivity = updatedActivity;
      })
    };

    const errorCallback = () => {
      runInAction(() => {
        this.isSubmitting = false;
      })
    };

    tryCatchBlock(successCallback, errorCallback);
  };

  @action updateActivity = async (activity: IActivity) => {
    this.isSubmitting = true;
    const successCallback = async () => {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.isSubmitting = false;
        this.editMode = false;
        this.selectedActivity = activity;
      })
    };

    const errorCallback = () => {
      runInAction(() => {
        this.isSubmitting = false;
      })
    };

    tryCatchBlock(successCallback, errorCallback);
  };

  @action deleteActivity = async (id: string) => {
    this.deletingActivityId = id;
    this.isDeleting = true;
    const successCallback = async () => {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.isDeleting = false;
        this.deletingActivityId = "";
      })
    };

    const errorCallback = () => {
      runInAction(() => {
        this.isDeleting = false;
        this.deletingActivityId = "";
      })
    };

    tryCatchBlock(successCallback, errorCallback);
  };

  @action selectActivity = (id: string | null) => {
    this.selectedActivity = this.activityRegistry.get(id) || null;
    this.editMode = false;
  };

  @action setEditMode = (editMode: boolean) => (this.editMode = editMode);

  @action showCreateActivity = () => {
    this.selectActivity(null);
    this.setEditMode(true);
  };

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a: any, b: any) => Date.parse(a.date) - Date.parse(b.date)
    );
  }
}

const tryCatchBlock = async (successCallback: any, errorCallback: any) => {
  try {
    await successCallback();
  } catch (error) {
    console.log(error);
    errorCallback();
  }
};

export default createContext(new ActivityStore());
