export interface User {
  twitchId: string;
  username: string;
  tokens: number;
  keys: {
    name: string;
    cdkey: string;
  }[];
  isAdmin: boolean;
}

export interface GiveawayGame {
  id?: string;
  name: string;
  imageLink: string;
  storeLink: string;
  cdkey: string;
  collected: boolean;
}

export interface DecryptedKey {
  name: string;
  cdkey: string;
}

export interface GameCardProps {
  id?: string;
  uid: string;
  tokens: number;
  name: string;
  imageLink: string;
  storeLink: string;
}
