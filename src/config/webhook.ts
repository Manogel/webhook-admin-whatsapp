interface IWebhookConfig {
  webhook_url: string;
  api_mchat_url: string;
}

export default {
  webhook_url: process.env.WH_URL || "localhost",
  api_mchat_url: process.env.API_MCHAT_URL || "localhost",
} as IWebhookConfig;
