import { observable, action, computed, runInAction } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { tryCatchBlock } from "../common/util/util";
import { RootStore } from "./rootStore";


export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }



  @observable activityRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | null = null;
  @observable isSubmitting: boolean = false;
  @observable isDeleting: boolean = false;
  @observable deletingActivityId: string = "";

  @action loadActivities = async () => {
    this.loadingInitial = true;
    const successCallback = async () => {
      const data: IActivity[] = await agent.Activities.list();
      runInAction(() => {
        data.forEach(activity => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    };

    const errorCallback = () => {
      runInAction(() => {
        this.loadingInitial = false;
      });
    };

    await tryCatchBlock(successCallback, errorCallback);
  };

  @action loadActivityDetails = async (id: string | null) => {
    if (id === null) return null;

    if (this.activityRegistry.has(id))
      return (this.activity = this.activityRegistry.get(id));

    this.loadingInitial = true;

    const successCallback = async () => {
      const activity = await agent.Activities.details(id);
      runInAction(() => {
        this.activity = activity;
        this.activity.date = new Date(activity.date);
        this.loadingInitial = false;
        this.activityRegistry.set(activity.id, this.activity);
      });
      return this.activity;
    };

    const errorCallback = async (error: any) => {
      runInAction(() => {
        this.loadingInitial = false;
      });
    };

    return await tryCatchBlock(successCallback, errorCallback);
  };

  @action createActivity = async (activity: IActivity) => {
    activity.id = uuid();
    this.isSubmitting = true;
    const successCallback = async () => {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.isSubmitting = false;
        this.activity = activity;
      });
    };

    const errorCallback = () => {
      runInAction(() => {
        this.isSubmitting = false;
      });
      toast.error('Error occured while creating activity');
      throw new Error();
    };

    await tryCatchBlock(successCallback, errorCallback);
  };

  @action updateActivity = async (activity: IActivity) => {
    this.isSubmitting = true;
    const successCallback = async () => {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.isSubmitting = false;
        this.activity = activity;
      });
    };

    const errorCallback = () => {
      runInAction(() => {
        this.isSubmitting = false;
      });
      toast.error('Error occured while creating activity');
      throw new Error();
    };

    return await tryCatchBlock(successCallback, errorCallback);
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
      });
    };

    const errorCallback = (error: any) => {
      runInAction(() => {
        this.isDeleting = false;
        this.deletingActivityId = "";
      });
    };

    await tryCatchBlock(successCallback, errorCallback);
  };

  @action selectActivity = (id: string | null) => {
    this.activity = this.activityRegistry.get(id) || null;
  };

  @action showCreateActivity = () => {
    this.selectActivity(null);
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @computed get activitiesByDate() {
    let currentDay = "";

    const dateReducer: {
      [key: string]: IActivity[];
    } = Array.from(this.activityRegistry.values()).reduce(
      (prev, cur: IActivity) => {
        currentDay = cur.date.toISOString().split("T")[0] || '';
        prev[currentDay] = prev[currentDay]
          ? [...prev[currentDay], cur]
          : [cur];
        return prev;
      },
      {}
    );

    return Object.entries(dateReducer).sort(
      (a, b) => Date.parse(a[0]) - Date.parse(b[0])
    );
  }
}
