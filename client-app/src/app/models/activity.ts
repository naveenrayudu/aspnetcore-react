export interface IActivity
{
    id: string;
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    date: Date;
    isGoing: boolean;
    isHost: boolean;

    attendees: IAttendee[];
}

export interface IActivityForm extends Partial<IActivity> {
    time? : Date
}

export class ActivityFormValues implements IActivityForm {
    id?: string = undefined;
    title: string = '';
    description: string = '';
    category: string = '';
    city: string = '';
    venue: string = '';
    date?: Date = undefined;
    time?: Date = undefined;

    constructor(init?: IActivityForm | null) {
        Object.assign(this, init);
        if(init && init.date) {
            this.time = init.date;
        }
    }
}

export interface IAttendee {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
}