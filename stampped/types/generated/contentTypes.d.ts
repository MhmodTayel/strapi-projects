import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginStrapiWechatMiniprogramAuthWxCredential
  extends Schema.SingleType {
  collectionName: 'strapi-wechat-miniprogram-auth_wx-credential';
  info: {
    displayName: 'WeChat Credentials';
    singularName: 'wx-credential';
    pluralName: 'wx-credentials';
    description: 'Stores WeChat Mini program credentials';
    tableName: 'wechat_auth_creds';
  };
  options: {
    privateAttributes: ['id', 'created_at'];
    populateCreatorFields: true;
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    app_id: Attribute.String & Attribute.Required & Attribute.Configurable;
    app_secret: Attribute.String & Attribute.Required & Attribute.Configurable;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::strapi-wechat-miniprogram-auth.wx-credential',
      'oneToOne',
      'admin::user'
    >;
    updatedBy: Attribute.Relation<
      'plugin::strapi-wechat-miniprogram-auth.wx-credential',
      'oneToOne',
      'admin::user'
    >;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
    name: 'User';
    description: '';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    uploaded_documents: Attribute.Media;
    lastLocale: Attribute.String;
    openid: Attribute.String;
    wechatUserInfo: Attribute.JSON;
    registered: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCountryCountry extends Schema.CollectionType {
  collectionName: 'countries';
  info: {
    singularName: 'country';
    pluralName: 'countries';
    displayName: 'Country';
    name: 'country';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    iso_code: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    active: Attribute.Boolean &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<false>;
    fillable_embassy_form: Attribute.Media;
    iso_code_3ch: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    currency: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'api::currency.currency'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::country.country',
      'oneToMany',
      'api::country.country'
    >;
    locale: Attribute.String;
  };
}

export interface ApiCurrencyCurrency extends Schema.CollectionType {
  collectionName: 'currencies';
  info: {
    singularName: 'currency';
    pluralName: 'currencies';
    displayName: 'Currency';
    name: 'currency';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    iso_code: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    active: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<false>;
    exchange_rate: Attribute.Decimal &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    available_on_paypal: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<false>;
    available_on_stripe: Attribute.Boolean &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Attribute.DefaultTo<true>;
    minor_units: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::currency.currency',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::currency.currency',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::currency.currency',
      'oneToMany',
      'api::currency.currency'
    >;
    locale: Attribute.String;
  };
}

export interface ApiCustomerCustomer extends Schema.CollectionType {
  collectionName: 'customers';
  info: {
    singularName: 'customer';
    pluralName: 'customers';
    displayName: 'Customer';
    name: 'customer';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name_first: Attribute.String;
    user: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    type: Attribute.Enumeration<['individual', 'company']> &
      Attribute.Required &
      Attribute.DefaultTo<'individual'>;
    agent_status: Attribute.Enumeration<
      [
        'none',
        'requested',
        'docs_need_updating',
        'approved',
        'disapproved',
        'retracted'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'none'>;
    docs_need_updating_remarks: Attribute.String;
    agent_status_disapproved_remarks: Attribute.String;
    agent_status_retracted_remarks: Attribute.String;
    name_last: Attribute.String;
    company_name: Attribute.String;
    state_issued_id_front: Attribute.Media;
    state_issued_id_back: Attribute.Media;
    holding_state_issued_id: Attribute.Media;
    law_abiding_statement: Attribute.Media;
    holding_law_abiding_statement: Attribute.Media;
    country: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'api::country.country'
    >;
    company_address_1: Attribute.String;
    company_city: Attribute.String;
    company_state: Attribute.String;
    company_postcode: Attribute.String;
    phone: Attribute.String;
    agent_allow_domestic_us_shipping: Attribute.Boolean &
      Attribute.DefaultTo<false>;
    label: Attribute.String;
    label_with_id: Attribute.String;
    use_legacy_pricing: Attribute.Boolean & Attribute.DefaultTo<false>;
    sales_team: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'api::sales-team.sales-team'
    >;
    sales_team_associate_code: Attribute.String;
    uuid: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEmailNotificationEmailNotification
  extends Schema.CollectionType {
  collectionName: 'email_notifications';
  info: {
    singularName: 'email-notification';
    pluralName: 'email-notifications';
    displayName: 'Email-notification';
    name: 'email-notification';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    new_user_email_confirmation_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    new_individual_account_welcome_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    new_company_account_welcome_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    company_review_request_alert: Attribute.Component<'components.email-template-with-to-address'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    company_review_docs_need_updating: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    company_review_approved_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    company_review_rejected_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    company_review_retracted_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order_paid_customer_notification: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order_paid_admin_notification: Attribute.Component<'components.email-template-with-to-address'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quotation_request_admin_notification: Attribute.Component<'components.email-template-with-to-address'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order_paid_fingerprints_needed: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    password_forgotten_reset_link_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    external_order_paid_customer_notification: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    external_order_paid_sales_team_notification: Attribute.Component<'components.email-template-with-to-address'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    new_customer_email_confirmation_message: Attribute.Component<'components.email-template'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::email-notification.email-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::email-notification.email-notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::email-notification.email-notification',
      'oneToMany',
      'api::email-notification.email-notification'
    >;
    locale: Attribute.String;
  };
}

export interface ApiLanguageLanguage extends Schema.CollectionType {
  collectionName: 'languages';
  info: {
    singularName: 'language';
    pluralName: 'languages';
    displayName: 'Language';
    name: 'language';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    locale_name: Attribute.String & Attribute.Required;
    Icon_image: Attribute.Media & Attribute.Required;
    order: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    enabled: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::language.language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::language.language',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSalesTeamSalesTeam extends Schema.CollectionType {
  collectionName: 'sales_teams';
  info: {
    singularName: 'sales-team';
    pluralName: 'sales-teams';
    displayName: 'Sales-team';
    name: 'sales-team';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    website_url: Attribute.String;
    email: Attribute.Email;
    uuid: Attribute.String;
    language: Attribute.Relation<
      'api::sales-team.sales-team',
      'oneToOne',
      'api::language.language'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sales-team.sales-team',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sales-team.sales-team',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTranslationStringTranslationString
  extends Schema.CollectionType {
  collectionName: 'translation_strings';
  info: {
    singularName: 'translation-string';
    pluralName: 'translation-strings';
    displayName: 'Translation-string';
    name: 'translation-string';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: Attribute.JSON &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    category: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::translation-string.translation-string',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::translation-string.translation-string',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::translation-string.translation-string',
      'oneToMany',
      'api::translation-string.translation-string'
    >;
    locale: Attribute.String;
  };
}

export interface ApiWebsiteSettingWebsiteSetting extends Schema.CollectionType {
  collectionName: 'website_settings';
  info: {
    singularName: 'website-setting';
    pluralName: 'website-settings';
    displayName: 'website-setting';
  };
  options: {
    increments: true;
    timestamps: true;
    draftAndPublish: false;
  };
  attributes: {
    main_background_color: Attribute.String;
    button_icons_subtitles_color: Attribute.String;
    landing_page_slides_background_color: Attribute.String;
    top_bar_background_color: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::website-setting.website-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::website-setting.website-setting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::strapi-wechat-miniprogram-auth.wx-credential': PluginStrapiWechatMiniprogramAuthWxCredential;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::country.country': ApiCountryCountry;
      'api::currency.currency': ApiCurrencyCurrency;
      'api::customer.customer': ApiCustomerCustomer;
      'api::email-notification.email-notification': ApiEmailNotificationEmailNotification;
      'api::language.language': ApiLanguageLanguage;
      'api::sales-team.sales-team': ApiSalesTeamSalesTeam;
      'api::translation-string.translation-string': ApiTranslationStringTranslationString;
      'api::website-setting.website-setting': ApiWebsiteSettingWebsiteSetting;
    }
  }
}
