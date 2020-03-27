import { observable, action, computed, runInAction } from "mobx";
import { IActivity, IAttendee } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { tryCatchBlock, setActivityProps } from "../common/util/util";
import { RootStore } from "./rootStore";
import { IUser } from "../models/user";


export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }



  @observable activityRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable loading: boolean = false;
  @observable activity: IActivity | null = null;
  @observable isSubmitting: boolean = false;
  @observable isDeleting: boolean = false;
  @observable deletingActivityId: string = "";

  @action loadActivities = async () => {
    this.loadingInitial = true;
    const successCallback = async () => {
      const data: IActivity[] = await agent.Activities.list();
      runInAction(() => {
        const user = this.rootStore.userStore.user;
        data.forEach(activity => {
          setActivityProps(activity, user);
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
        const user = this.rootStore.userStore.user;
        setActivityProps(activity, user);
        this.loadingInitial = false;
        this.activity = activity;
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
      
      const attendee = this.createAttendee();
      attendee.isHost = true;
      activity.isHost = true;

      activity.attendees = [attendee];

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

  @action attendActivity =  async () => {
   
    this.loading = true;
    const attendee = this.createAttendee();
    const successCallback = async () => {
      await agent.Activities.attend(this.activity?.id!);

      runInAction(() => {
        this.loading = false;
        if(this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
      })
    }

    const errorCallback = () => {
      runInAction(() => {
        this.loading = false;
      })
      toast.error('Problem signing up to the activity');
    }

    return await tryCatchBlock(successCallback, errorCallback);
  }

  @action cancelAttendee = async () => {
    if(!this.activity) {
      return;
    }

    this.loading = true;
    const successCallback = async () => {
      await agent.Activities.unattend(this.activity!.id);

      runInAction(() => {
        this.loading = false;
        this.activity!.attendees = this.activity!.attendees.filter(t => t.username !== this.rootStore.userStore.user?.userName);
        this.activity!.isGoing = false;
        this.activityRegistry.set(this.activity!.id, this.activity);
      })
    }

    const errorCallback =  () => {
      runInAction(() => {
        this.loading = false;
        toast.error('Problem cancelling attendance');
      })
    }

    return await tryCatchBlock(successCallback, errorCallback);
  }

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


  createAttendee = (): IAttendee => {
    const user: IUser = this.rootStore.userStore.user!;

    const attendee: IAttendee = {
      displayName: user.displayName,
      image: user.image || '',
      isHost: false,
      username: user.userName
    }

    return attendee;
  }
}
