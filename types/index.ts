export type GiftStatus = 'locked' | 'available' | 'opened';

export interface Gift {
  id: string;
  title: string;
  budget: number;
  date: string;
  status: GiftStatus;
  openedOrder: number | null;
}

export interface GiftState {
  gifts: Gift[];
  currentGift: Gift | null;
  _hasHydrated: boolean;
}

export interface AddGiftInput {
  title: string;
  budget: number;
}

export interface GiftActions {
  addGift: (input: AddGiftInput) => { ok: boolean; error?: string };
  selectRandomAvailableGift: () => Gift | null;
  confirmCurrentGift: () => void;
  refreshStatuses: () => void;
  resetStore: () => void;
  setHasHydrated: (value: boolean) => void;
}

export type GiftStore = GiftState & GiftActions;
