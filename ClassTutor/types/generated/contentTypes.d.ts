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
        createdBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
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
        isActive: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
        roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> & Attribute.Private;
        blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
        preferedLanguage: Attribute.String;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
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
        permissions: Attribute.Relation<'admin::role', 'oneToMany', 'admin::permission'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
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
        permissions: Attribute.Relation<'admin::api-token', 'oneToMany', 'admin::api-token-permission'>;
        expiresAt: Attribute.DateTime;
        lifespan: Attribute.BigInteger;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
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
        token: Attribute.Relation<'admin::api-token-permission', 'manyToOne', 'admin::api-token'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
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
        permissions: Attribute.Relation<'admin::transfer-token', 'oneToMany', 'admin::transfer-token-permission'>;
        expiresAt: Attribute.DateTime;
        lifespan: Attribute.BigInteger;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
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
        token: Attribute.Relation<'admin::transfer-token-permission', 'manyToOne', 'admin::transfer-token'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> &
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
        folder: Attribute.Relation<'plugin::upload.file', 'manyToOne', 'plugin::upload.folder'> & Attribute.Private;
        folderPath: Attribute.String &
            Attribute.Required &
            Attribute.Private &
            Attribute.SetMinMax<
                {
                    min: 1;
                },
                number
            >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
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
            Attribute.SetMinMax<
                {
                    min: 1;
                },
                number
            >;
        pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
        parent: Attribute.Relation<'plugin::upload.folder', 'manyToOne', 'plugin::upload.folder'>;
        children: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.folder'>;
        files: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.file'>;
        path: Attribute.String &
            Attribute.Required &
            Attribute.SetMinMax<
                {
                    min: 1;
                },
                number
            >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
    collectionName: 'strapi_releases';
    info: {
        singularName: 'release';
        pluralName: 'releases';
        displayName: 'Release';
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
        name: Attribute.String & Attribute.Required;
        releasedAt: Attribute.DateTime;
        scheduledAt: Attribute.DateTime;
        timezone: Attribute.String;
        status: Attribute.Enumeration<['ready', 'blocked', 'failed', 'done', 'empty']> & Attribute.Required;
        actions: Attribute.Relation<
            'plugin::content-releases.release',
            'oneToMany',
            'plugin::content-releases.release-action'
        >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::content-releases.release', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::content-releases.release', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface PluginContentReleasesReleaseAction extends Schema.CollectionType {
    collectionName: 'strapi_release_actions';
    info: {
        singularName: 'release-action';
        pluralName: 'release-actions';
        displayName: 'Release Action';
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
        type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
        entry: Attribute.Relation<'plugin::content-releases.release-action', 'morphToOne'>;
        contentType: Attribute.String & Attribute.Required;
        locale: Attribute.String;
        release: Attribute.Relation<
            'plugin::content-releases.release-action',
            'manyToOne',
            'plugin::content-releases.release'
        >;
        isEntryValid: Attribute.Boolean;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::content-releases.release-action', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::content-releases.release-action', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface PluginUsersPermissionsPermission extends Schema.CollectionType {
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
        role: Attribute.Relation<'plugin::users-permissions.permission', 'manyToOne', 'plugin::users-permissions.role'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> &
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
        users: Attribute.Relation<'plugin::users-permissions.role', 'oneToMany', 'plugin::users-permissions.user'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
    collectionName: 'up_users';
    info: {
        name: 'user';
        description: '';
        singularName: 'user';
        pluralName: 'users';
        displayName: 'User';
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
        role: Attribute.Relation<'plugin::users-permissions.user', 'manyToOne', 'plugin::users-permissions.role'>;
        user_types: Attribute.Relation<'plugin::users-permissions.user', 'oneToMany', 'api::user-type.user-type'>;
        signupToken: Attribute.String & Attribute.Private;
        passwordResetToken: Attribute.String & Attribute.Private;
        parent: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'api::parent.parent'>;
        student: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'api::student.student'>;
        teacher: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'api::teacher.teacher'>;
        admin: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'api::admin.admin'>;
        source: Attribute.String;
        additionalPermission: Attribute.Enumeration<['meeting-recording']>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
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
            Attribute.SetMinMax<
                {
                    min: 1;
                    max: 50;
                },
                number
            >;
        code: Attribute.String & Attribute.Unique;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiAdminAdmin extends Schema.CollectionType {
    collectionName: 'admins';
    info: {
        singularName: 'admin';
        pluralName: 'admins';
        displayName: 'Admin';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        user: Attribute.Relation<'api::admin.admin', 'oneToOne', 'plugin::users-permissions.user'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::admin.admin', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::admin.admin', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiAdminSettingAdminSetting extends Schema.SingleType {
    collectionName: 'admin_settings';
    info: {
        singularName: 'admin-setting';
        pluralName: 'admin-settings';
        displayName: 'AdminSetting';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        teacherInterviewLink: Attribute.String;
        maxFileSize: Attribute.Integer & Attribute.DefaultTo<250>;
        payRates: Attribute.JSON;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::admin-setting.admin-setting', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::admin-setting.admin-setting', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiAuditLogAuditLog extends Schema.CollectionType {
    collectionName: 'audit_logs';
    info: {
        singularName: 'audit-log';
        pluralName: 'audit-logs';
        displayName: 'AuditLog';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        uid: Attribute.String;
        params: Attribute.JSON;
        result: Attribute.JSON;
        user: Attribute.JSON;
        actionType: Attribute.String;
        changedId: Attribute.String;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::audit-log.audit-log', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::audit-log.audit-log', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiClassClass extends Schema.CollectionType {
    collectionName: 'classes';
    info: {
        singularName: 'class';
        pluralName: 'classes';
        displayName: 'Class';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        classId: Attribute.String & Attribute.Required & Attribute.Unique;
        type: Attribute.Enumeration<['group', 'private']> & Attribute.Required & Attribute.DefaultTo<'group'>;
        startDate: Attribute.Date & Attribute.Required;
        endDate: Attribute.Date & Attribute.Required;
        zoomAccount: Attribute.String;
        zoomPassword: Attribute.String;
        zoomLink: Attribute.String;
        zoomMeetingId: Attribute.String;
        zoomMeetingPasscode: Attribute.String;
        startTime: Attribute.Time & Attribute.Required;
        endTime: Attribute.Time & Attribute.Required;
        rate: Attribute.Decimal;
        status: Attribute.Enumeration<['active', 'archived']> & Attribute.Required & Attribute.DefaultTo<'active'>;
        teacher: Attribute.Relation<'api::class.class', 'oneToOne', 'api::teacher.teacher'>;
        subject: Attribute.Relation<'api::class.class', 'oneToOne', 'api::subject.subject'>;
        year: Attribute.Relation<'api::class.class', 'oneToOne', 'api::year.year'>;
        progress: Attribute.Decimal;
        dayOfWeek: Attribute.Enumeration<
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        > &
            Attribute.Required;
        yearDisplay: Attribute.String;
        rateCalculated: Attribute.Decimal;
        meeting_account: Attribute.Relation<'api::class.class', 'oneToOne', 'api::meeting-account.meeting-account'>;
        nextRegisterGenerateDate: Attribute.Date;
        class_topics: Attribute.Relation<'api::class.class', 'oneToMany', 'api::class-topic.class-topic'>;
        solutionRequired: Attribute.Boolean;
        meetingTopic: Attribute.String;
        lessonAbility: Attribute.Enumeration<['advanced', 'expected', 'emerging']>;
        isSummerClass: Attribute.Boolean & Attribute.DefaultTo<false>;
        subject_level: Attribute.Relation<'api::class.class', 'oneToOne', 'api::subject-level.subject-level'>;
        exam_boards: Attribute.Relation<'api::class.class', 'oneToMany', 'api::exam-board.exam-board'>;
        subject_topics: Attribute.Relation<'api::class.class', 'oneToMany', 'api::subject-topic.subject-topic'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::class.class', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::class.class', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiClassTeacherClassTeacher extends Schema.CollectionType {
    collectionName: 'class_teachers';
    info: {
        singularName: 'class-teacher';
        pluralName: 'class-teachers';
        displayName: 'ClassTeacher';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        classId: Attribute.String & Attribute.Required;
        teacher: Attribute.Relation<'api::class-teacher.class-teacher', 'oneToOne', 'api::teacher.teacher'>;
        class: Attribute.Relation<'api::class-teacher.class-teacher', 'oneToOne', 'api::class.class'>;
        type: Attribute.Enumeration<['active', 'cover', 'archive']> &
            Attribute.Required &
            Attribute.DefaultTo<'active'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::class-teacher.class-teacher', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::class-teacher.class-teacher', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiClassTopicClassTopic extends Schema.CollectionType {
    collectionName: 'class_topics';
    info: {
        singularName: 'class-topic';
        pluralName: 'class-topics';
        displayName: 'ClassTopic';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        topic: Attribute.Relation<'api::class-topic.class-topic', 'oneToOne', 'api::topic.topic'>;
        class: Attribute.Relation<'api::class-topic.class-topic', 'manyToOne', 'api::class.class'>;
        register: Attribute.Relation<'api::class-topic.class-topic', 'manyToOne', 'api::register.register'>;
        disabled: Attribute.Boolean;
        taught: Attribute.Boolean;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::class-topic.class-topic', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::class-topic.class-topic', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiContractorContractor extends Schema.CollectionType {
    collectionName: 'contractors';
    info: {
        singularName: 'contractor';
        pluralName: 'contractors';
        displayName: 'Contractor';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        teachers: Attribute.Relation<'api::contractor.contractor', 'oneToMany', 'api::teacher.teacher'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::contractor.contractor', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::contractor.contractor', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiEducationLevelEducationLevel extends Schema.CollectionType {
    collectionName: 'education_levels';
    info: {
        singularName: 'education-level';
        pluralName: 'education-levels';
        displayName: 'EducationLevel';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        otherName: Attribute.String & Attribute.Unique;
        order: Attribute.Integer & Attribute.Required;
        years: Attribute.Relation<'api::education-level.education-level', 'oneToMany', 'api::year.year'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::education-level.education-level', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::education-level.education-level', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiEmailLogEmailLog extends Schema.CollectionType {
    collectionName: 'email_logs';
    info: {
        singularName: 'email-log';
        pluralName: 'email-logs';
        displayName: 'EmailLog';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        subject: Attribute.String & Attribute.Required;
        sentTime: Attribute.DateTime;
        fromName: Attribute.String & Attribute.Required;
        fromEmail: Attribute.String & Attribute.Required;
        toName: Attribute.String & Attribute.Required;
        toEmail: Attribute.String & Attribute.Required;
        errorLog: Attribute.Text;
        templateName: Attribute.String;
        body: Attribute.Text & Attribute.Required & Attribute.CustomField<'plugin::html-viewer.html-viewer'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::email-log.email-log', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::email-log.email-log', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiEventMessageEventMessage extends Schema.CollectionType {
    collectionName: 'event_messages';
    info: {
        singularName: 'event-message';
        pluralName: 'event-messages';
        displayName: 'EventMessage';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        eventCode: Attribute.String & Attribute.Required;
        receiverId: Attribute.String & Attribute.Required;
        message: Attribute.String & Attribute.Required;
        template: Attribute.String & Attribute.Required;
        entity: Attribute.String;
        entityId: Attribute.String;
        eventType: Attribute.Enumeration<['info', 'success', 'warning', 'error', 'question']> &
            Attribute.Required &
            Attribute.DefaultTo<'info'>;
        persist: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
        messageValues: Attribute.JSON;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::event-message.event-message', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::event-message.event-message', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiExamBoardExamBoard extends Schema.CollectionType {
    collectionName: 'exam_boards';
    info: {
        singularName: 'exam-board';
        pluralName: 'exam-boards';
        displayName: 'ExamBoard';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        code: Attribute.String & Attribute.Required & Attribute.Unique;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::exam-board.exam-board', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::exam-board.exam-board', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiFamilyLinkFamilyLink extends Schema.CollectionType {
    collectionName: 'family_links';
    info: {
        singularName: 'family-link';
        pluralName: 'family-links';
        displayName: 'FamilyLink';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        parents: Attribute.Relation<'api::family-link.family-link', 'oneToMany', 'api::parent.parent'>;
        students: Attribute.Relation<'api::family-link.family-link', 'oneToMany', 'api::student.student'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::family-link.family-link', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::family-link.family-link', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiGroupGroup extends Schema.CollectionType {
    collectionName: 'groups';
    info: {
        singularName: 'group';
        pluralName: 'groups';
        displayName: 'Group';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        order: Attribute.BigInteger;
        type: Attribute.String;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::group.group', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::group.group', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiHomeworkHomework extends Schema.CollectionType {
    collectionName: 'homeworks';
    info: {
        singularName: 'homework';
        pluralName: 'homeworks';
        displayName: 'Homework';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        register: Attribute.Relation<'api::homework.homework', 'oneToOne', 'api::register.register'>;
        type: Attribute.Enumeration<['homework', 'hotAssessment', 'coldAssessment']> & Attribute.DefaultTo<'homework'>;
        deadline: Attribute.DateTime;
        questions: Attribute.Media;
        solutions: Attribute.Media;
        marksTotal: Attribute.Integer & Attribute.DefaultTo<100>;
        locked_by_teacher: Attribute.Relation<'api::homework.homework', 'oneToOne', 'api::teacher.teacher'>;
        lockStartTime: Attribute.DateTime;
        lockEndTime: Attribute.DateTime;
        markingBlocked: Attribute.Boolean;
        markingComplete: Attribute.Boolean;
        errorReason: Attribute.String;
        errorStatus: Attribute.Enumeration<['not_applicable', 'pending', 'resolved', 'stuck']>;
        errorDate: Attribute.DateTime;
        error_by: Attribute.Relation<'api::homework.homework', 'oneToOne', 'api::teacher.teacher'>;
        created_by_teacher: Attribute.Relation<'api::homework.homework', 'oneToOne', 'api::teacher.teacher'>;
        homework_submissions: Attribute.Relation<
            'api::homework.homework',
            'oneToMany',
            'api::homework-submission.homework-submission'
        >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::homework.homework', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::homework.homework', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiHomeworkSubmissionHomeworkSubmission extends Schema.CollectionType {
    collectionName: 'homework_submissions';
    info: {
        singularName: 'homework-submission';
        pluralName: 'homework-submissions';
        displayName: 'HomeworkSubmission';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        register_student: Attribute.Relation<
            'api::homework-submission.homework-submission',
            'oneToOne',
            'api::register-student.register-student'
        >;
        student: Attribute.Relation<'api::homework-submission.homework-submission', 'oneToOne', 'api::student.student'>;
        homework: Attribute.Relation<
            'api::homework-submission.homework-submission',
            'manyToOne',
            'api::homework.homework'
        >;
        markingStatus: Attribute.Enumeration<['marked', 'error']>;
        submissionFiles: Attribute.Media;
        completionDate: Attribute.DateTime;
        comment: Attribute.String;
        marksAchieved: Attribute.Integer;
        understanding: Attribute.Enumeration<['struggled', 'understood', 'mastered']>;
        marking_teacher: Attribute.Relation<
            'api::homework-submission.homework-submission',
            'oneToOne',
            'api::teacher.teacher'
        >;
        markedFiles: Attribute.Media;
        errorReason: Attribute.String;
        submitted: Attribute.Boolean;
        submittedLate: Attribute.Boolean;
        errorDate: Attribute.DateTime;
        error_by: Attribute.Relation<
            'api::homework-submission.homework-submission',
            'oneToOne',
            'api::teacher.teacher'
        >;
        error_resolved_by: Attribute.Relation<
            'api::homework-submission.homework-submission',
            'oneToOne',
            'api::admin.admin'
        >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::homework-submission.homework-submission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::homework-submission.homework-submission', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiIdConfigIdConfig extends Schema.SingleType {
    collectionName: 'id_configs';
    info: {
        singularName: 'id-config';
        pluralName: 'id-configs';
        displayName: 'IdConfig';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        classId: Attribute.String;
        studentId: Attribute.String;
        teacherId: Attribute.String;
        parentId: Attribute.String;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::id-config.id-config', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::id-config.id-config', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiInvoiceInvoice extends Schema.CollectionType {
    collectionName: 'invoices';
    info: {
        singularName: 'invoice';
        pluralName: 'invoices';
        displayName: 'Invoice';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        student: Attribute.Relation<'api::invoice.invoice', 'oneToOne', 'api::student.student'>;
        billing_parent: Attribute.Relation<'api::invoice.invoice', 'oneToOne', 'api::parent.parent'>;
        invoiceIdentifier: Attribute.String;
        paymentIdentifier: Attribute.String;
        paidDate: Attribute.DateTime;
        invoiceSentDate: Attribute.DateTime;
        status: Attribute.Enumeration<['new', 'sent', 'paid', 'cancelled', 'failed', 'overdue']>;
        failedReason: Attribute.String;
        notes: Attribute.Text;
        amount: Attribute.Decimal;
        refundAmount: Attribute.Decimal;
        invoice_items: Attribute.Relation<'api::invoice.invoice', 'oneToMany', 'api::invoice-item.invoice-item'>;
        dueDate: Attribute.Date;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::invoice.invoice', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::invoice.invoice', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiInvoiceItemInvoiceItem extends Schema.CollectionType {
    collectionName: 'invoice_items';
    info: {
        singularName: 'invoice-item';
        pluralName: 'invoice-items';
        displayName: 'InvoiceItem';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        student_class: Attribute.Relation<
            'api::invoice-item.invoice-item',
            'oneToOne',
            'api::student-class.student-class'
        >;
        multiClassDiscount: Attribute.Decimal;
        scholarshipDiscount: Attribute.Decimal;
        managementDiscount: Attribute.Decimal;
        classRate: Attribute.Decimal;
        total: Attribute.Decimal;
        invoice: Attribute.Relation<'api::invoice-item.invoice-item', 'manyToOne', 'api::invoice.invoice'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::invoice-item.invoice-item', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::invoice-item.invoice-item', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiIssueReasonIssueReason extends Schema.CollectionType {
    collectionName: 'issue_reasons';
    info: {
        singularName: 'issue-reason';
        pluralName: 'issue-reasons';
        displayName: 'IssueReason';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        group: Attribute.Enumeration<['student', 'class']>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::issue-reason.issue-reason', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::issue-reason.issue-reason', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiMeetingAccountMeetingAccount extends Schema.CollectionType {
    collectionName: 'meeting_accounts';
    info: {
        singularName: 'meeting-account';
        pluralName: 'meeting-accounts';
        displayName: 'MeetingAccount';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        password: Attribute.String;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::meeting-account.meeting-account', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::meeting-account.meeting-account', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiMeetingRecordingMeetingRecording extends Schema.CollectionType {
    collectionName: 'meeting_recordings';
    info: {
        singularName: 'meeting-recording';
        pluralName: 'meeting-recordings';
        displayName: 'MeetingRecording';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        meetingType: Attribute.Enumeration<
            ['lesson', 'coaching', 'meeting', 'interview', 'client_call', 'tutorial', 'other']
        >;
        class: Attribute.Relation<'api::meeting-recording.meeting-recording', 'oneToOne', 'api::class.class'>;
        register: Attribute.Relation<'api::meeting-recording.meeting-recording', 'oneToOne', 'api::register.register'>;
        date: Attribute.DateTime;
        recordingLink: Attribute.String;
        account: Attribute.Enumeration<['account01', 'account02', 'account03', 'account04']>;
        noRecording: Attribute.Boolean;
        status: Attribute.Enumeration<['incomplete', 'complete', 'stuck']> & Attribute.DefaultTo<'incomplete'>;
        meetingChat: Attribute.Text;
        meetingTranscript: Attribute.Text;
        visible: Attribute.Boolean & Attribute.DefaultTo<true>;
        students: Attribute.Relation<'api::meeting-recording.meeting-recording', 'oneToMany', 'api::student.student'>;
        agents: Attribute.Relation<'api::meeting-recording.meeting-recording', 'oneToMany', 'api::admin.admin'>;
        teachers: Attribute.Relation<'api::meeting-recording.meeting-recording', 'oneToMany', 'api::teacher.teacher'>;
        systemGenerated: Attribute.Boolean & Attribute.DefaultTo<false>;
        reason: Attribute.Text;
        transcriptFiles: Attribute.Media;
        chatFiles: Attribute.Media;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::meeting-recording.meeting-recording', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::meeting-recording.meeting-recording', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiNoticeNotice extends Schema.CollectionType {
    collectionName: 'notices';
    info: {
        singularName: 'notice';
        pluralName: 'notices';
        displayName: 'Notice';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        title: Attribute.String & Attribute.Required;
        description: Attribute.RichText;
        fromDate: Attribute.DateTime & Attribute.Required;
        toDate: Attribute.DateTime & Attribute.Required;
        subTitle: Attribute.String;
        iconImage: Attribute.String;
        backgroundColour: Attribute.String;
        foregroundColour: Attribute.String;
        classes: Attribute.Relation<'api::notice.notice', 'oneToMany', 'api::class.class'>;
        allClasses: Attribute.Boolean & Attribute.DefaultTo<false>;
        enabled: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
        targetTeacher: Attribute.Boolean;
        targetParent: Attribute.Boolean;
        targetStudent: Attribute.Boolean;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::notice.notice', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::notice.notice', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiParentParent extends Schema.CollectionType {
    collectionName: 'parents';
    info: {
        singularName: 'parent';
        pluralName: 'parents';
        displayName: 'Parent';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        parentId: Attribute.String & Attribute.Required & Attribute.Unique;
        name: Attribute.String & Attribute.Required;
        lastName: Attribute.String;
        status: Attribute.Enumeration<['active', 'inactive']> & Attribute.Required & Attribute.DefaultTo<'active'>;
        email: Attribute.String;
        email2: Attribute.String;
        phoneCountryCode: Attribute.String;
        phone: Attribute.String;
        isPhonePrimary1: Attribute.Boolean & Attribute.DefaultTo<false>;
        phoneCountryCode2: Attribute.String;
        phone2: Attribute.String;
        isPhonePrimary2: Attribute.Boolean & Attribute.DefaultTo<false>;
        stripeCustomerId: Attribute.String;
        receiveMarkettingEmails: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
        students: Attribute.Relation<'api::parent.parent', 'manyToMany', 'api::student.student'>;
        user: Attribute.Relation<'api::parent.parent', 'oneToOne', 'plugin::users-permissions.user'>;
        gender: Attribute.String;
        avatarImageName: Attribute.String;
        addressLine1: Attribute.String;
        city: Attribute.String;
        country: Attribute.String;
        postcode: Attribute.String;
        postponeReason: Attribute.String;
        postponeDate: Attribute.DateTime;
        contractStatus: Attribute.Enumeration<['sent', 'messaged', 'called', 'signed', 'rejected', 'manual']>;
        signedDate: Attribute.Date;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::parent.parent', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::parent.parent', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiPaymentSubscriptionPaymentSubscription extends Schema.CollectionType {
    collectionName: 'payment_subscriptions';
    info: {
        singularName: 'payment-subscription';
        pluralName: 'payment-subscriptions';
        displayName: 'PaymentSubscription';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        paymentDate: Attribute.Integer;
        student: Attribute.Relation<
            'api::payment-subscription.payment-subscription',
            'oneToOne',
            'api::student.student'
        >;
        billing_parent: Attribute.Relation<
            'api::payment-subscription.payment-subscription',
            'oneToOne',
            'api::parent.parent'
        >;
        payment_subscription_items: Attribute.Relation<
            'api::payment-subscription.payment-subscription',
            'oneToMany',
            'api::payment-subscription-item.payment-subscription-item'
        >;
        invoiceDate: Attribute.DateTime;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::payment-subscription.payment-subscription', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::payment-subscription.payment-subscription', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiPaymentSubscriptionItemPaymentSubscriptionItem extends Schema.CollectionType {
    collectionName: 'payment_subscription_items';
    info: {
        singularName: 'payment-subscription-item';
        pluralName: 'payment-subscription-items';
        displayName: 'PaymentSubscriptionItem';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        student_class: Attribute.Relation<
            'api::payment-subscription-item.payment-subscription-item',
            'oneToOne',
            'api::student-class.student-class'
        >;
        multiClassDiscount: Attribute.Decimal;
        scholarshipDiscount: Attribute.Decimal;
        managementDiscount: Attribute.Decimal;
        classRate: Attribute.Decimal;
        total: Attribute.Decimal;
        payment_subscription: Attribute.Relation<
            'api::payment-subscription-item.payment-subscription-item',
            'manyToOne',
            'api::payment-subscription.payment-subscription'
        >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<
            'api::payment-subscription-item.payment-subscription-item',
            'oneToOne',
            'admin::user'
        > &
            Attribute.Private;
        updatedBy: Attribute.Relation<
            'api::payment-subscription-item.payment-subscription-item',
            'oneToOne',
            'admin::user'
        > &
            Attribute.Private;
    };
}

export interface ApiRegisterRegister extends Schema.CollectionType {
    collectionName: 'registers';
    info: {
        singularName: 'register';
        pluralName: 'registers';
        displayName: 'Register';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        classDate: Attribute.Date & Attribute.Required;
        class: Attribute.Relation<'api::register.register', 'oneToOne', 'api::class.class'>;
        teacher: Attribute.Relation<'api::register.register', 'oneToOne', 'api::teacher.teacher'>;
        parentNotes: Attribute.Text;
        lessonFiles: Attribute.Media;
        recordingLink: Attribute.String;
        payAmount: Attribute.Decimal;
        teacherPaymentStatus: Attribute.Enumeration<['pending', 'approved', 'paid']> &
            Attribute.Required &
            Attribute.DefaultTo<'pending'>;
        register_students: Attribute.Relation<
            'api::register.register',
            'oneToMany',
            'api::register-student.register-student'
        >;
        recordingChat: Attribute.Text;
        recordingTranscript: Attribute.Text;
        status: Attribute.Enumeration<['upcoming', 'open', 'missing', 'completed', 'absent', 'cancelled']> &
            Attribute.DefaultTo<'upcoming'>;
        issueDescription: Attribute.Text;
        issueApprovedByAdmin: Attribute.Boolean;
        issue_reasons: Attribute.Relation<'api::register.register', 'oneToMany', 'api::issue-reason.issue-reason'>;
        homeworkType: Attribute.Enumeration<['homework', 'hotAssessment', 'coldAssessment']> &
            Attribute.Required &
            Attribute.DefaultTo<'homework'>;
        homeworkDeadline: Attribute.DateTime;
        homeworkFiles: Attribute.Media;
        homeworkSolutions: Attribute.Media;
        homeworkMarks: Attribute.Integer;
        homework_locked_by_teacher: Attribute.Relation<'api::register.register', 'oneToOne', 'api::teacher.teacher'>;
        homeworkLockStartTime: Attribute.DateTime;
        homeworkLockEndTime: Attribute.DateTime;
        isComplete: Attribute.Boolean & Attribute.DefaultTo<false>;
        isCompleteLate: Attribute.Boolean;
        homeworkMarkingBlocked: Attribute.Boolean;
        homeworkMarkingComplete: Attribute.Boolean;
        homeworkErrorReason: Attribute.String;
        startTime: Attribute.Time;
        endTime: Attribute.Time;
        homeworkErrorStatus: Attribute.Enumeration<['not_applicable', 'pending', 'resolved', 'stuck']>;
        homeworkErrorDate: Attribute.DateTime;
        homework_error_by: Attribute.Relation<'api::register.register', 'oneToOne', 'api::teacher.teacher'>;
        homework: Attribute.Relation<'api::register.register', 'oneToOne', 'api::homework.homework'>;
        attendanceMarked: Attribute.Boolean & Attribute.DefaultTo<false>;
        attendanceMarkedTime: Attribute.DateTime;
        attendance_marked_by: Attribute.Relation<'api::register.register', 'oneToOne', 'api::teacher.teacher'>;
        attendanceLateDays: Attribute.Integer;
        classTime: Attribute.DateTime;
        attendanceMarkedByAdmin: Attribute.Boolean;
        hasHomework: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
        class_topics: Attribute.Relation<'api::register.register', 'oneToMany', 'api::class-topic.class-topic'>;
        materialProvided: Attribute.Boolean;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::register.register', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::register.register', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiRegisterStudentRegisterStudent extends Schema.CollectionType {
    collectionName: 'register_students';
    info: {
        singularName: 'register-student';
        pluralName: 'register-students';
        displayName: 'RegisterStudent';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        register: Attribute.Relation<'api::register-student.register-student', 'manyToOne', 'api::register.register'>;
        student: Attribute.Relation<'api::register-student.register-student', 'oneToOne', 'api::student.student'>;
        freeTrial: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
        engagement: Attribute.Enumeration<['proactive', 'attentive', 'distracted', 'unknown', 'absent']>;
        understanding: Attribute.Enumeration<['mastered', 'understood', 'struggled', 'unknown', 'absent']>;
        issueDescription: Attribute.Text;
        starStudent: Attribute.Boolean;
        feedbackTodaysLesson: Attribute.Integer &
            Attribute.SetMinMax<
                {
                    min: 0;
                    max: 5;
                },
                number
            >;
        feedbackBeforeLessonTopic: Attribute.Integer &
            Attribute.SetMinMax<
                {
                    min: 0;
                    max: 5;
                },
                number
            >;
        feedbackAfterLessonTopic: Attribute.Integer &
            Attribute.SetMinMax<
                {
                    min: 0;
                    max: 5;
                },
                number
            >;
        feedbackTodayTeacher: Attribute.Integer &
            Attribute.SetMinMax<
                {
                    min: 0;
                    max: 5;
                },
                number
            >;
        internalNotes: Attribute.String;
        parentNotes: Attribute.String;
        markerPaid: Attribute.Boolean;
        hasAttended: Attribute.Boolean;
        hasLeftEarly: Attribute.Boolean;
        isLate: Attribute.Boolean;
        issue_reasons: Attribute.Relation<
            'api::register-student.register-student',
            'oneToMany',
            'api::issue-reason.issue-reason'
        >;
        homeworkMarkingStatus: Attribute.Enumeration<['marked', 'error']>;
        homeworkSubmissionFiles: Attribute.Media;
        homeworkCompletionDate: Attribute.DateTime;
        homeworkComment: Attribute.String;
        homeworkMark: Attribute.Integer;
        homeworkUnderstanding: Attribute.Enumeration<['struggled', 'understood', 'mastered']>;
        homework_marking_teacher: Attribute.Relation<
            'api::register-student.register-student',
            'oneToOne',
            'api::teacher.teacher'
        >;
        homeworkMarkedFiles: Attribute.Media;
        homeworkErrorReason: Attribute.String;
        homeworkSubmitted: Attribute.Boolean;
        homeworkSubmittedLate: Attribute.Boolean;
        freeTrialCancelled: Attribute.Boolean;
        student_class: Attribute.Relation<
            'api::register-student.register-student',
            'oneToOne',
            'api::student-class.student-class'
        >;
        issueStatus: Attribute.Enumeration<['not_applicable', 'pending', 'sent', 'rejected']>;
        dateSentIssue: Attribute.DateTime;
        homeworkErrorDate: Attribute.DateTime;
        homework_error_by: Attribute.Relation<
            'api::register-student.register-student',
            'oneToOne',
            'api::teacher.teacher'
        >;
        issue_resolved_by: Attribute.Relation<'api::register-student.register-student', 'oneToOne', 'api::admin.admin'>;
        issueSendToParent: Attribute.Boolean & Attribute.DefaultTo<false>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::register-student.register-student', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::register-student.register-student', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiSalesManagementNoteSalesManagementNote extends Schema.CollectionType {
    collectionName: 'sales_management_notes';
    info: {
        singularName: 'sales-management-note';
        pluralName: 'sales-management-notes';
        displayName: 'SalesManagementNote';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        text: Attribute.Text & Attribute.Required;
        student: Attribute.Relation<
            'api::sales-management-note.sales-management-note',
            'oneToOne',
            'api::student.student'
        >;
        agent: Attribute.Relation<'api::sales-management-note.sales-management-note', 'oneToOne', 'api::admin.admin'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::sales-management-note.sales-management-note', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::sales-management-note.sales-management-note', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiScholarshipScholarship extends Schema.CollectionType {
    collectionName: 'scholarships';
    info: {
        singularName: 'scholarship';
        pluralName: 'scholarships';
        displayName: 'Scholarship';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        discount: Attribute.Decimal;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::scholarship.scholarship', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::scholarship.scholarship', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiStudentStudent extends Schema.CollectionType {
    collectionName: 'students';
    info: {
        singularName: 'student';
        pluralName: 'students';
        displayName: 'Student';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        studentId: Attribute.String & Attribute.Required & Attribute.Unique;
        name: Attribute.String & Attribute.Required;
        lastName: Attribute.String;
        email: Attribute.String;
        phoneCountryCode: Attribute.String;
        phone: Attribute.String;
        isPhonePrimary1: Attribute.Boolean & Attribute.DefaultTo<false>;
        phoneCountryCode2: Attribute.String;
        phone2: Attribute.String;
        isPhonePrimary2: Attribute.Boolean & Attribute.DefaultTo<false>;
        y11GraduationYear: Attribute.String;
        parents: Attribute.Relation<'api::student.student', 'manyToMany', 'api::parent.parent'>;
        schoolName: Attribute.String;
        learningEducationAuthority: Attribute.String;
        subjectsIntro: Attribute.Text;
        isSen: Attribute.Boolean;
        senRequirements: Attribute.Text;
        subjects: Attribute.Relation<'api::student.student', 'oneToMany', 'api::subject.subject'>;
        year: Attribute.Relation<'api::student.student', 'oneToOne', 'api::year.year'>;
        user: Attribute.Relation<'api::student.student', 'oneToOne', 'plugin::users-permissions.user'>;
        gender: Attribute.String;
        avatarImageName: Attribute.String;
        student_classes: Attribute.Relation<'api::student.student', 'oneToMany', 'api::student-class.student-class'>;
        status: Attribute.Enumeration<['new', 'actionRequired', 'inProcess', 'postponed', 'active', 'inactive']> &
            Attribute.DefaultTo<'new'>;
        howDidYouHearAboutUsQuestion: Attribute.String;
        howDidYouHearAboutUsAnswer: Attribute.String;
        how_did_you_hear_parent: Attribute.Relation<'api::student.student', 'oneToOne', 'api::parent.parent'>;
        how_did_you_hear_agent: Attribute.Relation<'api::student.student', 'oneToOne', 'api::admin.admin'>;
        dateOfBirth: Attribute.Date;
        postponeReason: Attribute.Text;
        postponeDate: Attribute.DateTime;
        reports: Attribute.Media;
        isPupilPremium: Attribute.Boolean;
        isFsm: Attribute.Boolean;
        isEal: Attribute.Boolean;
        agents: Attribute.Relation<'api::student.student', 'oneToMany', 'api::admin.admin'>;
        primary_parent: Attribute.Relation<'api::student.student', 'oneToOne', 'api::parent.parent'>;
        postponeNotifyDate: Attribute.DateTime;
        group: Attribute.Relation<'api::student.student', 'oneToOne', 'api::group.group'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::student.student', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::student.student', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiStudentClassStudentClass extends Schema.CollectionType {
    collectionName: 'student_classes';
    info: {
        singularName: 'student-class';
        pluralName: 'student-classes';
        displayName: 'StudentClass';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        student: Attribute.Relation<'api::student-class.student-class', 'manyToOne', 'api::student.student'>;
        class: Attribute.Relation<'api::student-class.student-class', 'oneToOne', 'api::class.class'>;
        status: Attribute.Enumeration<
            [
                'new',
                'trial',
                'awaitingFeedback',
                'firstPaymentPending',
                'active',
                'paymentOverdue',
                'paused',
                'cancelled',
                'inactive'
            ]
        > &
            Attribute.DefaultTo<'new'>;
        billing_parent: Attribute.Relation<'api::student-class.student-class', 'oneToOne', 'api::parent.parent'>;
        agents: Attribute.Relation<'api::student-class.student-class', 'oneToMany', 'api::admin.admin'>;
        trialDate: Attribute.Date;
        classDate: Attribute.Date;
        subject: Attribute.Relation<'api::student-class.student-class', 'oneToOne', 'api::subject.subject'>;
        year: Attribute.Relation<'api::student-class.student-class', 'oneToOne', 'api::year.year'>;
        cancelReason: Attribute.String;
        payment: Attribute.Decimal;
        trialMissedReason: Attribute.String;
        scholarshipDiscount: Attribute.Decimal;
        source: Attribute.Enumeration<['agent', 'websiteForm', 'portal']> & Attribute.DefaultTo<'agent'>;
        type: Attribute.Enumeration<['trial', 'booking']> & Attribute.DefaultTo<'trial'>;
        postponeReason: Attribute.Text;
        postponeDate: Attribute.DateTime;
        changeRequestDate: Attribute.Date;
        changedDate: Attribute.Date;
        cancellationRequestDate: Attribute.Date;
        cancelledDate: Attribute.Date;
        student_scholarship: Attribute.Relation<
            'api::student-class.student-class',
            'oneToOne',
            'api::student-scholarship.student-scholarship'
        >;
        paymentFailed: Attribute.Boolean;
        paymentWriteOff: Attribute.Boolean;
        invalid: Attribute.Boolean;
        firstPaymentDate: Attribute.Date;
        invoiceSentDate: Attribute.Date;
        restartDate: Attribute.Date;
        cancellationPending: Attribute.Boolean;
        joinedDate: Attribute.Date;
        paymentOverdueDate: Attribute.Date;
        paymentFailedDate: Attribute.Date;
        changeReason: Attribute.String;
        classType: Attribute.Enumeration<['group', 'private']> & Attribute.DefaultTo<'group'>;
        paymentFrequency: Attribute.Enumeration<['weekly', 'monthly', 'weekly4', 'weekly5', 'weekly2', 'monthly3']> &
            Attribute.Required &
            Attribute.DefaultTo<'monthly'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::student-class.student-class', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::student-class.student-class', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiStudentClassLogStudentClassLog extends Schema.CollectionType {
    collectionName: 'student_class_logs';
    info: {
        singularName: 'student-class-log';
        pluralName: 'student-class-logs';
        displayName: 'StudentClassLog';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        status: Attribute.String;
        rawData: Attribute.JSON;
        student_class: Attribute.Relation<
            'api::student-class-log.student-class-log',
            'oneToOne',
            'api::student-class.student-class'
        >;
        previousRawData: Attribute.JSON;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::student-class-log.student-class-log', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::student-class-log.student-class-log', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiStudentFeedStudentFeed extends Schema.CollectionType {
    collectionName: 'student_feeds';
    info: {
        singularName: 'student-feed';
        pluralName: 'student-feeds';
        displayName: 'StudentFeed';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String;
        title: Attribute.String;
        type: Attribute.Enumeration<
            [
                'homeworkMarked',
                'newHomework',
                'missingHomework',
                'lessonMissed',
                'reviewLesson',
                'starStudent',
                'behaviourIssue'
            ]
        >;
        register: Attribute.Relation<'api::student-feed.student-feed', 'oneToOne', 'api::register.register'>;
        register_student: Attribute.Relation<
            'api::student-feed.student-feed',
            'oneToOne',
            'api::register-student.register-student'
        >;
        class: Attribute.Relation<'api::student-feed.student-feed', 'oneToOne', 'api::class.class'>;
        student: Attribute.Relation<'api::student-feed.student-feed', 'oneToOne', 'api::student.student'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::student-feed.student-feed', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::student-feed.student-feed', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiStudentScholarshipStudentScholarship extends Schema.CollectionType {
    collectionName: 'student_scholarships';
    info: {
        singularName: 'student-scholarship';
        pluralName: 'student-scholarships';
        displayName: 'StudentScholarship';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        student: Attribute.Relation<'api::student-scholarship.student-scholarship', 'oneToOne', 'api::student.student'>;
        scholarship: Attribute.Relation<
            'api::student-scholarship.student-scholarship',
            'oneToOne',
            'api::scholarship.scholarship'
        >;
        status: Attribute.Enumeration<
            ['inactive', 'awaitingSubmission', 'awaitingApproval', 'eligible', 'ineligible']
        > &
            Attribute.Required &
            Attribute.DefaultTo<'inactive'>;
        amount: Attribute.Decimal;
        lastFormSentDate: Attribute.Date;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::student-scholarship.student-scholarship', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::student-scholarship.student-scholarship', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiSubjectSubject extends Schema.CollectionType {
    collectionName: 'subjects';
    info: {
        singularName: 'subject';
        pluralName: 'subjects';
        displayName: 'Subject';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        type: Attribute.String;
        colour: Attribute.String;
        code: Attribute.String;
        order: Attribute.Integer;
        parent_subject: Attribute.Relation<'api::subject.subject', 'oneToOne', 'api::subject.subject'>;
        isPrimarySubject: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
        solutionRequiredGroup: Attribute.Boolean;
        solutionRequiredPrivate: Attribute.Boolean;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::subject.subject', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::subject.subject', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiSubjectLevelSubjectLevel extends Schema.CollectionType {
    collectionName: 'subject_levels';
    info: {
        singularName: 'subject-level';
        pluralName: 'subject-levels';
        displayName: 'SubjectLevel';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        code: Attribute.String & Attribute.Required & Attribute.Unique;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::subject-level.subject-level', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::subject-level.subject-level', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiSubjectTopicSubjectTopic extends Schema.CollectionType {
    collectionName: 'subject_topics';
    info: {
        singularName: 'subject-topic';
        pluralName: 'subject-topics';
        displayName: 'SubjectTopics';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        type: Attribute.String;
        parent_topic: Attribute.Relation<
            'api::subject-topic.subject-topic',
            'oneToOne',
            'api::subject-topic.subject-topic'
        >;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::subject-topic.subject-topic', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::subject-topic.subject-topic', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiTeacherTeacher extends Schema.CollectionType {
    collectionName: 'teachers';
    info: {
        singularName: 'teacher';
        pluralName: 'teachers';
        displayName: 'Teacher';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        teacherId: Attribute.String & Attribute.Required & Attribute.Unique;
        name: Attribute.String & Attribute.Required;
        lastName: Attribute.String;
        status: Attribute.Enumeration<
            [
                'new',
                'interviewee',
                'reapplied',
                'offered',
                'active',
                'inactive',
                'rejected',
                'barred',
                'offerRejected',
                'offerAccepted'
            ]
        > &
            Attribute.Required &
            Attribute.DefaultTo<'new'>;
        country: Attribute.String;
        email: Attribute.String;
        email2: Attribute.String;
        phoneCountryCode: Attribute.String;
        phone: Attribute.String;
        isPhonePrimary1: Attribute.Boolean & Attribute.DefaultTo<false>;
        phoneCountryCode2: Attribute.String;
        phone2: Attribute.String;
        isPhonePrimary2: Attribute.Boolean & Attribute.DefaultTo<false>;
        cv: Attribute.Media;
        coverLetter: Attribute.Media;
        photo: Attribute.Media;
        bio: Attribute.Text;
        linkedInProfile: Attribute.String;
        interviewRecording: Attribute.String;
        qts: Attribute.Enumeration<['qualified', 'training', 'unqualified']>;
        dbsCertification: Attribute.Media;
        university: Attribute.String;
        degree: Attribute.String;
        degreeGrade: Attribute.String;
        signedContract: Attribute.String;
        passport: Attribute.Media;
        niNumber: Attribute.String;
        address1: Attribute.Text;
        proofOfAddress: Attribute.Media;
        bankAccountNumber: Attribute.String;
        bankSortCode: Attribute.String;
        joinedDate: Attribute.Date;
        utr: Attribute.String;
        rate: Attribute.Decimal;
        degreeCertificate: Attribute.Media;
        contractor: Attribute.Relation<'api::teacher.teacher', 'manyToOne', 'api::contractor.contractor'>;
        user: Attribute.Relation<'api::teacher.teacher', 'oneToOne', 'plugin::users-permissions.user'>;
        subjects: Attribute.Relation<'api::teacher.teacher', 'oneToMany', 'api::subject.subject'>;
        city: Attribute.String;
        postcode: Attribute.String;
        dbsCode: Attribute.String;
        gender: Attribute.String;
        shortBio: Attribute.Text;
        dbsDate: Attribute.Date;
        interviewDate: Attribute.Date;
        offerDate: Attribute.Date;
        rejectedDate: Attribute.Date;
        barredDate: Attribute.Date;
        reapplyDate: Attribute.Date;
        offerRejectedDate: Attribute.Date;
        offerAcceptedDate: Attribute.Date;
        contractLink: Attribute.String;
        supplyTeacher: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
        currentCountry: Attribute.String;
        isContractSigned: Attribute.Boolean & Attribute.DefaultTo<false>;
        leaveDate: Attribute.Date;
        hmrcStatus: Attribute.String;
        companiesHouseStatus: Attribute.String;
        qualification: Attribute.Enumeration<['trainee', 'junior', 'associate', 'senior']>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::teacher.teacher', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::teacher.teacher', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiTeacherCapabilityTeacherCapability extends Schema.CollectionType {
    collectionName: 'teacher_capabilities';
    info: {
        singularName: 'teacher-capability';
        pluralName: 'teacher-capabilities';
        displayName: 'TeacherCapability';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        teacher: Attribute.Relation<'api::teacher-capability.teacher-capability', 'oneToOne', 'api::teacher.teacher'>;
        education_level: Attribute.Relation<
            'api::teacher-capability.teacher-capability',
            'oneToOne',
            'api::education-level.education-level'
        >;
        subject: Attribute.Relation<'api::teacher-capability.teacher-capability', 'oneToOne', 'api::subject.subject'>;
        type: Attribute.Enumeration<['teach', 'supply', 'mark']>;
        coverPriority: Attribute.Enumeration<['priority1', 'priority2', 'priority3']>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::teacher-capability.teacher-capability', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::teacher-capability.teacher-capability', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiTeacherPaymentTeacherPayment extends Schema.CollectionType {
    collectionName: 'teacher_payments';
    info: {
        singularName: 'teacher-payment';
        pluralName: 'teacher-payments';
        displayName: 'TeacherPayment';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        teacher: Attribute.Relation<'api::teacher-payment.teacher-payment', 'oneToOne', 'api::teacher.teacher'>;
        date: Attribute.Date & Attribute.Required;
        dueDate: Attribute.Date;
        paidDate: Attribute.Date;
        totalAmount: Attribute.Decimal;
        class: Attribute.Relation<'api::teacher-payment.teacher-payment', 'oneToOne', 'api::class.class'>;
        status: Attribute.Enumeration<['pending', 'paid', 'due', 'blocked']> & Attribute.DefaultTo<'pending'>;
        register: Attribute.Relation<'api::teacher-payment.teacher-payment', 'oneToOne', 'api::register.register'>;
        systemGenerated: Attribute.Boolean;
        notes: Attribute.Text;
        transactions: Attribute.Component<'default.teacher-payment-transaction', true> & Attribute.Required;
        type: Attribute.Enumeration<['lesson', 'bonus']> & Attribute.Required & Attribute.DefaultTo<'lesson'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::teacher-payment.teacher-payment', 'oneToOne', 'admin::user'> &
            Attribute.Private;
        updatedBy: Attribute.Relation<'api::teacher-payment.teacher-payment', 'oneToOne', 'admin::user'> &
            Attribute.Private;
    };
}

export interface ApiTopicTopic extends Schema.CollectionType {
    collectionName: 'topics';
    info: {
        singularName: 'topic';
        pluralName: 'topics';
        displayName: 'Topic';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        topicId: Attribute.String & Attribute.Required & Attribute.Unique;
        name: Attribute.String & Attribute.Required;
        category: Attribute.String & Attribute.Required;
        years: Attribute.Relation<'api::topic.topic', 'oneToMany', 'api::year.year'>;
        subject: Attribute.Relation<'api::topic.topic', 'oneToOne', 'api::subject.subject'>;
        exam_boards: Attribute.Relation<'api::topic.topic', 'oneToMany', 'api::exam-board.exam-board'>;
        description: Attribute.Text;
        topic_links: Attribute.Relation<'api::topic.topic', 'oneToMany', 'api::topic.topic'>;
        subject_level: Attribute.Relation<'api::topic.topic', 'oneToOne', 'api::subject-level.subject-level'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::topic.topic', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::topic.topic', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiUserTypeUserType extends Schema.CollectionType {
    collectionName: 'user_types';
    info: {
        singularName: 'user-type';
        pluralName: 'user-types';
        displayName: 'UserType';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::user-type.user-type', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::user-type.user-type', 'oneToOne', 'admin::user'> & Attribute.Private;
    };
}

export interface ApiYearYear extends Schema.CollectionType {
    collectionName: 'years';
    info: {
        singularName: 'year';
        pluralName: 'years';
        displayName: 'Year';
        description: '';
    };
    options: {
        draftAndPublish: false;
    };
    attributes: {
        name: Attribute.String & Attribute.Required & Attribute.Unique;
        shortName: Attribute.String & Attribute.Required & Attribute.Unique;
        otherName: Attribute.String & Attribute.Unique;
        order: Attribute.Integer;
        yearNumber: Attribute.String & Attribute.Unique;
        isALevels: Attribute.Boolean;
        education_level: Attribute.Relation<'api::year.year', 'manyToOne', 'api::education-level.education-level'>;
        createdAt: Attribute.DateTime;
        updatedAt: Attribute.DateTime;
        createdBy: Attribute.Relation<'api::year.year', 'oneToOne', 'admin::user'> & Attribute.Private;
        updatedBy: Attribute.Relation<'api::year.year', 'oneToOne', 'admin::user'> & Attribute.Private;
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
            'plugin::content-releases.release': PluginContentReleasesRelease;
            'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
            'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
            'plugin::users-permissions.role': PluginUsersPermissionsRole;
            'plugin::users-permissions.user': PluginUsersPermissionsUser;
            'plugin::i18n.locale': PluginI18NLocale;
            'api::admin.admin': ApiAdminAdmin;
            'api::admin-setting.admin-setting': ApiAdminSettingAdminSetting;
            'api::audit-log.audit-log': ApiAuditLogAuditLog;
            'api::class.class': ApiClassClass;
            'api::class-teacher.class-teacher': ApiClassTeacherClassTeacher;
            'api::class-topic.class-topic': ApiClassTopicClassTopic;
            'api::contractor.contractor': ApiContractorContractor;
            'api::education-level.education-level': ApiEducationLevelEducationLevel;
            'api::email-log.email-log': ApiEmailLogEmailLog;
            'api::event-message.event-message': ApiEventMessageEventMessage;
            'api::exam-board.exam-board': ApiExamBoardExamBoard;
            'api::family-link.family-link': ApiFamilyLinkFamilyLink;
            'api::group.group': ApiGroupGroup;
            'api::homework.homework': ApiHomeworkHomework;
            'api::homework-submission.homework-submission': ApiHomeworkSubmissionHomeworkSubmission;
            'api::id-config.id-config': ApiIdConfigIdConfig;
            'api::invoice.invoice': ApiInvoiceInvoice;
            'api::invoice-item.invoice-item': ApiInvoiceItemInvoiceItem;
            'api::issue-reason.issue-reason': ApiIssueReasonIssueReason;
            'api::meeting-account.meeting-account': ApiMeetingAccountMeetingAccount;
            'api::meeting-recording.meeting-recording': ApiMeetingRecordingMeetingRecording;
            'api::notice.notice': ApiNoticeNotice;
            'api::parent.parent': ApiParentParent;
            'api::payment-subscription.payment-subscription': ApiPaymentSubscriptionPaymentSubscription;
            'api::payment-subscription-item.payment-subscription-item': ApiPaymentSubscriptionItemPaymentSubscriptionItem;
            'api::register.register': ApiRegisterRegister;
            'api::register-student.register-student': ApiRegisterStudentRegisterStudent;
            'api::sales-management-note.sales-management-note': ApiSalesManagementNoteSalesManagementNote;
            'api::scholarship.scholarship': ApiScholarshipScholarship;
            'api::student.student': ApiStudentStudent;
            'api::student-class.student-class': ApiStudentClassStudentClass;
            'api::student-class-log.student-class-log': ApiStudentClassLogStudentClassLog;
            'api::student-feed.student-feed': ApiStudentFeedStudentFeed;
            'api::student-scholarship.student-scholarship': ApiStudentScholarshipStudentScholarship;
            'api::subject.subject': ApiSubjectSubject;
            'api::subject-level.subject-level': ApiSubjectLevelSubjectLevel;
            'api::subject-topic.subject-topic': ApiSubjectTopicSubjectTopic;
            'api::teacher.teacher': ApiTeacherTeacher;
            'api::teacher-capability.teacher-capability': ApiTeacherCapabilityTeacherCapability;
            'api::teacher-payment.teacher-payment': ApiTeacherPaymentTeacherPayment;
            'api::topic.topic': ApiTopicTopic;
            'api::user-type.user-type': ApiUserTypeUserType;
            'api::year.year': ApiYearYear;
        }
    }
}
