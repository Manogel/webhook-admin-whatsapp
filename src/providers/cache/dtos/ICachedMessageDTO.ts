export default interface ICachedMessageDTO {
  id: string;
  fromId: string;
  serviceId: string;
  from?: {
    name: string;
    number: string | undefined;
    [key: string]: any;
  };
  message: {
    text: string;
    isFromMe: boolean;
    timestamp: string;
    type: "chat" | "image" | "document";
    [key: string]: any;
  };
}
