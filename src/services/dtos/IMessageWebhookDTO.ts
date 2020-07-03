export enum EventWebhookType {
  MessageCreated = "message.created",
  MessageUpdated = "message.updated",
  TicketUpdated = "ticket.updated",
  ContactUpdated = "contact.updated",
  ContactCreated = "contact.created",
  ServiceUpdated = "service.updated",
}

export type IArrayMessageCreated = Array<{
  id: string;
  isFromMe: boolean;
  sent: boolean;
  type: "chat" | "document" | "image" | "ptt" | "audio" | "ticket";
  timestamp: string;
  data: {
    ack: number;
    isNew: boolean;
    isFirst: boolean;
    fileDownload?: object;
  };
  visible: boolean;
  accountId: string;
  contactId: string;
  fromId: string;
  quotedMessageId?: string;
  serviceId: string;
  text: string;
  obfuscated: boolean;
  isFromBot: boolean;
}>;

export type IMessageCreated = {
  id: string;
  isFromMe: boolean;
  sent: boolean;
  type: "chat" | "document" | "image" | "ptt" | "audio" | "video";
  timestamp: string;
  data: {
    ack: number;
    isNew: boolean;
    isFirst: boolean;
    fileDownload?: object;
  };
  visible: boolean;
  accountId: string;
  contactId: string;
  fromId: string;
  quotedMessageId?: string;
  serviceId: string;
  text: string;
  obfuscated: boolean;
  isFromBot: boolean;
};

type IActionsPayload = {
  [EventWebhookType.MessageCreated]: IMessageCreated | IArrayMessageCreated;
  [EventWebhookType.MessageUpdated]: {
    id: string;
    isFromMe: boolean;
    sent: boolean;
    type: "chat" | "document" | "image" | "ticket" | "video";
    timestamp: string;
    data: {
      ack: number;
      isNew: boolean;
      isFirst: boolean;
      fileDownload?: object;
    };
    visible: boolean;
    accountId: string;
    contactId: string;
    fromId: string;
    serviceId: string;
    ticketId: string;
    ticketDepartmentId: string;
    text: string;
    obfuscated: boolean;
    isFromBot: boolean;
  };
  [EventWebhookType.TicketUpdated]: {
    id: string;
    isOpen: boolean;
    protocol: string;
    origin: string;
    metrics: { waitingTime: number; messagingTime: number };
    startedAt: string;
    departmentId: string;
    accountId: string;
    contactId: string;
    firstMessageId: string;
    lastMessageId: string;
  };
  [EventWebhookType.ContactUpdated]: {
    unsubscribed: boolean;
    id: string;
    isMe: boolean;
    isGroup: boolean;
    isBroadcast: boolean;
    name: string;
    alternativeName: string;
    unread: number;
    isSilenced: boolean;
    isMyContact: boolean;
    hadChat: boolean;
    visible: boolean;
    data: { number: string };
    lastMessageAt: string;
    lastMessageId: string;
    accountId: string;
    serviceId: string;
  };
  [EventWebhookType.ContactCreated]: {
    unsubscribed: boolean;
    id: string;
    isMe: boolean;
    isGroup: boolean;
    isBroadcast: boolean;
    name: string;
    alternativeName: string;
    unread: number;
    isSilenced: boolean;
    isMyContact: boolean;
    hadChat: boolean;
    visible: boolean;
    data: { number: string };
    lastMessageAt: string;
    lastMessageId: string;
    accountId: string;
    serviceId: string;
  };
  [EventWebhookType.ServiceUpdated]: {
    id: string;
    name: "Nova Conexão";
    data: {
      myId: string;
      syncCount: number;
      status: {
        mode: "MAIN";
        myId: "559691444688@c.us";
        state: "NORMAL";
        fullStore: boolean;
        isLoading: boolean;
        isStarted: boolean;
        qrCodeUrl: null;
        waVersion: string;
        isCharging: boolean;
        isOnQrPage: boolean;
        isStarting: boolean;
        isConnected: boolean;
        batteryLevel: number;
        isConflicted: boolean;
        isOnChatPage: boolean;
        isWebSyncing: boolean;
        isPhoneAuthed: boolean;
        needsCharging: boolean;
        isWebConnected: boolean;
        isQrCodeExpired: boolean;
        qrCodeExpiresAt: number;
        isPhoneConnected: boolean;
        isWaitingForPhoneInternet: boolean;
      };
    };
    settings: {
      readReceipts: boolean;
      markComposingBeforeSend: boolean;
      shouldOpenTicketForGroups: boolean;
    };
    type: "whatsapp";
    accountId: string;
  };
};

type FormatDataMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        event: Key;
      }
    : {
        event: Key;
        webhookId: string;
        timestamp: string;
        data: M[Key];
      };
};

export type IMessageWebhookDTO = FormatDataMap<
  IActionsPayload
>[keyof FormatDataMap<IActionsPayload>];
