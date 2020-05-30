export default interface ICachedMessageDTO {
  id: string;
  fromId: string;
  from?: {
    name: string;
    number: string | undefined;
    [key: string]: any;
  };
  message: {
    text: string;
    isFromMe: boolean;
    timestamp: string;
    [key: string]: any;
  };
}
