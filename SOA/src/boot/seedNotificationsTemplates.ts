const templates_ar = [
  {
    slug: 'new-talents',
    title: 'اعضاء جدد',
    body: 'تم اضافة اعضاء جدد',
    type: 'new-talents',
    role: 'drama-maker',
  },
  {
    slug: 'info',
    title: 'اتصال من صانع عمل',
    body: 'تم البحث عنك من قبل صانع عمل',
    type: 'info',
    role: 'talent',
  },
  {
    slug: 'update-cv',
    title: 'استكمال بيانات',
    body: 'برجاء مراجعة بياناتك و تعديلها ليصل ملفك للباحثيين عنك',
    type: 'update-cv',
    role: 'talent',
  },
  {
    slug: 'renewal-request_rejected',
    title: 'طلب تجديد اشتراك النقابة',
    body: 'تم رفض الطلب رقم <ID> برجاء التوجه للنقابة ١ ش ٢٦ يوليو وسط البلد القاهره',
    type: 'renewal-request',
    role: 'talent',
  },
  {
    slug: 'renewal-request_accepted',
    title: 'طلب تجديد اشتراك النقابة',
    body: 'تم الموافقة على طلبك رقم <ID>, برجاء دفع الاشتراك',
    type: 'renewal-request',
    role: 'talent',
  },
  {
    slug: 'renewal-request_missingData',
    title: 'طلب تجديد اشتراك النقابة',
    body: 'برجاء استيفاء بعض البيانات لاستكمال طلبك رقم <ID>',
    type: 'renewal-request',
    role: 'talent',
  },
];
const templates_en = [
  {
    slug: 'new-talents',
    title: 'Syndicate Members',
    body: 'New syndicate members have been added ',
    type: 'new-talents',
    role: 'drama-maker',
  },
  {
    slug: 'info',
    title: 'Your Profile Was Viewed',
    body: 'A drama-maker has been searching for you',
    type: 'info',
    role: 'talent',
  },

  {
    slug: 'update-cv',
    title: 'Profile Update',
    body: "Please review your CV and amend it upon the reviewer's comments, so that your profile reaches the drama-makers",
    type: 'update-cv',
    role: 'talent',
  },
  {
    slug: 'renewal-request_rejected',
    title: 'Request Update',
    body: 'Your request <ID> has been rejected please visit at 1 st 26 July, Midtown, Cairo',
    type: 'renewal-request',
    role: 'talent',
  },
  {
    slug: 'renewal-request_accepted',
    title: 'Request Update',
    body: 'Your request <ID> has been approved, Please pay the syndicate fees',
    type: 'renewal-request',
    role: 'talent',
  },
  {
    slug: 'renewal-request_missingData',
    title: 'Request Update',
    body: 'Please update some details to proceed with your request <ID> ',
    type: 'renewal-request',
    role: 'talent',
  },
];

const UID = 'api::notification-template.notification-template';

export default async (strapi) => {
  await strapi.db.query(UID).deleteMany({});

  for (let i = 0; i < templates_ar.length; i++) {
    const { id } = await strapi.db.entityManager.create(UID, {
      data: { ...templates_ar[i], locale: 'ar-EG', status: 'created' },
    });
    const mainEntry = await strapi.entityService.create(UID, {
      data: {
        ...templates_en[i],
        locale: 'en',
        status: 'created',
        localizations: [id],
      },
      populate: ['localizations'],
    });
    await strapi
      .plugin('i18n')
      .service('localizations')
      .syncLocalizations(mainEntry, { model: strapi.getModel(UID) });
  }
};
