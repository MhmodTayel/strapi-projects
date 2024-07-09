"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templates = [
    {
        uid: "DEFAULT",
        subject: "Anfrage Schaltpartner von <%= data.name %>",
        text: `Neue Anfrage von:
      <%= data.name %>
      <%= data.company %>
      <%= data.email %>
      <%= data.phone %>
      <%= data.contact %>
      <%= data.text %>`,
        html: `<h1>Kontakt über Schaltpartner</h1>
      <p>
      Name: <%= data.name %><br>
      Firma: <%= data.company %><br>
      Email: <%= data.email %><br>
      Phone: <%= data.phone %><br>
      Contact: <%= data.contact %><br>
      <h2>Nachricht</h2>
      <%= data.text %>.<p>`,
    },
];
const UID = "plugin::async-mail.async-mail-template";
exports.default = async (strapi) => {
    for (const template of templates) {
        const entity = await strapi.db.query(UID).findOne({
            where: {
                uid: template.uid,
            },
        });
        if (!entity) {
            await strapi.db.query(UID).create({
                data: template,
            });
        }
    }
};
