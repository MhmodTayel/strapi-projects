import type { Schema, Attribute } from '@strapi/strapi';

export interface DefaultTeacherPaymentTransaction extends Schema.Component {
    collectionName: 'components_default_teacher_payment_transactions';
    info: {
        displayName: 'TeacherPaymentTransaction';
        icon: 'bulletList';
        description: '';
    };
    attributes: {
        type: Attribute.Enumeration<['lesson', 'marking', 'bonus', 'penalty', 'commission']> & Attribute.Required;
        amount: Attribute.Decimal & Attribute.Required;
        systemGenerated: Attribute.Boolean & Attribute.DefaultTo<false>;
    };
}

declare module '@strapi/types' {
    export module Shared {
        export interface Components {
            'default.teacher-payment-transaction': DefaultTeacherPaymentTransaction;
        }
    }
}
