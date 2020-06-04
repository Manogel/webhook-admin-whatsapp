interface IWhatsappConfig {
  url: string;
  token: string;
}

export default {
  url: process.env.WHATS_BASE_URL || "localhost",
  token: process.env.WHATS_TOKEN || "localhost",
} as IWhatsappConfig;
