module.exports = async () => {
    const years = await strapi.entityService.findMany('api::year.year');
    const educationLevels = await strapi.entityService.findMany('api::education-level.education-level');

    const ks1 = educationLevels.find((e) => e.otherName === 'ks1');
    const ks2 = educationLevels.find((e) => e.otherName === 'ks2');
    const secondaryKs3 = educationLevels.find((e) => e.otherName === 'secondary');
    const gcse = educationLevels.find((e) => e.otherName === 'gcse');
    const alevels = educationLevels.find((e) => e.otherName === 'alevels');
    const university = educationLevels.find((e) => e.otherName === 'university');
    const adult = educationLevels.find((e) => e.otherName === 'adult');

    const year0 = years.find((y) => y.yearNumber === '0');
    const year1 = years.find((y) => y.yearNumber === '1');
    const year2 = years.find((y) => y.yearNumber === '2');
    const year3 = years.find((y) => y.yearNumber === '3');
    const year4 = years.find((y) => y.yearNumber === '4');
    const year5 = years.find((y) => y.yearNumber === '5');
    const year6 = years.find((y) => y.yearNumber === '6');
    const year7 = years.find((y) => y.yearNumber === '7');
    const year8 = years.find((y) => y.yearNumber === '8');
    const year9 = years.find((y) => y.yearNumber === '9');
    const year10 = years.find((y) => y.yearNumber === '10');
    const year11 = years.find((y) => y.yearNumber === '11');
    const year12 = years.find((y) => y.yearNumber === '12');
    const year13 = years.find((y) => y.yearNumber === '13');
    const yearUni = years.find((y) => y.yearNumber === '20');
    const yearAdult = years.find((y) => y.yearNumber === '30');

    var educationLevelYears = [
        { educationLevel: ks1, years: [year0.id, year1.id, year2.id] },
        { educationLevel: ks2, years: [year3.id, year4.id, year5.id, year6.id] },
        { educationLevel: secondaryKs3, years: [year7.id, year8.id, year9.id] },
        { educationLevel: gcse, years: [year10.id, year11.id] },
        { educationLevel: alevels, years: [year12.id, year13.id] },
        { educationLevel: university, years: [yearUni.id] },
        { educationLevel: adult, years: [yearAdult.id] }
    ];

    // iterate over each educationLevelYears and update the educationLevel object and add the year ids
    for (const educationLevelYear of educationLevelYears) {
        const educationLevel = await strapi.entityService.update(
            'api::education-level.education-level',
            educationLevelYear.educationLevel.id,
            {
                data: {
                    years: educationLevelYear.years
                }
            }
        );
    }
};
