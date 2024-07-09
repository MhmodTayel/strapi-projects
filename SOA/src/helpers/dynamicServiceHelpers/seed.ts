const { serviceUser, previewFields } = require('./constants');

module.exports = [
  {
    slug: 'api::soa-request-renewal.soa-request-renewal',
    label: 'تجديد اشتراك النقابة',
    description:
      'هذه الخدمة مخصصه لتجديد اشترك النقابة بالاضافه الي اشترك النادي والاشترك الطبي',
    fields: [
      {
        id: 'status',
        label: 'حالة الطلب',
        placeholder: '',
        previewType: previewFields.defaultField,
        validationType: 'string',
        validations: [
          {
            type: 'required',
            params: ['status field is required'],
          },
        ],
      },
      {
        id: 'renewWithClub',
        label: 'تجديد اشتراك النادي',
        placeholder: '',
        hint: '',
        previewType: previewFields.defaultField,
        validationType: 'boolean',
        validations: [
          {
            type: 'required',
            params: ['renewWithClub field is required'],
          },
          {
            type: 'oneOf',
            params: [[true], 'renewWithClub must be true'],
          },
        ],
      },
      {
        id: 'renewWithMedical',
        label: 'تجديد الاشتراك الطبي',
        placeholder: '',
        hint: '',
        previewType: previewFields.defaultField,
        validationType: 'boolean',
        validations: [],
      },
      {
        id: 'medicalMembers',
        label: 'الاعضاء التابعين فى التأمين الطبى',
        placeholder: '',
        hint: '',
        previewType: previewFields.array,
        validationType: 'array',
        validations: [
          {
            type: 'when',
            params: [
              ['renewWithMedical'],
              ([renewWithMedical], schema) => {
                return !renewWithMedical
                  ? schema
                      .transform((val) => null)
                      .default(null)
                      .nullable()
                  : schema.nullable();
              },
            ],
          },
        ],
      },
      {
        id: 'children',
        label: 'عدد الابناء',
        placeholder: '',
        hint: 'التجديد لاثنين بحد اقصي',

        previewType: previewFields.number,
        validationType: 'number',
        validations: [
          {
            type: 'when',
            params: [
              ['medicalMembers'],
              ([medicalMembers], schema) => {
                return medicalMembers?.includes('children')
                  ? schema.required('children count is required')
                  : schema
                      .transform((val) => null)
                      .default(null)
                      .nullable();
              },
            ],
          },
        ],
      },
      {
        id: 'nationalIDFront',
        label: 'صورة بطاقة الزوجة',
        placeholder: '',
        hint: 'أمامي',
        previewType: previewFields.attachment,
        validationType: 'mixed',
        required: true,
        validations: [
          {
            type: 'when',
            params: [
              ['medicalMembers'],
              ([medicalMembers], schema) => {
                return medicalMembers?.includes('wife')
                  ? schema
                      .required('nationalIDFront are required')
                      .transform((val) => (Array.isArray(val) ? val : [val]))
                  : schema
                      .transform((val) => null)
                      .default(null)
                      .nullable();
              },
            ],
          },
        ],
      },
      {
        id: 'nationalIDBack',
        label: 'صورة بطاقة الزوجة',
        placeholder: '',
        hint: 'خلفي',
        previewType: previewFields.attachment,
        validationType: 'mixed',
        required: true,
        validations: [
          {
            type: 'when',
            params: [
              ['medicalMembers'],
              ([medicalMembers], schema) => {
                return medicalMembers?.includes('wife')
                  ? schema
                      .required('nationalIDBack are required')
                      .transform((val) => (Array.isArray(val) ? val : [val]))
                  : schema
                      .transform((val) => null)
                      .default(null)
                      .nullable();
              },
            ],
          },
        ],
      },

      {
        id: 'wifeAttachments',
        label: 'مرفقات الزوجة',
        placeholder: '',
        hint: 'شهادة تأمينات أن الزوجة لا تعمل',
        previewType: previewFields.attachment,
        validationType: 'array',
        required: true,
        validations: [
          {
            type: 'when',
            params: [
              ['medicalMembers'],
              ([medicalMembers], schema) => {
                return medicalMembers?.includes('wife')
                  ? schema
                      .required('wifeAttachments are required')
                      .min(1, 'wifeAttachments are required')
                  : schema
                      .transform((val) => null)
                      .default(null)
                      .nullable();
              },
            ],
          },
        ],
      },
      {
        id: 'childrenAttachments',
        label: 'مرفقات الابناء',
        placeholder: '',
        hint: 'شهادات ميلاد الابناء',
        previewType: previewFields.attachment,
        validationType: 'array',
        required: true,
        validations: [
          {
            type: 'when',
            params: [
              ['medicalMembers'],
              ([medicalMembers], schema) => {
                return medicalMembers?.includes('children')
                  ? schema
                      .required('childrenAttachments are required')
                      .min(1, 'childrenAttachments are required')
                  : schema
                      .transform((val) => null)
                      .default(null)
                      .nullable();
              },
            ],
          },
        ],
      },
      {
        id: 'rejectComment',
        label: 'سبب الرفض',
        placeholder: '',
        required: true,
        enabled: true,
        hint: '',
        previewType: previewFields.defaultField,
        validationType: 'string',
        validations: [
          {
            type: 'required',
            params: ['برجاء كتابة تعليقك'],
          },
        ],
      },
      {
        id: 'renewalAmount',
        label: 'المبلغ',
        placeholder: '',
        required: true,
        enabled: true,
        hint: '',
        previewType: previewFields.number,
        validationType: 'number',
        validations: [
          {
            type: 'required',
            params: ['برجاء كتابة المبلغ المستحق'],
          },
        ],
      },
      {
        id: 'editComment',
        label: 'تعليق استيفاء البيانات',
        placeholder: '',
        required: true,
        enabled: true,
        hint: '',
        previewType: previewFields.defaultField,
        validationType: 'string',
        validations: [
          {
            type: 'required',
            params: ['برجاء كتابة تعليقك'],
          },
        ],
      },
      {
        id: 'syndicateID',
        label: 'رقم العضوية الحالي',
        placeholder: '',
        required: true,
        hint: '',
        previewType: previewFields.defaultField,
        validationType: 'string',
        enabled: false,
        initialValue: 'syndicateID',
        validations: [],
      },
      {
        id: 'newSyndicateID',
        label: 'رقم العضوية الجديد',
        placeholder: '',
        required: true,
        enabled: true,
        hint: '',
        previewType: previewFields.number,
        validationType: 'string',
        validations: [
          {
            type: 'required',
            params: ['برجاء ادخال رقم العضوية الجديد'],
          },
        ],
      },
      {
        id: 'invoice',
        label: 'صورة الإيصال',
        placeholder: '',
        previewType: previewFields.attachment,
        validationType: 'mixed',
        required: true,
        enabled: true,
        validations: [
          {
            type: 'required',
            params: ['invoice field is required'],
          },
        ],
      },
    ],
    activities: [
      {
        owner: serviceUser.portal,
        fields: {
          reviewing: [
            'renewWithClub',
            'renewWithMedical',
            'medicalMembers',
            'children',
            'nationalIDFront',
            'nationalIDBack',
            'wifeAttachments',
            'childrenAttachments',
          ],
        },
        previewFields: [
          'renewWithClub',
          'renewWithMedical',
          'medicalMembers',
          'children',
          'nationalIDFront',
          'nationalIDBack',
          'wifeAttachments',
          'childrenAttachments',
          'status',
          'editComment',
        ],
        statusFrom: ['N/A', 'missingData'],
        statusTo: ['reviewing'],
      },
      {
        owner: serviceUser.adminPanal,
        fields: {
          rejected: ['status', 'rejectComment'],
          waitForPayment: ['status', 'renewalAmount'],
          missingData: ['status', 'editComment'],
          paid: ['status', 'renewalAmount', 'invoice'],
        },
        previewFields: [
          'renewWithClub',
          'renewWithMedical',
          'medicalMembers',
          'children',
          'nationalIDFront',
          'nationalIDBack',
          'wifeAttachments',
          'childrenAttachments',
          'status',
          'editComment',
        ],
        controllers: [
          {
            type: 'accept',
            action: {
              popupLabel: 'تحويل الطلب للدفع',
              actionLabel: 'قبول الطلب',
              data: { status: 'waitForPayment' },
              fields: ['renewalAmount'],
            },
          },
          {
            type: 'edit',
            action: {
              popupLabel: 'تحويل الطلب لأستيفاء بيانات',
              actionLabel: 'استيفاء بيانات',

              data: { status: 'missingData' },
              fields: ['editComment'],
            },
          },
          {
            type: 'reject',
            action: {
              popupLabel: 'تحويل الطلب لتم الرفض',
              actionLabel: 'رفض الطلب',
              data: { status: 'rejected' },
              fields: ['rejectComment'],
            },
          },
          {
            type: 'confirmPayment',
            action: {
              popupLabel: 'تم الدفع فى الخزنة',
              actionLabel: 'الدفع فى الخزنة',
              data: { status: 'paid' },
              fields: ['renewalAmount', 'invoice'],
            },
          },
        ],
        statusFrom: ['reviewing'],
        statusTo: ['rejected', 'waitForPayment', 'missingData', 'paid'],
      },
      {
        owner: serviceUser.portal,
        fields: {
          paid: ['status'],
        },
        previewFields: [
          'renewWithClub',
          'renewWithMedical',
          'medicalMembers',
          'children',
          'nationalIDFront',
          'nationalIDBack',
          'wifeAttachments',
          'childrenAttachments',
          'status',
          'renewalAmount',
        ],
        statusFrom: ['waitForPayment'],
        statusTo: ['paid'],
      },
      {
        owner: serviceUser.portal,
        fields: {
          cancelled: ['status'],
        },
        statusFrom: ['missingData', 'reviewing', 'waitForPayment'],
        statusTo: ['cancelled'],
      },
      {
        previewFields: [
          'renewWithClub',
          'renewWithMedical',
          'medicalMembers',
          'children',
          'nationalIDFront',
          'nationalIDBack',
          'wifeAttachments',
          'childrenAttachments',
          'status',
          'rejectComment',
          'renewalAmount',
        ],
        statusFrom: ['cancelled', 'picked'],
        statusTo: [],
      },
      {
        owner: serviceUser.adminPanal,
        fields: {
          readyToPick: ['status', 'newSyndicateID'],
        },
        previewFields: [
          'renewWithClub',
          'renewWithMedical',
          'medicalMembers',
          'children',
          'nationalIDFront',
          'nationalIDBack',
          'wifeAttachments',
          'childrenAttachments',
          'status',
          'renewalAmount',
          'invoice',
        ],
        controllers: [
          {
            type: 'accept',
            action: {
              popupLabel: 'تحويل الطلب الي جاهز للاستلام',
              actionLabel: 'جاهز للاستلام',
              data: { status: 'readyToPick' },
              fields: ['syndicateID', 'newSyndicateID'],
            },
          },
        ],
        statusFrom: ['paid'],
        statusTo: ['readyToPick'],
      },
      {
        owner: serviceUser.adminPanal,
        fields: {
          picked: ['status'],
        },
        previewFields: [
          'renewWithClub',
          'renewWithMedical',
          'medicalMembers',
          'children',
          'nationalIDFront',
          'nationalIDBack',
          'wifeAttachments',
          'childrenAttachments',
          'status',
          'renewalAmount',
          'invoice',
        ],
        controllers: [
          {
            type: 'accept',
            action: {
              popupLabel: 'تحويل الطلب الي تم الاستلام',
              actionLabel: 'تم للاستلام',
              data: { status: 'picked' },
              fields: ['syndicateID'],
            },
          },
        ],
        statusFrom: ['readyToPick'],
        statusTo: ['picked'],
      },
      {
        owner: serviceUser.adminPanal,
        fields: {
          paid: ['status', 'renewalAmount', 'invoice'],
        },
        previewFields: [
          'renewWithClub',
          'renewWithMedical',
          'medicalMembers',
          'children',
          'nationalIDFront',
          'nationalIDBack',
          'wifeAttachments',
          'childrenAttachments',
          'status',
          'rejectComment',
          'editComment',
          'renewalAmount',
        ],
        controllers: [
          {
            type: 'confirmPayment',
            action: {
              popupLabel: 'تم الدفع فى الخزنة',
              actionLabel: 'الدفع فى الخزنة',
              data: { status: 'paid' },
              fields: ['renewalAmount', 'invoice'],
            },
          },
        ],
        statusFrom: ['waitForPayment', 'missingData', 'rejected'],
        statusTo: ['paid'],
      },
    ],

    tableHeaders: {
      id: 'رقم الطلب',
      serviceName: 'اسم الخدمة',
      createdAt: 'تاريخ الإنشاء',
      updatedAt: 'تاريخ آخر تعديل',
      status: 'حالة الطلب',
    },
    userFields: [
      {
        arabicName: 'مقدم الطلب',
      },
      { phone: 'الهاتف' },
      { division: 'الشعبة' },
      { syndicateID: 'رقم العضوية' },
    ],
    dictionary: {
      wife: 'الزوجة',
      children: 'الاولاد',
      true: 'نعم',
      false: 'لا',
      reviewing: 'قيد المراجعة',
      missingData: 'استيفاء بيانات',
      waitForPayment: 'في أنتظار الدفع',
      rejected: 'تم الرفض',
      cancelled: 'تم الغاء الطلب',
      paid: 'تم الدفع',
      readyToPick: 'جاهز للاستلام',
      picked: 'تم الاستلام',
      NA: 'انشاء طلب',
    },
  },
];
