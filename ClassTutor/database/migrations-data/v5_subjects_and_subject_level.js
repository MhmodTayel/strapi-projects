module.exports = async () => {
    var subjects = [
        {
            name: 'iMedia',
            code: 'IMD'
        },
        {
            name: 'Maths: Applied',
            code: 'APP',
            parent: 'MAT'
        },
        {
            name: '11+',
            code: '11+'
        },
        {
            name: '11+ English',
            code: '11+ENG',
            parent: '11+'
        },
        {
            name: '11+ Maths',
            code: '11+MAT',
            parent: '11+'
        }
    ];

    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const existingSubject = await strapi.entityService.findMany('api::subject.subject', {
            filters: { code: subject.code.toUpperCase() }
        });

        if (existingSubject.length === 0) {
            var parentId = null;

            if (subject.parent) {
                const existingParentSubject = await strapi.entityService.findMany('api::subject.subject', {
                    filters: { code: subject.parent.toUpperCase() }
                });

                parentId = existingParentSubject[0].id;
            }

            await strapi.entityService.create('api::subject.subject', {
                data: {
                    name: subject.name,
                    code: subject.code.toUpperCase(),
                    parent_subject: parentId
                }
            });
        }
    }

    // update codes for existing subjects
    var subjectUpdates = [
        {
            name: 'Further Maths',
            newCode: 'FMAT',
            removeParent: true
        },
        {
            name: 'Further Maths: Core',
            newCode: 'COR',
            newParent: 'FMAT'
        },
        {
            name: 'Languages',
            newCode: 'LANG'
        },
        {
            name: 'Statistics',
            newCode: 'STAT'
        }
    ];

    for (let i = 0; i < subjectUpdates.length; i++) {
        const subjectUpdate = subjectUpdates[i];
        const existingSubject = await strapi.entityService.findMany('api::subject.subject', {
            filters: { name: subjectUpdate.name }
        });

        if (existingSubject.length > 0) {
            var data = {
                code: subjectUpdate.newCode
            };

            if (subjectUpdate.removeParent) data.parent_subject = null;

            if (subjectUpdate.newParent) {
                const existingParentSubject = await strapi.entityService.findMany('api::subject.subject', {
                    filters: { code: subjectUpdate.newParent.toUpperCase() }
                });

                data.parent_subject = existingParentSubject[0].id;
            }

            await strapi.entityService.update('api::subject.subject', existingSubject[0].id, {
                data: data
            });
        }
    }

    var subjectLevels = [
        {
            name: 'Foundation',
            code: 'F'
        },
        {
            name: 'Higher',
            code: 'H'
        }
    ];

    for (let i = 0; i < subjectLevels.length; i++) {
        const subjectLevel = subjectLevels[i];
        const existingSubjectLevel = await strapi.entityService.findMany('api::subject-level.subject-level', {
            filters: { name: subjectLevel.name }
        });

        if (existingSubjectLevel.length === 0) {
            await strapi.entityService.create('api::subject-level.subject-level', {
                data: {
                    name: subjectLevel.name,
                    code: subjectLevel.code
                }
            });
        }
    }
};
