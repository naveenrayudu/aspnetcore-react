export interface IProfile {
    displayName: string,
    userName: string,
    image: string,
    bio: string,
    isFollowing: boolean,
    followersCount: number,
    followingCount: number,
    photos: IPhoto[]
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean
}

export interface IProfileFormValues {
    displayName: string,
    bio: string
}