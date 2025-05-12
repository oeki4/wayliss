import type { AnnouncementPhoto } from "./announcementPhoto";

export interface Announcement {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  userId: number;
  AnnouncementPhoto: AnnouncementPhoto[];
}
