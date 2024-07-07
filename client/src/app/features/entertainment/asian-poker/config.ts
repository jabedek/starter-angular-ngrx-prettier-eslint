import { SessionAccessibility, SessionListVisibility } from './models/types/session-game-chat/session.model';

export type Config = {
  devOnly?: {
    shouldShow: {
      sessionInstantStartButton: boolean;
    };
    shouldOmit: {
      sessionPassword: boolean;
    };
    shouldAllow: {
      kickFromLobby: boolean;
      inviteToLobby: boolean;
      seeFullCardsInfo: boolean;
    };
  };
  sessionCreation: {
    title: {
      get defaultVal(): string;
      minLength: number;
      maxLength: number;
    };
    playersLimit: {
      minVal: number;
      maxVal: number;
    };
    accessibility: {
      defaultVal: SessionAccessibility;
    };
    visibility: {
      defaultVal: SessionListVisibility;
    };
    spectatorsAllowed: {
      defaultVal: boolean;
    };
    actionDurationSeconds: {
      durationStep: number;
      get minVal(): number;
    };
  };
};

// export const OFFICIAL_CONFIG: Config = {
//   sessionCreation: {
//     title: {
//       get defaultVal() {
//         const now = Date.now().toString();
//         return `Session ${now.substring(1, 4)}${now.substring(5, 9)}`;
//       },
//       minLength: 3,
//       maxLength: 15,
//     },
//     playersLimit: {
//       minVal: 3,
//       maxVal: 6,
//     },
//     accessibility: {
//       defaultVal: 'all',
//     },
//     visibility: {
//       defaultVal: 'public',
//     },
//     spectatorsAllowed: {
//       defaultVal: true,
//     },
//     actionDurationSeconds: {
//       durationStep: 15,
//       get minVal() {
//         return this.durationStep * 3;
//       },
//     },
//   },
// };

// export const DEV_CONFIG: Config = {
//   devOnly: {
//     shouldShow: {
//       sessionInstantStartButton: true,
//     },
//     shouldOmit: {
//       sessionPassword: true,
//     },
//     shouldAllow: {
//       kickFromLobby: true,
//       inviteToLobby: true,
//       seeFullCardsInfo: true,
//     },
//   },
//   sessionCreation: {
//     ...OFFICIAL_CONFIG.sessionCreation,
//     playersLimit: {
//       minVal: 1,
//       maxVal: 6,
//     },
//     actionDurationSeconds: {
//       durationStep: 15,
//       get minVal() {
//         return this.durationStep * 3000;
//       },
//     },
//   },
// };
