export type Language = 'ko' | 'en' | 'ja' | 'zh';

export interface Translations {
    home: {
        title: string;
        enterName: string;
        createRoom: string;
        joinRoom: string;
        activeRooms: string;
        noActiveRooms: string;
        join: string;
        create: string;
        roomNamePlaceholder: string;
        namePlaceholder: string;
        login: string;
        welcome: string;
        tip: string;
        tipDescription: string;
    };
    room: {
        waiting: string;
        chat: string;
        participants: string;
        you: string;
        focused: string;
        shareRoom: string;
    };
    controls: {
        cameraOn: string;
        cameraOff: string;
        micOn: string;
        micOff: string;
        screenShare: string;
        stopSharing: string;
        leave: string;
    };
    chat: {
        placeholder: string;
        send: string;
    };
    connection: {
        connecting: string;
        reconnecting: string;
        disconnected: string;
        error: string;
    };
}
