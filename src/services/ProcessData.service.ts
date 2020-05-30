import {
  IMessageWebhookDTO,
  EventWebhookType,
} from "./dtos/IMessageWebhookDTO";
import ICachedMessageDTO from "../providers/cache/dtos/ICachedMessageDTO";
import cache from "../providers/cache";

class ProcessDataService {
  async execute(data: IMessageWebhookDTO): Promise<null | ICachedMessageDTO> {
    let keyMessageCached = "";

    if (data.event === EventWebhookType.MessageCreated) {
      if (data.data.isFromMe) return null;
      const { id, isFromMe, text, timestamp } = data.data;
      keyMessageCached = `messages:${id}`;

      const newMessage: ICachedMessageDTO = {
        id,
        messagecreated: true,
        data: {
          isFromMe,
          name: "Cliente",
          number: undefined,
          text,
          timestamp,
        },
      };
      await cache.save(keyMessageCached, newMessage);
      return null;
      // } else if (data.event === EventWebhookType.TicketUpdated) {
      //   keyMessageCached = `messages:${data.data.lastMessageId}`;

      //   // await new Promise((resolve) => setTimeout(resolve, 1000));

      //   const cachedMessage = await cache.recover<ICachedMessageDTO>(
      //     keyMessageCached
      //   );

      //   if (!cachedMessage) {
      //     console.log("Não achou o ticket no cache");
      //     return null;
      //   }
      //   await cache.save(keyMessageCached, {
      //     ...cachedMessage,
      //     ticketupdated: true,
      //   });
      //   return null;
      // } else if (data.event === EventWebhookType.MessageUpdated) {
      //   if (data.data.isFromMe) return null;
      //   const { id } = data.data;

      //   keyMessageCached = `messages:${id}`;

      //   const cachedMessage = await cache.recover<ICachedMessageDTO>(
      //     keyMessageCached
      //   );

      //   if (!cachedMessage) {
      //     console.log("Não achou a mensagem no cache");
      //     return null;
      //   }

      //   await new Promise((resolve) => setTimeout(resolve, 1500));

      //   await cache.save(keyMessageCached, {
      //     ...cachedMessage,
      //     messageupdated: true,
      //   });
      //   return null;
    } else if (data.event === EventWebhookType.ContactUpdated) {
      const { lastMessageId, name, isMe } = data.data;
      const { number } = data.data.data;

      if (isMe) return null;

      keyMessageCached = `messages:${lastMessageId}`;

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const cachedMessage = await cache.recover<ICachedMessageDTO>(
        keyMessageCached
      );

      if (!cachedMessage) {
        console.log("Não achou a mensagem no cache para salvar o contato");
        return null;
      }

      const message = {
        ...cachedMessage,
        contactupdated: true,
        data: {
          ...cachedMessage.data,
          number,
          name,
        },
      };
      await cache.invalidade(keyMessageCached);
      console.log(message);
      return null;
    }
    return null;
  }
}

export default new ProcessDataService();