export enum EventWebhookType {
  MessageCreated = 'message.created',
  MessageUpdated = 'message.updated',
  TicketUpdated = 'ticket.updated',
  ContactUpdated = 'contact.updated',
  ServiceUpdated = 'service.updated',
}

type IActionsPayload = {
  [EventWebhookType.MessageCreated]: {
    id: string;
    isFromMe: boolean;
    sent: boolean;
    type: 'chat';
    timestamp: string;
    data: { ack: number; isNew: boolean; isFirst: boolean };
    visible: boolean;
    accountId: string;
    contactId: string;
    fromId: string;
    serviceId: string;
    text: string;
    obfuscated: boolean;
    isFromBot: boolean;
  };
  [EventWebhookType.MessageUpdated]: {
    id: string;
    isFromMe: boolean;
    sent: boolean;
    type: 'chat';
    timestamp: string;
    data: { ack: number; isNew: boolean; isFirst: boolean };
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
  [EventWebhookType.ServiceUpdated]: {
    id: string;
    name: 'ANDROID VIRTUAL';
    data: { myId: string; syncCount: number };
    settings: {
      readReceipts: boolean;
      markComposingBeforeSend: boolean;
      shouldOpenTicketForGroups: boolean;
    };
    type: 'whatsapp';
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
