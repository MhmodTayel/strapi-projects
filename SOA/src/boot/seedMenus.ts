const menus = [
  {
    title: 'Footer-ar',
    slug: 'footer-ar',
  },
  {
    title: 'Footer-en',
    slug: 'footer-en',
  },
];

const UID = 'plugin::menus.menu';

export default async (strapi) => {
  // Delete records with slugs not in the menus array
  await strapi.db.query(UID).deleteMany({
    where: {
      slug: {
        $notIn: menus.map((item) => item.slug),
      },
    },
  });
  // Fetch existing menu slugs
  const existingMenus = (await strapi.db.query(UID).findMany({})).map(
    (menu) => menu.slug
  );

  // Create new records for menus that don't exist
  await Promise.all(
    menus.map(async (menu) => {
      if (!existingMenus.includes(menu.slug)) {
        await strapi.db.entityManager.create(UID, {
          data: menu,
        });
      }
    })
  );
};
