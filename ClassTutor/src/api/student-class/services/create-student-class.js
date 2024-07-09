/**
 * @deprecated should be removed after make sure it doesn't used in anywhere in the frontend. 
 */
const createStudentClass = async (create, params) => {
    const result = await create(params);

    if (result.id > 0) {
        var student = await strapi.entityService.findOne(
            'api::student.student',
            params.data.student,
            {
                populate: ['agents']
            }
        );

        if (params.data.trialDate && params.data.class && params.data.status == 'trial') {
            var registers = await strapi.entityService.findMany('api::register.register', {
                filters: {
                    classDate: params.data.trialDate,
                    class: params.data.class
                },
                populate: ['class']
            });

            if (registers.length > 0) {
                var register = registers[0];

                const newRegisterStudent = await strapi.entityService.create(
                    'api::register-student.register-student',
                    {
                        data: {
                            name:
                                student.studentId +
                                ' ' +
                                register.class.classId +
                                ' ' +
                                register.classDate,
                            student: student.id,
                            register: register.id,
                            freeTrial: true,
                            student_class: result.id
                        }
                    }
                );
            }
        }

        // set agent with student
        var agentsToLink = [];
        for (let i = 0; i < student.agents.length; i++) {
            const agent = student.agents[i];

            agentsToLink.push(agent.id);
        }

        if (params.data.agents) {
            if (Array.isArray(params.data.agents)) {
                for (let i = 0; i < params.data.agents.length; i++) {
                    const agent = params.data.agents[i];

                    if (!_.includes(agentsToLink, agent.id)) {
                        agentsToLink.push(agent.id);
                    }
                }
            } else {
                if (!_.includes(agentsToLink, params.data.agents)) {
                    agentsToLink.push(params.data.agents);
                }
            }
        }

        await strapi.entityService.update('api::student.student', student.id, {
            data: {
                agents: agentsToLink
            }
        });
    }

    return result;
};

module.exports.createStudentClass = createStudentClass;
