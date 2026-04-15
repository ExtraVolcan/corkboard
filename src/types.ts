export type Entry = {
  id: string;
  text: string;
  revealed: boolean;
};

export type Profile = {
  id: string;
  name: string;
  /** Public URL or path under /public */
  image: string;
  nameRevealed: boolean;
  imageRevealed: boolean;
  /** When false, profile is hidden from non-admin list and routes */
  profileRevealed: boolean;
  entries: Entry[];
};

export type CampaignData = {
  profiles: Profile[];
};
