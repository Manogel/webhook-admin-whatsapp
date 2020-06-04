import {
  IMessageWebhookDTO,
  EventWebhookType,
} from "./dtos/IMessageWebhookDTO";
import ICachedMessageDTO from "../providers/cache/dtos/ICachedMessageDTO";
import cache from "../providers/cache";
import IContactCached from "./dtos/IContactCachedDTO";
import whatsapp from "../apis/whatsapp";

class ProcessDataService {
  async execute(data: IMessageWebhookDTO): Promise<null | ICachedMessageDTO> {
    let keyMessageCached = "";

    if (data.event === EventWebhookType.MessageCreated) {
      if (data.data.isFromMe) return null;
      const {
        id,
        isFromMe,
        text,
        timestamp,
        fromId,
        serviceId,
        type,
        data: informations,
      } = data.data;

      keyMessageCached = `messages:${id}`;

      const newMessage: ICachedMessageDTO = {
        id,
        fromId,
        serviceId,
        message: {
          isFromMe,
          text,
          timestamp,
          type,
        },
      };
      await cache.save(keyMessageCached, newMessage);
      return null;
    } else if (data.event === EventWebhookType.MessageUpdated) {
      if (data.data.isFromMe) return null;
      const {
        id,
        fromId,
        text,
        type,
        timestamp,
        isFromMe,
        serviceId,
        data: informations,
      } = data.data;

      keyMessageCached = `messages:${id}`;
      // console.log(data.data);

      let cachedMessage = await cache.recover<ICachedMessageDTO>(
        keyMessageCached
      );

      if (!cachedMessage) {
        cachedMessage = {
          id,
          fromId,
          serviceId,
          message: {
            type,
            isFromMe,
            text,
            timestamp,
          },
        };
      }

      if (type === "image" || type === "document") {
        const { data: response } = await whatsapp.get(
          `/messages/${id}?include[0]=file`
        );
        const { url, name, mimetype, publicFilename } = response.file;
        cachedMessage.message.file = {
          url,
          name,
          mimetype,
          publicFilename,
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

      const message: ICachedMessageDTO = {
        ...cachedMessage,
        serviceId,
        from: {
          id: cachedContactUser.id,
          alternativeName,
          isGroup,
          isMyContact,
          name,
          number,
        },
      };

      await cache.invalidade(keyMessageCached);

      if (type !== "chat" && type !== "image" && type !== "document") {
        whatsapp.post("/messages", {
          number,
          serviceId,
          text: `Não conseguimos processar a sua mensagem do tipo ${type}, evite envialas durante o atendimento!`,
        });

        return null;
      }

      return message;
    } else if (data.event === EventWebhookType.ContactUpdated) {
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
