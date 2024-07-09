"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("@strapi/utils"));
const types_1 = require("../types");
const { errors } = utils_1.default;
const UID = "plugin::async-mail.async-mail-outbox";
exports.default = ({ strapi }) => ({
    async create(data) {
        var _a;
        const { subject, message, from } = data;
        const config = await strapi.config.get("plugin.async-mail");
        const { recipient } = config;
        const email = {
            subject,
            message,
            from: from || process.env.ASYNC_MAIL_RECIPIENT || "",
            status: types_1.Status.NEW,
            recipient: recipient || process.env.ASYNC_MAIL_RECIPIENT || "",
        };
        try {
            return await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.create(UID, { data: email }));
        }
        catch (error) {
            strapi.log.error("Failed to create email:", error);
            throw new errors.ApplicationError("Failed to create email");
        }
    },
    async find(query = {}) {
        var _a;
        try {
            return await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findMany(UID, query));
        }
        catch (error) {
            strapi.log.error("Failed to find emails:", error);
            throw new errors.ApplicationError("Failed to find emails");
        }
    },
    async scan(filters = {}) {
        const config = await strapi.config.get("plugin.async-mail");
        const { scanLimit } = config;
        const query = {
            filters: { status: [types_1.Status.NEW, types_1.Status.FAILED], ...filters },
            limit: scanLimit || 10,
        };
        try {
            return await this.find(query);
        }
        catch (error) {
            strapi.log.error("Failed to scan emails:", error);
            throw new errors.ApplicationError("Failed to scan emails");
        }
    },
    async update(id, data = {}) {
        var _a;
        try {
            return await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.update(UID, id, { data }));
        }
        catch (error) {
            strapi.log.error(`Failed to update email with id ${id}:`, error);
            throw new errors.ApplicationError("Failed to update email");
        }
    },
    async sendMail(email) {
        const { isTemplated, uid, recipient, message, id } = email;
        try {
            const response = isTemplated
                ? await this.sendTemplatedEmail(uid, email)
                : await strapi
                    .plugin("email")
                    .service("email")
                    .send({ ...email, to: recipient, text: message });
            const isSuccess = response.accepted &&
                response.accepted.length > 0 &&
                response.rejected.length === 0;
            await this.update(id, {
                status: isSuccess ? types_1.Status.SENT : types_1.Status.FAILED,
            });
            if (isSuccess) {
                strapi.log.info(`Email sent successfully to ${recipient}`);
            }
            else {
                strapi.log.error(`Failed to send email to ${recipient}`);
            }
        }
        catch (error) {
            strapi.log.error("Failed to send email:", error);
            await this.update(id, { status: types_1.Status.FAILED });
            throw new errors.ApplicationError("Failed to send email");
        }
    },
    async sendTemplatedEmail(uid, email) {
        var _a;
        const { recipient, from, meta } = email;
        const template = await ((_a = strapi.db) === null || _a === void 0 ? void 0 : _a.query("plugin::async-mail.async-mail-template").findOne({ where: { uid } }));
        return await strapi.plugin("email").service("email").sendTemplatedEmail({
            to: recipient,
            from,
        }, template, {
            data: email.meta,
        });
    },
});
