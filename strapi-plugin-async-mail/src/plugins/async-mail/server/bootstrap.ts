import { Strapi } from "@strapi/strapi";
import { Email } from "./types";
import seedTemplates from "./boot/seedTemplates";

export default ({ strapi }: { strapi: Strapi }) => {
  seedTemplates(strapi);
  strapi.cron.add({
    sendEmails: {
      task: async ({ strapi }) => {
        const service = strapi.plugin("async-mail").service("async-mail");
        try {
          const mails: Email[] = await service.scan();
          for (const mail of mails) {
            await service.sendMail(mail);
          }
        } catch (error) {
          strapi.log.error("Failed to send emails:", error);
        }
      },
      options: "*/10 * * * * *",
    },
  });
};
