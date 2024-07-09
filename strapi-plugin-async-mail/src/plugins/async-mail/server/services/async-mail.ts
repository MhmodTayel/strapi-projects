import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import { Config, Email, Status } from "../types";
import _ from "lodash";

const { errors } = utils;
const UID = "plugin::async-mail.async-mail-outbox";

export default ({ strapi }: { strapi: Strapi }) => ({
  async create(data: Email) {
    const { subject, message, from } = data;
    const config: Config = await strapi.config.get("plugin.async-mail");
    const { recipient } = config;
    const email: Email = {
      subject,
      message,
      from: from || process.env.ASYNC_MAIL_RECIPIENT || "",
      status: Status.NEW,
      recipient: recipient || process.env.ASYNC_MAIL_RECIPIENT || "",
    };

    try {
      return await strapi.entityService?.create(UID, { data: email });
    } catch (error) {
      strapi.log.error("Failed to create email:", error);
      throw new errors.ApplicationError("Failed to create email");
    }
  },

  async find(query = {}) {
    try {
      return await strapi.entityService?.findMany(UID, query);
    } catch (error) {
      strapi.log.error("Failed to find emails:", error);
      throw new errors.ApplicationError("Failed to find emails");
    }
  },

  async scan(filters = {}) {
    const config: Config = await strapi.config.get("plugin.async-mail");
    const { scanLimit } = config;
    const query = {
      filters: { status: [Status.NEW, Status.FAILED], ...filters },
      limit: scanLimit || 10,
    };
    try {
      return await this.find(query);
    } catch (error) {
      strapi.log.error("Failed to scan emails:", error);
      throw new errors.ApplicationError("Failed to scan emails");
    }
  },

  async update(id: string, data: Partial<Email> = {}) {
    try {
      return await strapi.entityService?.update(UID, id, { data });
    } catch (error) {
      strapi.log.error(`Failed to update email with id ${id}:`, error);
      throw new errors.ApplicationError("Failed to update email");
    }
  },

  async sendMail(email: Email) {
    const { isTemplated, uid, recipient, message, id } = email;
    try {
      const response = isTemplated
        ? await this.sendTemplatedEmail(uid, email)
        : await strapi
            .plugin("email")
            .service("email")
            .send({ ...email, to: recipient, text: message });

      const isSuccess =
        response.accepted &&
        response.accepted.length > 0 &&
        response.rejected.length === 0;

      await this.update(id, {
        status: isSuccess ? Status.SENT : Status.FAILED,
      });
      if (isSuccess) {
        strapi.log.info(`Email sent successfully to ${recipient}`);
      } else {
        strapi.log.error(`Failed to send email to ${recipient}`);
      }
    } catch (error) {
      strapi.log.error("Failed to send email:", error);
      await this.update(id, { status: Status.FAILED });
      throw new errors.ApplicationError("Failed to send email");
    }
  },

  async sendTemplatedEmail(uid: string = "DEFAULT", email: Email) {
    const { recipient, from, meta } = email;
    const template = await strapi.db
      ?.query("plugin::async-mail.async-mail-template")
      .findOne({ where: { uid } });

    return await strapi.plugin("email").service("email").sendTemplatedEmail(
      {
        to: recipient,
        from,
      },
      template,
      {
        data: email.meta,
      }
    );
  },
});
