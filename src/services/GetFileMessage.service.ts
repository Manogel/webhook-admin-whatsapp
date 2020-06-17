import whatsapp from "../apis/whatsapp";

interface IResponse {
  url: string;
  name: string;
  mimetype: string;
  publicFilename: string;
}

class ProcessDataService {
  async execute(id: string): Promise<IResponse> {
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
        };
      } catch {
        response = null;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return response;
  }
}

export default new ProcessDataService();
