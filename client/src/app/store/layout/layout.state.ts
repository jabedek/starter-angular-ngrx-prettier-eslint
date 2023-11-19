export interface LayoutState {
  ui: {
    burgerOpen: boolean;
  };
  lastError: Error | null;
  toasts: string[];
  loadingResource: {
    isLoading: boolean;
    resource: string;
  };
}

export const layoutInitialState: LayoutState = {
  ui: {
    burgerOpen: false,
  },
  lastError: null,
  toasts: [],
  loadingResource: {
    isLoading: false,
    resource: '',
  },
};
