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
        quotedMessageId,
      } = data.data;

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

      // type !== "ptt"
      // type !== "audio"

      if (
        type === "image" ||
        type === "document" ||
        type === "audio" ||
        type === "ptt"
      ) {
        let response = null;

        while (!response) {
          const data = await whatsapp.get(`/messages/${id}?include[0]=file`);
          try {
            const { url, name, mimetype, publicFilename } = data.data.file;
            response = {
              url,
              name,
              mimetype,
              publicFilename,
              subtitle: text,
            };
          } catch {
            response = null;
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        newMessage.message.file = response;
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
