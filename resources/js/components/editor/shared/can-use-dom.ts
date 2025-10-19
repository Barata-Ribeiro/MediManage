export const CAN_USE_DOM: boolean =
    typeof globalThis !== 'undefined' && globalThis.window?.document?.createElement !== undefined;
