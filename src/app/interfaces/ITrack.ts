export interface ITrack {
    id: string;
    title: string;
    description: string;
    author: string;
    url: string;
    thumbnail: string;
    duration: string;
    durationMS: number;
    views: number;
    requestedBy: string;
    playlist: string | null;
}
