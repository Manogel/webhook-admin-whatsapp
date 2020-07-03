import {
  IMessageWebhookDTO,
  EventWebhookType,
  IArrayMessageCreated,
  IMessageCreated,
} from "./dtos/IMessageWebhookDTO";
import ICachedMessageDTO from "../providers/cache/dtos/ICachedMessageDTO";
import cache from "../providers/cache";
import IContactCached from "./dtos/IContactCachedDTO";
import whatsapp from "../apis/whatsapp";
import GetFileMessageService from "./GetFileMessage.service";

class ProcessDataService {
  async execute(data: IMessageWebhookDTO): Promise<null | ICachedMessageDTO> {
    let keyMessageCached = "";

    if (data.event === EventWebhookType.MessageCreated) {
      const isArray = Array.isArray(data.data);

      if (isArray) {
        const arrayEvents = data.data as IArrayMessageCreated;
        const findEventData = arrayEvents.find(
          (event) => event.type === "chat"
        );

        if (!findEventData) return null;

        const message = await this.execute({
          event: data.event,
          webhookId: data.webhookId,
          timestamp: data.timestamp,
          data: findEventData as IMessageCreated,
        });

        return message;
      }

      const dataEvent = data.data as IMessageCreated;

      if (dataEvent.isFromMe) return null;
      const {
        id,
        isFromMe,
        text,
        timestamp,
        fromId,
        serviceId,
        type,
        quotedMessageId,
      } = dataEvent;

      const newMessage: ICachedMessageDTO = {
        id,
        fromId,
        serviceId,
        quotedMessageId,
        message: {
          isFromMe,
          text,
          timestamp,
          type,
        },
      };

      if (
        type === "image" ||
        type === "document" ||
        type === "video" ||
        type === "audio" ||
        type === "ptt"
      ) {

        if(type === 'video'){
          await new Promise(resolve => setTimeout(resolve, 2000))
          await whatsapp.post(`/messages/${id}/sync-file`);
        }

        const response = await GetFileMessageService.execute(id);

        newMessage.message.file = {
          ...response,
          subtitle: text,
        };
      }

      const keyCachedContactUser = `contacts:${fromId}`;

      let cachedContactUser: IContactCached | null;

      var iterations = 0;
      while (true) {
        cachedContactUser = await cache.recover<IContactCached>(
          keyCachedContactUser
        );

        iterations++;
        if (cachedContactUser || iterations >= 20) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (!cachedContactUser) {
        // console.log("Não conseguimos localizar o contato");
        return null;
      }

      const {
        alternativeName,
        isGroup,
        isMyContact,
        name,
        number,
      } = cachedContactUser;

      newMessage.from = {
        id: cachedContactUser.id,
        alternativeName,
        isGroup,
        isMyContact,
        name,
        number,
      };

      if (
        type !== "chat" &&
        type !== "image" &&
        type !== "document" &&
        type !== "audio" &&
        type !== "video" &&
        type !== "ptt"
      ) {
        whatsapp.post("/messages", {
          number,
          serviceId,
          text: `Não conseguimos processar a sua mensagem do tipo ${type}, evite envia-las durante o atendimento!`,
        });

        return null;
      }

      return newMessage;
    } else if (
      data.event === EventWebhookType.ContactUpdated ||
      data.event === EventWebhookType.ContactCreated
    ) {
      const {
        name,
        isMe,
        id,
        isMyContact,
        isGroup,
        alternativeName,
      } = data.data;
      const { number } = data.data.data;

      if (isMe) return null;

      keyMessageCached = `contacts:${id}`;

      const contactUser: IContactCached = {
        id,
        name,
        number,
        isMyContact,
        isGroup,
        alternativeName,
      };

      await cache.save(keyMessageCached, contactUser);

      return null;
    }
    return null;
  }
}

export default new ProcessDataService();
