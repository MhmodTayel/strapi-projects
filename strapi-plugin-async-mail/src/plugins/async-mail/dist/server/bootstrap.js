"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seedTemplates_1 = __importDefault(require("./boot/seedTemplates"));
exports.default = ({ strapi }) => {
    (0, seedTemplates_1.default)(strapi);
    strapi.cron.add({
        sendEmails: {
            task: async ({ strapi }) => {
                const service = strapi.plugin("async-mail").service("async-mail");
                try {
                    const mails = await service.scan();
                    for (const mail of mails) {
                        await service.sendMail(mail);
                    }
                }
                catch (error) {
                    strapi.log.error("Failed to send emails:", error);
                }
            },
            options: "*/10 * * * * *",
        },
    });
};
