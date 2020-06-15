export default interface ICachedMessageDTO {
  id: string;
  fromId: string;
  serviceId: string;
  quotedMessageId?: string;
  from?: {
    name: string;
    number: string | undefined;
    [key: string]: any;
  };
  message: {
    text: string;
    isFromMe: boolean;
    timestamp: string;
    type: "chat" | "image" | "document" | "ptt" | "audio";
    [key: string]: any;
  };
}
