export default interface ICachedMessageDTO {
  id: string;
  messagecreated?: boolean;
  messageupdated?: boolean;
  contactupdated?: boolean;
  ticketupdated?: boolean;
  data: {
    text: string;
    isFromMe: boolean;
    number: string | undefined;
    name: string;
    timestamp: string;
    [key: string]: any;
  };
}
