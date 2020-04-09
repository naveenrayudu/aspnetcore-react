import { IActivity } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateTime = (date: Date, time: Date): Date => {
  const timestring = time.getHours() + ":" + time.getMinutes() + ":00";
  const dateString = `${date.getFullYear}-${date.getMonth() +
    1}-${date.getDate()}`;

  return new Date(dateString + " " + timestring);
};

export const tryCatchBlock = async (
  successCallback: any,
  errorCallback: any
) => {
  try {
    return await successCallback();
  } catch (error) {
    return await errorCallback(error);
  }
};


export const setActivityProps = (activity: IActivity, user: IUser | null) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(t => t.username === user?.userName);
  activity.isHost = activity.attendees.some(t => t.username === user?.userName && t.isHost);
}

export const GetUTCDateTime = () => {
  const now = new Date();
  return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
}