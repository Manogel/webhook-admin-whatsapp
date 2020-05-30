import {
  IMessageWebhookDTO,
  EventWebhookType,
} from "./dtos/IMessageWebhookDTO";
import ICachedMessageDTO from "../providers/cache/dtos/ICachedMessageDTO";
import cache from "../providers/cache";
import IContactCached from "./dtos/IContactCachedDTO";

class ProcessDataService {
  async execute(data: IMessageWebhookDTO): Promise<null | ICachedMessageDTO> {
    let keyMessageCached = "";

    if (data.event === EventWebhookType.MessageCreated) {
      if (data.data.isFromMe) return null;
      const { id, isFromMe, text, timestamp, fromId } = data.data;
      keyMessageCached = `messages:${id}`;

      const newMessage: ICachedMessageDTO = {
        id,
        fromId,
        message: {
          isFromMe,
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
    } else if (data.event === EventWebhookType.MessageUpdated) {
      if (data.data.isFromMe) return null;
      const { id, fromId, text, timestamp, isFromMe } = data.data;

      keyMessageCached = `messages:${id}`;

      await new Promise((resolve) => setTimeout(resolve, 3000));

      let cachedMessage = await cache.recover<ICachedMessageDTO>(
        keyMessageCached
      );

      if (!cachedMessage) {
        cachedMessage = {
          id,
          fromId,
          message: {
            isFromMe,
            text,
            timestamp,
          },
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
        console.log("Não conseguimos localizar o contato");
        return null;
      }

      const message: ICachedMessageDTO = {
        ...cachedMessage,
        from: {
          id: cachedContactUser.id,
          name: cachedContactUser.name,
          number: cachedContactUser.number,
        },
      };

      await cache.invalidade(keyMessageCached);
      console.log(`processou a mensagem ${message.message.text} corretamente!`);
      return message;
    } else if (data.event === EventWebhookType.ContactUpdated) {
      const { name, isMe, id } = data.data;
      const { number } = data.data.data;

      if (isMe) return null;

      keyMessageCached = `contacts:${id}`;

      const contactUser: IContactCached = {
        id,
        name,
        number,
      };

      await cache.save(keyMessageCached, contactUser);

      return null;
    }
    return null;
  }
}

export default new ProcessDataService();
