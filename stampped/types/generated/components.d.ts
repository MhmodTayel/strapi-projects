import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsEmailTemplateWithToAddress extends Schema.Component {
  collectionName: 'components_components_email_templates-with-to-address';
  info: {
    icon: 'mail-bulk';
    description: '';
    displayName: 'email_template_with_to_address';
  };
  attributes: {
    sender_address: Attribute.String & Attribute.Required;
    sender_label: Attribute.String;
    to_address: Attribute.String;
    subject: Attribute.String & Attribute.Required;
    content_html: Attribute.RichText;
    reply_address: Attribute.String;
    reply_label: Attribute.String;
  };
}

export interface ComponentsEmailTemplate extends Schema.Component {
  collectionName: 'components_components_email_templates';
  info: {
    icon: 'mail-bulk';
    description: '';
    displayName: 'email_template';
  };
  attributes: {
    sender_address: Attribute.String & Attribute.Required;
    sender_label: Attribute.String;
    subject: Attribute.String & Attribute.Required;
    content_html: Attribute.RichText;
    reply_address: Attribute.String;
    reply_label: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.email-template-with-to-address': ComponentsEmailTemplateWithToAddress;
      'components.email-template': ComponentsEmailTemplate;
    }
  }
}
