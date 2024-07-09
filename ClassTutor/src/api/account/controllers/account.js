const axios = require('axios');
const baseUrl = 'http://localhost:3000';
const AccountUtils = require('../../../../utils/account-utils');
const EmailHelper = require('../../../../utils/email-helper');
const EmailTemplates = require('../../../../utils/email-templates');
const _ = require('lodash');

module.exports = {
    async create(ctx, next) {
        try {
            var data = ctx.request.body;

            var parentsToAdd = data.parentsToAdd || [];
            var parentsToInvite = data.parentsToInvite || [];
            var parentIdsToLink = data.parentIdsToLink || [];
            var studentIdsToLink = data.studentIdsToLink || [];
            var studentsToAdd = data.studentsToAdd || [];
            var teacherToAdd = data.teacherToAdd;
            var signupTokenFromRequest = data.signupToken;
            var signupAsFromRequest = data.signupAs;

            var isStudentInviteSignup = signupAsFromRequest == 'student' && signupTokenFromRequest;
            var isParentInviteSignup = signupAsFromRequest == 'parent' && signupTokenFromRequest;

            var isStudentDirectSignup = signupAsFromRequest == 'student' && !signupTokenFromRequest;
            var isParentDirectSignup = signupAsFromRequest == 'parent' && !signupTokenFromRequest;

            var validationResult = await validateSignup(
                parentsToAdd,
                parentsToInvite,
                studentsToAdd,
                teacherToAdd,
                isStudentDirectSignup
            );

            if (validationResult.length > 0) {
                return ctx.badRequest('Validation Errors', {
                    errors: validationResult
                });
            }

            var parentsAdded = [];
            var parentsInvited = [];
            var studentsAdded = [];
            var teacherAdded = null;
            var emailsToSendForSignup = [];
            var emailToSendWelcome = {
                students: [],
                parents: []
            };
            var invitedByName = '';

            var parentIds = [];
            var studentIds = [];
            var billingParentId = null;
            for (let index = 0; index < parentsToAdd.length; index++) {
                const parentToAdd = parentsToAdd[index];

                if (!parentToAdd.name) continue;

                parentToAdd.name = cleanName(parentToAdd.name);
                parentToAdd.lastName = cleanName(parentToAdd.lastName);

                var existingParent = null;
                if (parentToAdd.parentId) {
                    // existing
                    var existingParents = await strapi.entityService.findMany('api::parent.parent', {
                        filters: { parentId: parentToAdd.parentId },
                        populate: ['user']
                    });

                    if (existingParents.length > 0) {
                        existingParent = existingParents[0];
                    }
                }

                if (!existingParent) {
                    // create parent

                    const newParent = await strapi.entityService.create('api::parent.parent', {
                        data: {
                            parentId: !_.isEmpty(parentToAdd?.parentId) ? parentToAdd?.parentId : 'GEN_NEW_ID',
                            name: parentToAdd.name,
                            lastName: parentToAdd.lastName,
                            email: parentToAdd.email.toLowerCase(),
                            phone: parentToAdd.phone,
                            phoneCountryCode: parentToAdd.phoneCountryCode,
                            avatarImageName: parentToAdd.avatarImageName,
                            gender: parentToAdd.gender,
                            password: parentToAdd.password
                        }
                    });
                    parentIds.push(newParent.id);
                    billingParentId = newParent.id;

                    if (!invitedByName && signupAsFromRequest != 'admin')
                        invitedByName = parentToAdd.name + ' ' + parentToAdd.lastName;

                    const newParentCreated = await strapi.entityService.findOne('api::parent.parent', newParent.id, {
                        populate: ['user']
                    });

                    parentsAdded.push({
                        parentId: newParent.parentId,
                        name: newParent.name,
                        lastName: newParent.lastName,
                        email: newParent.email.toLowerCase(),
                        username: newParentCreated.user.username,
                        avatarImageName: newParent.avatarImageName
                    });

                    if (!parentToAdd.password) {
                        emailsToSendForSignup.push({
                            email: newParent.email,
                            name: newParent.name + ' ' + newParent.lastName,
                            token: newParentCreated.user.signupToken,
                            type: 'parent'
                        });
                    }

                    emailToSendWelcome.email = newParent.email;
                    emailToSendWelcome.username = newParentCreated.user.username;
                    emailToSendWelcome.name = newParent.name + ' ' + newParent.lastName;
                } else {
                    // update existing record
                    var parentUpdated = await strapi.entityService.update('api::parent.parent', existingParent.id, {
                        data: {
                            parentId: !_.isEmpty(parentToAdd?.parentId)
                                ? parentToAdd?.parentId
                                : existingParent.parentId ?? 'GEN_NEW_ID',
                            name: parentToAdd.name,
                            lastName: parentToAdd.lastName,
                            email: parentToAdd.email.toLowerCase(),
                            phone: parentToAdd.phone,
                            phoneCountryCode: parentToAdd.phoneCountryCode,
                            avatarImageName: parentToAdd.avatarImageName,
                            gender: parentToAdd.gender
                        }
                    });
                    parentIds.push(existingParent.id);
                    billingParentId = parentUpdated.id;

                    if (!invitedByName && signupAsFromRequest != 'admin')
                        invitedByName = parentToAdd.name + ' ' + parentToAdd.lastName;

                    var isEmailChanged = parentToAdd.email.toLowerCase() != existingParent.email.toLowerCase();

                    var parentUserUpdated = await strapi.entityService.update(
                        'plugin::users-permissions.user',
                        existingParent.user.id,
                        {
                            data: {
                                email: parentToAdd.email.toLowerCase(),
                                password: parentToAdd.password || AccountUtils.generateRandomPassword(), // random password
                                signupToken: isEmailChanged ? AccountUtils.randomUUID() : ''
                            }
                        }
                    );

                    parentsAdded.push({
                        parentId: parentUpdated.parentId,
                        name: parentUpdated.name,
                        lastName: parentUpdated.lastName,
                        email: parentUpdated.email.toLowerCase(),
                        username: parentUserUpdated.username,
                        signupToken: parentUserUpdated.signupToken,
                        avatarImageName: parentUpdated.avatarImageName
                    });

                    emailToSendWelcome.email = parentUpdated.email;
                    emailToSendWelcome.username = parentUserUpdated.username;
                    emailToSendWelcome.name = parentUpdated.name + ' ' + parentUpdated.lastName;
                }
            }

            for (let index = 0; index < parentsToInvite.length; index++) {
                const parentToInvite = parentsToInvite[index];

                parentToInvite.name = cleanName(parentToInvite.name);
                parentToInvite.lastName = cleanName(parentToInvite.lastName);

                // create parent

                const newParent = await strapi.entityService.create('api::parent.parent', {
                    data: {
                        parentId: !_.isEmpty(parentToInvite?.parentId) ? parentToInvite?.parentId : 'GEN_NEW_ID',
                        name: parentToInvite.name,
                        lastName: parentToInvite.lastName,
                        email: parentToInvite.email.toLowerCase(),
                        phone: parentToInvite.phone,
                        phoneCountryCode: parentToInvite.phoneCountryCode,
                        avatarImageName: parentToInvite.avatarImageName,
                        gender: parentToInvite.gender,
                        source: 'invite'
                    }
                });

                parentIds.push(newParent.id);
                if (!billingParentId) billingParentId = newParent.id;

                const newParentCreated = await strapi.entityService.findOne('api::parent.parent', newParent.id, {
                    populate: ['user']
                });

                parentsInvited.push({
                    parentId: newParent.parentId,
                    name: newParent.name,
                    lastName: newParent.lastName,
                    email: newParent.email.toLowerCase(),
                    username: newParentCreated.user.username,
                    signupToken: newParentCreated.user.signupToken,
                    avatarImageName: newParent.avatarImageName
                });

                emailsToSendForSignup.push({
                    email: newParent.email,
                    name: newParent.name + ' ' + newParent.lastName,
                    token: newParentCreated.user.signupToken,
                    type: 'parent'
                });

                emailToSendWelcome.parents.push({
                    name: newParent.name + ' ' + newParent.lastName,
                    email: newParent.email,
                    username: newParentCreated.user.username
                });
            }

            for (let index = 0; index < parentIdsToLink.length; index++) {
                const parentIdToLink = parentIdsToLink[index];

                parentIds.push(parseInt(parentIdToLink));
                if (!billingParentId) billingParentId = parentIdToLink;
            }

            var subjects = await strapi.entityService.findMany('api::subject.subject');
            var years = await strapi.entityService.findMany('api::year.year');

            for (let index = 0; index < studentsToAdd.length; index++) {
                const studentToAdd = studentsToAdd[index];

                if (!studentToAdd.name) continue;

                studentToAdd.name = cleanName(studentToAdd.name);
                studentToAdd.lastName = cleanName(studentToAdd.lastName);

                var existingStudent = null;
                if (studentToAdd.studentId) {
                    // existing
                    var existingStudents = await strapi.entityService.findMany('api::student.student', {
                        filters: { studentId: studentToAdd.studentId },
                        populate: ['user']
                    });

                    if (existingStudents.length > 0) {
                        existingStudent = existingStudents[0];

                        if (!studentToAdd.isDeleted)
                            // only add if the student is not meant to be deleted
                            studentIds.push(existingStudent.id);
                    }
                }

                if (!billingParentId) {
                    const studentFamilyLink = await strapi
                        .service('api::family-link.family-link')
                        .findByEntityId('student', existingStudent.id);
                    billingParentId = _.first(studentFamilyLink?.parentIds);
                }

                if (studentToAdd.isDeleted) {
                    var studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
                        filters: { student: existingStudent.id }
                    });

                    for (let i = 0; i < studentClasses.length; i++) {
                        const sc = studentClasses[i];

                        await strapi.entityService.delete('api::student-class.student-class', sc.id);
                    }

                    await strapi.entityService.delete('api::student.student', existingStudent.id);
                    await strapi.entityService.delete('plugin::users-permissions.user', existingStudent.user.id);

                    continue;
                }

                var subjectIds = [];

                if (studentToAdd.subjects) {
                    for (let index = 0; index < studentToAdd.subjects.length; index++) {
                        const selectedSubject = studentToAdd.subjects[index];

                        var sub = subjects.find((x) => x.name.toLowerCase() == selectedSubject.toLowerCase());
                        subjectIds.push(sub.id);
                    }
                }

                var selectedYear = years.find(
                    (x) =>
                        x.name.toLowerCase() == studentToAdd.year?.toLowerCase() ||
                        x.shortName.toLowerCase() == studentToAdd.year?.toLowerCase() ||
                        x.otherName.toLowerCase() == studentToAdd.year?.toLowerCase()
                );

                if (!existingStudent) {
                    // create student
                    var studentData = {
                        data: {
                            studentId: !_.isEmpty(studentToAdd?.studentId) ? studentToAdd?.studentId : 'GEN_NEW_ID',
                            name: studentToAdd.name,
                            lastName: studentToAdd.lastName,
                            email: (studentToAdd.email || '').toLowerCase(),
                            phone: studentToAdd.phone,
                            phoneCountryCode: studentToAdd.phoneCountryCode,
                            isSen: studentToAdd.isSen,
                            senRequirements: studentToAdd.senRequirements,
                            subjectsIntro: studentToAdd.subjectsIntro,
                            schoolName: studentToAdd.schoolName,
                            year: selectedYear?.id,
                            avatarImageName: studentToAdd.avatarImageName,
                            gender: studentToAdd.gender,
                            source: 'form',
                            group: studentToAdd.group,
                        }
                    };

                    if (!invitedByName && signupAsFromRequest != 'admin')
                        invitedByName = studentToAdd.name + ' ' + studentToAdd.lastName;

                    var isSignupAsStudent = false;
                    if (studentToAdd.password) {
                        isSignupAsStudent = true;
                        studentData.data.password = studentToAdd.password;
                    }

                    if (!studentToAdd.email) {
                        // generate random password for parents to give to students
                        studentToAdd.password = AccountUtils.generateReadableRandomPassword();
                        studentData.data.password = studentToAdd.password;
                    }

                    if (billingParentId) {
                        studentData.data.primary_parent = billingParentId;
                    }

                    var sendInviteEmail = false;
                    if (!isSignupAsStudent) {
                        if (studentToAdd.email) {
                            sendInviteEmail = true;
                            studentData.data.source = 'invite';
                        }
                    }

                    const newStudent = await strapi.entityService.create('api::student.student', studentData);
                    studentIds.push(newStudent.id);

                    var newStudentCreated = await strapi.entityService.findOne('api::student.student', newStudent.id, {
                        populate: ['user']
                    });

                    studentsAdded.push({
                        studentId: newStudent.studentId,
                        name: newStudent.name,
                        lastName: newStudent.lastName,
                        email: AccountUtils.cleanEmail(newStudent.email),
                        username: newStudentCreated.user.username,
                        signupToken: newStudentCreated.user.signupToken,
                        avatarImageName: newStudent.avatarImageName
                    });

                    // create new student-class link for each subject
                    for (let i = 0; i < subjectIds.length; i++) {
                        const subjectId = subjectIds[i];

                        var scData = {
                            name: newStudent.studentId,
                            student: newStudent.id,
                            subject: subjectId,
                            year: selectedYear.id,
                            source: 'portal'
                        };

                        if (billingParentId) {
                            scData.billing_parent = billingParentId;
                        }

                        var studentClassLink = await strapi.entityService.create('api::student-class.student-class', {
                            data: scData
                        });
                    }

                    await strapi.service('api::event-message.event-message').send({
                        eventCode: '1001',
                        template: 'A new student {{name}} has signed up',
                        entity: 'student',
                        entityId: newStudent.id,
                        receiverId: 'admin-users',
                        messageValues: { name: newStudent.name + ' ' + newStudent.lastName }
                    });

                    if (sendInviteEmail) {
                        emailsToSendForSignup.push({
                            email: newStudent.email,
                            name: newStudent.name + ' ' + newStudent.lastName,
                            token: newStudentCreated.user.signupToken,
                            type: 'student'
                        });
                    }

                    if (!isSignupAsStudent) {
                        emailToSendWelcome.students.push({
                            name: studentToAdd.name + ' ' + studentToAdd.lastName,
                            email: studentToAdd.email,
                            username: newStudentCreated.user.username,
                            password: studentToAdd.password || ''
                        });
                    }

                    if (studentToAdd.email && isSignupAsStudent) {
                        emailToSendWelcome.email = studentToAdd.email;
                        emailToSendWelcome.username = newStudentCreated.user.username;
                        emailToSendWelcome.name = studentToAdd.name + ' ' + studentToAdd.lastName;
                    }
                } else {
                    // update existing record

                    var studentUpdated = await strapi.entityService.update('api::student.student', existingStudent.id, {
                        data: {
                            studentId: !_.isEmpty(studentToAdd?.studentId)
                                ? studentToAdd?.studentId
                                : existingStudent.studentId ?? 'GEN_NEW_ID',
                            name: studentToAdd.name,
                            lastName: studentToAdd.lastName,
                            email: (studentToAdd.email || '').toLowerCase() || AccountUtils.generateRandomEmail(),
                            phone: studentToAdd.phone,
                            phoneCountryCode: studentToAdd.phoneCountryCode,
                            isSen: studentToAdd.isSen,
                            senRequirements: studentToAdd.senRequirements,
                            subjectsIntro: studentToAdd.subjectsIntro,
                            schoolName: studentToAdd.schoolName,
                            year: selectedYear.id,
                            avatarImageName: studentToAdd.avatarImageName,
                            gender: studentToAdd.gender
                        }
                    });

                    if (!invitedByName && signupAsFromRequest != 'admin')
                        invitedByName = studentToAdd.name + ' ' + studentToAdd.lastName;

                    var existingStudentClassLinks = await strapi.entityService.findMany(
                        'api::student-class.student-class',
                        {
                            filters: { student: studentUpdated.id },
                            populate: ['subject']
                        }
                    );

                    // create or update student-class link for each subject
                    for (let i = 0; i < subjectIds.length; i++) {
                        const subjectId = subjectIds[i];

                        var existing = existingStudentClassLinks.find((x) => x.subject.id == subjectId);
                        if (!existing) {
                            var scData = {
                                name: studentUpdated.studentId,
                                student: studentUpdated.id,
                                subject: subjectId,
                                year: selectedYear.id,
                                source: 'portal'
                            };

                            if (billingParentId) {
                                scData.billing_parent = billingParentId;
                            }

                            var studentClassLink = await strapi.entityService.create(
                                'api::student-class.student-class',
                                {
                                    data: scData
                                }
                            );
                        }
                    }

                    if (!studentToAdd.email) {
                        // generate random password
                        studentToAdd.password = AccountUtils.generateReadableRandomPassword();
                    }

                    var signupToken = null;
                    if (existingStudent.user) {
                        var existingStudentUserData = {
                            email: (studentToAdd.email || '').toLowerCase() || AccountUtils.generateRandomEmail(),
                            password: studentToAdd.password || AccountUtils.generateRandomPassword(), // random password
                            student: studentUpdated.id
                        };

                        if (studentToAdd.email) {
                            var isEmailChanged = studentToAdd.email != existingStudent.email;

                            if (isEmailChanged) {
                                existingStudentUserData.signupToken = AccountUtils.randomUUID();
                                signupToken = existingStudentUserData.signupToken;
                            }

                            existingStudentUserData.source = 'invite';
                        }

                        var studentUserUpdated = await strapi.entityService.update(
                            'plugin::users-permissions.user',
                            existingStudent.user.id,
                            {
                                data: existingStudentUserData
                            }
                        );

                        if (existingStudentUserData.signupToken) {
                            emailsToSendForSignup.push({
                                email: studentToAdd.email,
                                name: existingStudent.name + ' ' + existingStudent.lastName,
                                token: existingStudentUserData.signupToken,
                                type: 'student'
                            });
                        }
                    }

                    studentsAdded.push({
                        studentId: studentUpdated.studentId,
                        name: studentUpdated.name,
                        lastName: studentUpdated.lastName,
                        email: AccountUtils.cleanEmail(studentUpdated.email),
                        username: existingStudent.user.username,
                        signupToken: signupToken,
                        avatarImageName: studentToAdd.avatarImageName
                    });

                    emailToSendWelcome.students.push({
                        name: studentUpdated.name + ' ' + studentUpdated.lastName,
                        email: studentUpdated.email,
                        username: existingStudent.user.username,
                        password: studentToAdd.password || ''
                    });
                }
            }

            for (let index = 0; index < studentIdsToLink.length; index++) {
                const studentIdToLink = studentIdsToLink[index];

                studentIds.push(parseInt(studentIdToLink));
            }

            if (teacherToAdd) {
                // create teacher
                let existingTeacher;
                if (teacherToAdd.teacherId) {
                    // existing
                    existingTeacher = _.first(
                        await strapi.entityService.findMany('api::teacher.teacher', {
                            filters: { teacherId: teacherToAdd.teacherId },
                            populate: ['user', 'photo', 'cv', 'coverLetter']
                        })
                    );
                }

                teacherToAdd.name = cleanName(teacherToAdd.name);
                teacherToAdd.lastName = cleanName(teacherToAdd.lastName);
                const teacherData = {
                    teacherId: !_.isEmpty(teacherToAdd?.teacherId)
                        ? teacherToAdd?.teacherId
                        : existingTeacher?.teacherId ?? 'GEN_NEW_ID',
                    name: teacherToAdd.name,
                    lastName: teacherToAdd.lastName,
                    email: existingTeacher?.email ?? teacherToAdd?.email.toLowerCase(),
                    phone: teacherToAdd.phone,
                    phoneCountryCode: teacherToAdd.phoneCountryCode,
                    linkedInProfile: teacherToAdd.linkedInProfile,
                    country: teacherToAdd.country,
                    gender: teacherToAdd.gender,
                    password: teacherToAdd.password
                };

                var inviteFromAdmin = false;
                if (!teacherToAdd.password) inviteFromAdmin = true;

                if (teacherToAdd.cv && teacherToAdd.cv != '') {
                    if (
                        existingTeacher &&
                        existingTeacher?.cv?.length &&
                        existingTeacher?.cv?.at(0)?.id?.toString() !== teacherToAdd.cv?.at(0)?.toString()
                    ) {
                        await strapi.service('api::upload.upload').removeById(existingTeacher?.cv?.at(0)?.id);
                    }
                    teacherData.cv = teacherToAdd.cv;
                }
                if (teacherToAdd.coverLetter && teacherToAdd.coverLetter != '') {
                    if (
                        existingTeacher &&
                        existingTeacher?.coverLetter?.length &&
                        existingTeacher?.coverLetter?.at(0)?.id?.toString() !==
                            teacherToAdd.coverLetter?.at(0)?.toString()
                    ) {
                        await strapi.service('api::upload.upload').removeById(existingTeacher?.coverLetter?.at(0)?.id);
                    }
                    teacherData.coverLetter = teacherToAdd.coverLetter;
                }

                if (teacherToAdd.photo && teacherToAdd.photo != '') {
                    if (
                        existingTeacher &&
                        existingTeacher?.photo?.length &&
                        existingTeacher?.photo?.at(0)?.id?.toString() !== teacherToAdd.photo?.at(0)?.toString()
                    ) {
                        await strapi.service('api::upload.upload').removeById(existingTeacher?.photo?.at(0)?.id);
                    }
                    teacherData.photo = teacherToAdd.photo;
                }

                let teacherIdToUse;
                if (!existingTeacher) {
                    // create
                    var newTeacher = await strapi.entityService.create('api::teacher.teacher', {
                        data: teacherData
                    });
                    teacherIdToUse = newTeacher.id;
                } else {
                    // update
                    await strapi.entityService.update('api::teacher.teacher', existingTeacher.id, {
                        data: teacherData
                    });

                    await strapi.entityService.update('plugin::users-permissions.user', existingTeacher.user.id, {
                        data: {
                            password: teacherToAdd.password || AccountUtils.generateRandomPassword(),
                            signupToken: AccountUtils.randomUUID()
                        }
                    });

                    teacherIdToUse = existingTeacher.id;
                }

                if (teacherToAdd.capabilities) {
                    await strapi
                        .service('api::teacher-capability.teacher-capability')
                        .updateForTeacher(teacherIdToUse, teacherToAdd.capabilities);
                }

                var newTeacherCreatedOrUpdated = await strapi.entityService.findOne(
                    'api::teacher.teacher',
                    teacherIdToUse,
                    {
                        populate: ['user']
                    }
                );

                teacherAdded = {
                    id: newTeacherCreatedOrUpdated.id,
                    teacherId: newTeacherCreatedOrUpdated.teacherId,
                    name: newTeacherCreatedOrUpdated.name,
                    lastName: newTeacherCreatedOrUpdated.lastName,
                    email: newTeacherCreatedOrUpdated.email.toLowerCase(),
                    username: newTeacherCreatedOrUpdated.user.username,
                    signupToken: newTeacherCreatedOrUpdated.user.signupToken
                };

                if (!inviteFromAdmin) {
                    await strapi.service('api::event-message.event-message').send({
                        eventCode: '1002',
                        template: 'A new teacher {{name}} has signed up',
                        entity: 'teacher',
                        entityId: teacherAdded.id,
                        receiverId: 'admin-users',
                        messageValues: { name: teacherAdded.name + ' ' + teacherAdded.lastName }
                    });

                    await EmailHelper.sendTemplateEmail(
                        EmailTemplates.TEACHER.TEACHER_SIGNUP_APPLICATION_RECEIVED,
                        teacherAdded.name + ' ' + teacherAdded.lastName,
                        teacherAdded.email,
                        {}
                    );
                } else {
                    var inviteLink =
                        (process.env.FRONTEND_URL || baseUrl) +
                        '/signup/teacher' +
                        '?signupToken=' +
                        teacherAdded.signupToken;

                    await EmailHelper.sendTemplateEmail(
                        EmailTemplates.ACCOUNT.ACCOUNT_SIGNUP_TEACHER_INVITATION,
                        teacherAdded.name + ' ' + teacherAdded.lastName,
                        teacherAdded.email,
                        {
                            inviteLink: inviteLink
                        }
                    );
                }
            }

            if (emailsToSendForSignup) {
                if (!invitedByName) invitedByName = 'ClassTutor';

                for (let i = 0; i < emailsToSendForSignup.length; i++) {
                    const emailToSend = emailsToSendForSignup[i];

                    var inviteLink =
                        (process.env.FRONTEND_URL || baseUrl) +
                        '/signup/' +
                        emailToSend.type +
                        '?signupToken=' +
                        emailToSend.token;

                    await EmailHelper.sendTemplateEmail(
                        EmailTemplates.ACCOUNT.ACCOUNT_SIGNUP_WELCOME_INVITATION,
                        emailToSend.name,
                        emailToSend.email,
                        {
                            invitedByName: invitedByName,
                            inviteLink: inviteLink
                        }
                    );

                    // var body = "Please click this link to complete signup: " + baseUrl + "/signup/" + emailToSend.type + "?signupToken=" + emailToSend.token;
                    // await EmailHelper.sendEmail("Complete signup", body, emailToSend.name, emailToSend.email);
                }
            }

            if (emailToSendWelcome.email) {
                var studentAccounts = [];

                for (let i = 0; i < emailToSendWelcome.students.length; i++) {
                    const student = emailToSendWelcome.students[i];

                    if (student.password) {
                        studentAccounts.push({
                            name: student.name,
                            username: student.username,
                            password: student.password
                        });
                    }
                }

                if (studentAccounts.length > 0) {
                    var portalLink = process.env.FRONTEND_URL || baseUrl;

                    await EmailHelper.sendTemplateEmail(
                        EmailTemplates.ACCOUNT.ACCOUNT_SIGNUP_STUDENT_PASSWORD,
                        emailToSendWelcome.name,
                        emailToSendWelcome.email,
                        {
                            parentName: emailToSendWelcome.name,
                            portalLink: portalLink,
                            studentAccounts: studentAccounts
                        }
                    );
                }

                // var body = "Your account is ready. You can use the below data to access them.";

                // body += "\nYour username: " + emailToSendWelcome.username;
                // body += "\n";

                // for (let i = 0; i < emailToSendWelcome.parents.length; i++) {
                //     const parent = emailToSendWelcome.parents[i];
                //     body += "\nOther parent username: " + parent.username;
                //     body += "\nOther parent name: " + parent.name;
                //     body += "\n";
                // }

                // for (let i = 0; i < emailToSendWelcome.students.length; i++) {
                //     const student = emailToSendWelcome.students[i];
                //     body += "\nOther student username: " + student.username;
                //     body += "\nOther student name: " + student.name;
                //     if (student.password)
                //         body += "\nOther student password: " + student.password;
                //     body += "\n";
                // }

                // await EmailHelper.sendEmail("Welcome to your account", body, emailToSendWelcome.name, emailToSendWelcome.email);
            }
            const emails = EmailHelper.getEmails(ctx.request.body)
                .filter(({ email: email1 }) => !emailsToSendForSignup.some(({ email: email2 }) => email2 === email1))
                .filter(({ email }) => email != teacherAdded?.email);
            if (emails.length) {
                await Promise.all(
                    emails.map(async (email) => {
                        await strapi.service('api::account.account').sendEmailConfirmation(email);
                    })
                );
            }

            if (parentIds.length > 0) {
                await strapi.service('api::family-link.family-link').createOrUpdate(parentIds, studentIds);
            }

            return {
                parentsAdded: parentsAdded,
                parentsInvited: parentsInvited,
                studentsAdded: studentsAdded,
                teacherAdded: teacherAdded
            };
        } catch (err) {
            return ctx.badRequest(err.message, { stack: err.stack });
        }

        return {};
    },

    async signupFreeTrial(ctx, next) {
        try {
            var data = ctx.request.body;

            var parentName = cleanName(data.parentName);
            var studentName = cleanName(data.studentName);
            var email = data.email?.toLowerCase() ?? '';
            var phone = data.phone;
            var year = data.year;
            var maths = data.maths;
            var english = data.english;
            var science = data.science;
            var selectedSubjects = [];

            if (!parentName) return ctx.badRequest('Parent name required');
            if (!studentName) return ctx.badRequest('Student name required');
            if (!email) return ctx.badRequest('Email required');
            if (!year) return ctx.badRequest('Year required');
            if (!maths && !english && !science) return ctx.badRequest('Subject required');

            var signupToken = '';

            var parentRecord = await strapi.entityService.findMany('api::parent.parent', {
                filters: { email: email }
            });

            var parent = null;
            var sendParentEmail = false;

            var billingParentId = null;
            var parentNames = AccountUtils.getSeparateNames(parentName, '');

            if (parentRecord.length == 0) {
                // create parent if not exist
                var parentData = {
                    data: {
                        parentId: 'GEN_NEW_ID',
                        name: parentNames.fName,
                        lastName: parentNames.lName,
                        email: email,
                        phone: phone,
                        source: 'form'
                    }
                };

                parent = await strapi.entityService.create('api::parent.parent', parentData);

                parent = await strapi.entityService.findOne('api::parent.parent', parent.id, {
                    populate: ['user']
                });

                if (!billingParentId) billingParentId = parent.id;

                signupToken = parent.user.signupToken;

                sendParentEmail = true;
            } else {
                parent = parentRecord[0];
                if (!billingParentId) billingParentId = parent.id;
            }

            // check if parent has the student record with it

            // TODO: we removed parents of students table so we've to use family links instead.
            var students = await strapi.entityService.findMany('api::student.student', {
                filters: {
                    parents: {
                        id: parent.id
                    }
                },
                populate: ['year']
            });
            //

            var student = null;
            var studentNames = AccountUtils.getSeparateNames(studentName, '');

            var subjects = await strapi.entityService.findMany('api::subject.subject');
            var years = await strapi.entityService.findMany('api::year.year');

            for (let index = 0; index < students.length; index++) {
                const foundStudent = students[index];

                if (foundStudent.name == studentNames.fName) {
                    // its same student
                    student = foundStudent;
                    break;
                }
            }

            var studentId = 0;

            if (!student) {
                var subjectIds = [];

                for (let index = 0; index < subjects.length; index++) {
                    const sub = subjects[index];

                    if (maths && sub.name.toLowerCase() == 'maths') {
                        subjectIds.push(sub.id);
                        selectedSubjects.push(sub.name);
                    }

                    if (english && sub.name.toLowerCase() == 'english') {
                        subjectIds.push(sub.id);
                        selectedSubjects.push(sub.name);
                    }

                    if (science && sub.name.toLowerCase() == 'science') {
                        subjectIds.push(sub.id);
                        selectedSubjects.push(sub.name);
                    }
                }

                var selectedYear = years.find(
                    (x) =>
                        x.name.toLowerCase() == year.toLowerCase() ||
                        x.shortName.toLowerCase() == year.toLowerCase() ||
                        x.otherName.toLowerCase() == year.toLowerCase()
                );

                var studentData = {
                    data: {
                        studentId: AccountUtils.randomUUID(),
                        name: studentNames.fName,
                        lastName: studentNames.lName,
                        primary_parent: billingParentId,
                        year: selectedYear?.id
                    }
                };

                const newStudent = await strapi.entityService.create('api::student.student', studentData);

                studentId = newStudent.id;

                // create new student-class link for each subject
                for (let i = 0; i < subjectIds.length; i++) {
                    const subjectId = subjectIds[i];

                    var scData = {
                        name: newStudent.studentId,
                        student: newStudent.id,
                        subject: subjectId,
                        year: selectedYear?.id,
                        source: 'websiteForm'
                    };

                    if (billingParentId) {
                        scData.billing_parent = billingParentId;
                    }

                    var studentClassLink = await strapi.entityService.create('api::student-class.student-class', {
                        data: scData
                    });
                }

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1001',
                    template: 'A new student {{name}} has signed up by free trial form',
                    entity: 'student',
                    entityId: newStudent.id,
                    receiverId: 'admin-users',
                    messageValues: { name: studentNames.fName + ' ' + studentNames.lName }
                });
            } else {
                // student exists, check if new subject is added?
                // TODO: send task for sales rep

                studentId = student.id;

                var subjectIds = [];
                var subjectIdsToAdd = [];

                var studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
                    filters: { student: student.id },
                    populate: ['subject']
                }); // TODO: filter by status and only show active subjects?

                var hasMaths = studentClasses.find((x) => x.subject.name.toLowerCase() == 'maths');
                var hasScience = studentClasses.find((x) => x.subject.name.toLowerCase() == 'science');
                var hasEnglish = studentClasses.find((x) => x.subject.name.toLowerCase() == 'english');

                for (let index = 0; index < studentClasses.length; index++) {
                    const selectedStudentClass = studentClasses[index];

                    if (maths && !hasMaths && selectedStudentClass.subject.name.toLowerCase() == 'maths') {
                        subjectIds.push(sub.id);
                        subjectIdsToAdd.push(sub.id);
                    }

                    if (science && !hasScience && selectedStudentClass.subject.name.toLowerCase() == 'science') {
                        subjectIds.push(sub.id);
                        subjectIdsToAdd.push(sub.id);
                    }

                    if (english && !hasEnglish && selectedStudentClass.subject.name.toLowerCase() == 'english') {
                        subjectIds.push(sub.id);
                        subjectIdsToAdd.push(sub.id);
                    }
                }

                for (let index = 0; index < studentClasses.length; index++) {
                    const element = studentClasses[index];
                    subjectIds.push(element.subject.id); // add existing subjects ids so db does not remove them
                }

                if (subjectIdsToAdd.length > 0) {
                    // create or update student-class link for each subject
                    for (let i = 0; i < subjectIds.length; i++) {
                        const subjectId = subjectIds[i];

                        var existing = studentClasses.find((x) => x.subject.id == subjectId);
                        if (!existing) {
                            var scData = {
                                name: student.studentId,
                                student: student.id,
                                subject: subjectId,
                                year: selectedYear,
                                source: 'websiteForm'
                            };

                            if (billingParentId) {
                                scData.billing_parent = billingParentId;
                            }

                            var studentClassLink = await strapi.entityService.create(
                                'api::student-class.student-class',
                                {
                                    data: scData
                                }
                            );
                        }
                    }
                }
            }

            if (billingParentId) {
                await strapi.service('api::family-link.family-link').createOrUpdate([billingParentId], [studentId]);
            }

            if (sendParentEmail) {
                // TODO: send out email to confirm account and start signup process with the above token

                var signupUrl = (process.env.FRONTEND_URL || baseUrl) + '/signup/parent?signupToken=' + signupToken;

                await EmailHelper.sendTemplateEmail(
                    EmailTemplates.ACCOUNT.ACCOUNT_SIGNUP_WELCOME_FREE_TRIAL,
                    parentName,
                    email,
                    {
                        userName: parentNames.fName,
                        parentName: parentNames.fName + ' ' + parentNames.lName,
                        completeSignupLink: signupUrl,
                        studentName: studentNames.fName + ' ' + studentNames.lName,
                        emailAddress: email,
                        phoneNumber: phone,
                        educationLevel: year,
                        subjects: selectedSubjects
                    }
                );

                return {
                    token: signupToken,
                    email: email,
                    message: 'New parent and student added, use the token to complete signup process'
                };
            } else {
                return {
                    message:
                        'Existing parent/student found, subjects updated, no signup by token needed as parent already exists'
                };
            }
        } catch (err) {
            return ctx.badRequest(err.message, { stack: err.stack });
        }

        return {};
    },

    async getAccountByToken(ctx, next) {
        try {
            var data = ctx.request.body;

            var signupToken = data.signupToken;

            var userAccounts = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { signupToken: signupToken }
            });

            if (userAccounts.length > 0 && signupToken) {
                // mark account as verified
                await strapi.entityService.update('plugin::users-permissions.user', userAccounts[0].id, {
                    data: {
                        confirmed: true
                    }
                });

                return await getAccountForSignup(userAccounts[0].id, false);
            } else {
                // new permission for existing user as a parent?

                return ctx.notFound('Token not found');
            }
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return {};
    },

    async getAccountByEmail(ctx, next) {
        try {
            var data = ctx.request.body;

            var email = (data.email || '').toLowerCase();

            var userAccounts = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: {
                    email: {
                        $eq: email
                    }
                }
            });

            if (userAccounts.length > 0 && email) {
                // if (userAccount[0].signupToken && userAccount[0].source == "form") {
                //     // has signupToken that means that user came from free trial account hence ask them to click the link in email
                //     return ctx.badRequest("Account found, but signed up using form, hence ask to click link in email", {
                //         errorSystemName: "ACCOUNT_CREATED_USING_FORM"
                //     });
                // }

                return await getAccountForSignup(userAccounts[0].id, true);
            } else {
                return ctx.notFound('Email not found');
            }
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return {};
    },

    async passwordReset(ctx, next) {
        try {
            var data = ctx.request.body;

            var email = (data.email || '').toLowerCase();

            var userAccount = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { email: email }
            });

            if (userAccount.length > 0 && email) {
                var token = AccountUtils.randomUUID();

                await strapi.entityService.update('plugin::users-permissions.user', userAccount[0].id, {
                    data: {
                        passwordResetToken: token
                    }
                });

                var resetPasswordLink =
                    (process.env.FRONTEND_URL || baseUrl) + '/reset-password?createPasswordToken=' + token;

                await EmailHelper.sendTemplateEmail(EmailTemplates.ACCOUNT.ACCOUNT_RESET_PASSWORD, email, email, {
                    resetPasswordLink: resetPasswordLink
                });

                // var body = "Please click this link to reset the password: /reset-password?createPasswordToken=" + token;
                // await EmailHelper.sendEmail("Password reset", body, email, email);

                return {
                    token: token
                };
            } else {
                return ctx.notFound('Invalid email');
            }
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return {};
    },

    async getAccountByPasswordResetToken(ctx, next) {
        try {
            var data = ctx.request.body;
            var passwordResetToken = data.passwordResetToken;

            var userAccounts = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { passwordResetToken: passwordResetToken }
            });

            if (userAccounts.length > 0 && passwordResetToken && !userAccounts[0].confirmed) {
                var userAccount = userAccounts[0];

                // mark account as verified
                await strapi.entityService.update('plugin::users-permissions.user', userAccount.id, {
                    data: {
                        confirmed: true
                    }
                });

                return {
                    email: userAccount.email,
                    username: userAccount.username,
                    avatarImageName: ''
                    // avatarImageName: userAccount.avatarImageName // TODO: fix this to get the image from the linked student or parent user
                };
            } else {
                // new permission for existing user as a parent?

                return ctx.notFound('Token not found');
            }
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return {};
    },

    async passwordChange(ctx, next) {
        try {
            var data = ctx.request.body;
            var passwordResetToken = data.passwordResetToken;
            var password = data.password;

            var userAccount = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { passwordResetToken: passwordResetToken }
            });

            if (userAccount.length > 0 && passwordResetToken) {
                var newToken = AccountUtils.randomUUID();

                await strapi.entityService.update('plugin::users-permissions.user', userAccount[0].id, {
                    data: {
                        passwordResetToken: newToken,
                        password: password
                    }
                });
            } else {
                return ctx.notFound('Invalid token');
            }
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return {};
    },

    async recaptchaVerification(ctx, next) {
        try {
            var data = ctx.request.body;
            var userResponseToken = data.userResponseToken;

            var result = {
                success: false
            };

            await axios
                .post(
                    'https://www.google.com/recaptcha/api/siteverify',
                    {},
                    {
                        params: {
                            secret: '6LdVuvsfAAAAAEv97rFv41REaGgynkIsDv5fCfqu',
                            response: userResponseToken
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                        }
                    }
                )
                .then(function (response) {
                    if (response.status == 200) {
                        result = {
                            success: response.data.success,
                            'error-codes': response.data['error-codes']
                        };
                    } else {
                        result = {
                            success: false
                        };
                    }
                });
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return result;
    },

    async sendConfirmationEmail(ctx, next) {
        try {
            const { email, name, lastName } = ctx.request.body;
            await strapi.service('api::account.account').sendEmailConfirmation({ email, name, lastName });
        } catch (error) {
            return ctx.badRequest(error.message);
        }
        return { success: true };
    }
};

async function validateSignup(parentsToAdd, parentsToInvite, studentsToAdd, teacherToAdd, isStudentDirectSignup) {
    // teacher validation

    var errors = [];
    var emailsUsed = [];

    if (parentsToAdd) {
        for (let i = 0; i < parentsToAdd.length; i++) {
            const parentToAdd = parentsToAdd[i];

            if (emailsUsed.find((x) => x == parentToAdd.email.toLowerCase())) {
                errors.push({
                    code: 41115,
                    source: { pointer: `/parentsToAdd/${i}/email` },
                    detail: `Email ${parentToAdd.email} already added for another user`
                });
            }

            emailsUsed.push(parentToAdd.email.toLowerCase());

            if (parentToAdd.parentId) {
                // has parent id, check if email used by any other parent?

                var existingStudentById = await strapi.entityService.findMany('api::parent.parent', {
                    filters: {
                        $and: [{ email: parentToAdd.email.toLowerCase() }, { parentId: { $ne: parentToAdd.parentId } }]
                    }
                });

                if (existingStudentById.length > 0) {
                    var err = {
                        code: 41114,
                        source: { pointer: `/parentsToAdd/${i}/email` },
                        detail: `Email ${parentToAdd.email} already in use by another user`
                    };

                    if (isStudentDirectSignup) {
                        err.detail += `. If this is your parent, please ask them to signup your account.`;
                    }

                    errors.push(err);
                }
            } else {
                // does not have parent id, just check email used by other parent?

                const existingParentByEmail = await strapi.entityService.findMany('api::parent.parent', {
                    filters: { email: parentToAdd.email.toLowerCase() }
                });

                if (existingParentByEmail.length > 0) {
                    var err = {
                        code: 41114,
                        source: { pointer: `/parentsToAdd/${i}/email` },
                        detail: `Email ${parentToAdd.email} already in use by another user`
                    };

                    if (isStudentDirectSignup) {
                        err.detail += `. If this is your parent, please ask them to signup your account.`;
                    }

                    errors.push(err);
                }
            }
        }
    }

    if (parentsToInvite) {
        for (let i = 0; i < parentsToInvite.length; i++) {
            const parentToInvite = parentsToInvite[i];

            if (emailsUsed.find((x) => x == parentToInvite.email.toLowerCase())) {
                errors.push({
                    code: 41115,
                    source: { pointer: `/parentsToInvite/${i}/email` },
                    detail: `Email ${parentToInvite.email} already added for another user`
                });
            }

            emailsUsed.push(parentToInvite.email.toLowerCase());

            const existingParent = await strapi.entityService.findMany('api::parent.parent', {
                filters: { email: parentToInvite.email.toLowerCase() }
            });

            if (existingParent.length > 0) {
                var err = {
                    code: 41114,
                    source: { pointer: `/parentsToInvite/${i}/email` },
                    detail: `Email ${parentToInvite.email} already in use by another user`
                };

                if (isStudentDirectSignup) {
                    err.detail += `. If this is your parent, please ask them to signup your account.`;
                }

                errors.push(err);
            }
        }
    }

    if (studentsToAdd) {
        for (let i = 0; i < studentsToAdd.length; i++) {
            const studentToAdd = studentsToAdd[i];

            if (studentToAdd.email) {
                if (emailsUsed.find((x) => x == studentToAdd.email.toLowerCase())) {
                    errors.push({
                        code: 41115,
                        source: { pointer: `/studentsToAdd/${i}/email` },
                        detail: `Email ${studentToAdd.email} already added for another user`
                    });
                }

                emailsUsed.push(studentToAdd.email.toLowerCase());

                if (studentToAdd.studentId) {
                    // has student id, check if email used by any other student?

                    var existingStudentById = await strapi.entityService.findMany('api::student.student', {
                        filters: {
                            $and: [
                                { email: studentToAdd.email.toLowerCase() },
                                { studentId: { $ne: studentToAdd.studentId } }
                            ]
                        }
                    });

                    if (existingStudentById.length > 0) {
                        errors.push({
                            code: 41114,
                            source: { pointer: `/studentsToAdd/${i}/email` },
                            detail: `Email ${studentToAdd.email} already in use by another user`
                        });
                    }
                } else {
                    // does not have student id, just check email used by other student?

                    const existingStudentByEmail = await strapi.entityService.findMany('api::student.student', {
                        filters: { email: studentToAdd.email.toLowerCase() }
                    });

                    if (existingStudentByEmail.length > 0) {
                        errors.push({
                            code: 41114,
                            source: { pointer: `/studentsToAdd/${i}/email` },
                            detail: `Email ${studentToAdd.email} already in use by another user`
                        });
                    }
                }
            }
        }
    }

    if (teacherToAdd) {
        if (emailsUsed.find((x) => x == teacherToAdd.email.toLowerCase())) {
            errors.push({
                code: 41115,
                source: { pointer: `/teacherToAdd/email` },
                detail: `Email ${teacherToAdd.email} already added for another user`
            });
        }

        emailsUsed.push(teacherToAdd.email.toLowerCase());

        if (teacherToAdd.teacherId) {
            // has teacher id, check if email used by any other teacher?

            var existingTeacherById = await strapi.entityService.findMany('api::teacher.teacher', {
                filters: {
                    $and: [{ email: teacherToAdd.email.toLowerCase() }, { teacherId: { $ne: teacherToAdd.teacherId } }]
                }
            });

            if (existingTeacherById.length > 0) {
                errors.push({
                    code: 41114,
                    source: '/teacherToAdd/email',
                    detail: `Email ${teacherToAdd.email} already in use by another user`
                });
            }
        } else {
            // does not have teacher id, just check email used by other teacher?

            const existingTeacher = await strapi.entityService.findMany('api::teacher.teacher', {
                filters: { email: teacherToAdd.email.toLowerCase() }
            });

            if (existingTeacher.length > 0) {
                errors.push({
                    code: 41114,
                    source: '/teacherToAdd/email',
                    detail: `Email ${teacherToAdd.email} already in use by another user`
                });
            }
        }
    }

    return errors;
}

async function getAccountForSignup(id, isFromEmail) {
    var responseData = {};

    var userAccount = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
        populate: ['user_types']
    });

    if (userAccount) {
        var isUsingFreeTrialForm = userAccount.signupToken && userAccount.source == 'form';
        var anonymisePersonalInformation = isUsingFreeTrialForm && isFromEmail;
        var isFromInvite = userAccount.source == 'invite';

        var isParent = userAccount.user_types.find((x) => x.name.toLowerCase() == 'parent');
        var isStudent = userAccount.user_types.find((x) => x.name.toLowerCase() == 'student');
        var isTeacher = userAccount.user_types.find((x) => x.name.toLowerCase() == 'teacher');

        let relation = null;

        if (isParent) {
            let parentToAdd = _.first(
                await strapi.entityService.findMany('api::parent.parent', {
                    filters: { user: userAccount.id }
                })
            );

            relation = await strapi.service('api::family-link.family-link').findByEntityId('parent', parentToAdd.id);

            if (parentToAdd) {
                parentToAdd.students = await strapi.entityService.findMany('api::student.student', {
                    filters: {
                        id: {
                            $in: relation.studentIds
                        }
                    },
                    populate: ['year']
                });

                if (parentToAdd.email && parentToAdd.email.includes('@noemail.com')) parentToAdd.email = '';

                if (anonymisePersonalInformation) {
                    parentToAdd.phone = '';
                }

                responseData.parentToAdd = {
                    parentId: parentToAdd.parentId,
                    name: parentToAdd.name,
                    lastName: parentToAdd.lastName,
                    email: parentToAdd.email,
                    phone: parentToAdd.phone,
                    phoneCountryCode: parentToAdd.phoneCountryCode,
                    isUsingFreeTrialForm: isUsingFreeTrialForm,
                    avatarImageName: parentToAdd.avatarImageName,
                    gender: parentToAdd.gender,
                    isFromInvite: isFromInvite
                };

                // responseData.linkedAccounts = {
                //     name: account.name,
                //     lastName: account.lastName,
                //     avatarImageName: account.avatarImageName
                // };

                var studentsToAdd = [];
                var linkedStudents = [];
                var linkedParents = [];

                for (let index = 0; index < parentToAdd.students.length; index++) {
                    const studentToAdd = parentToAdd.students[index];

                    var year = studentToAdd.year.name;

                    var subjects = [];

                    var studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
                        filters: { student: studentToAdd.id },
                        populate: ['subject']
                    });

                    var allowDelete = true;

                    for (let index = 0; index < studentClasses.length; index++) {
                        const element = studentClasses[index];

                        subjects.push(element.subject.name);

                        if (element.status != 'new') {
                            allowDelete = false;
                        }
                    }

                    if (studentToAdd.email && studentToAdd.email.includes('@noemail.com')) studentToAdd.email = '';

                    if (anonymisePersonalInformation) {
                        studentToAdd.phone = '';
                    }

                    if (isFromInvite) {
                        linkedStudents.push({
                            name: studentToAdd.name,
                            email: studentToAdd.email,
                            lastName: studentToAdd.lastName,
                            avatarImageName: studentToAdd.avatarImageName
                        });
                    } else {
                        studentsToAdd.push({
                            studentId: studentToAdd.studentId,
                            name: studentToAdd.name,
                            lastName: studentToAdd.lastName,
                            email: studentToAdd.email,
                            phone: studentToAdd.phone,
                            phoneCountryCode: studentToAdd.phoneCountryCode,
                            isSen: studentToAdd.isSen,
                            senRequirements: studentToAdd.senRequirements,
                            subjectsIntro: studentToAdd.subjectsIntro,
                            schoolName: studentToAdd.schoolName,
                            year: year,
                            subjects: subjects,
                            avatarImageName: studentToAdd.avatarImageName,
                            gender: studentToAdd.gender,
                            allowDelete: allowDelete
                        });
                    }
                }

                responseData.linkedStudents = linkedStudents;
                responseData.linkedParents = linkedParents;
                responseData.studentsToAdd = studentsToAdd;
            }
        } else if (isStudent) {
            let studentToAdd = _.first(
                await strapi.entityService.findMany('api::student.student', {
                    filters: { user: userAccount.id },
                    populate: ['year']
                })
            );

            relation = await strapi.service('api::family-link.family-link').findByEntityId('student', studentToAdd.id);

            studentToAdd.parents = await strapi.entityService.findMany('api::parent.parent', {
                filters: {
                    id: {
                        $in: relation?.parentIds
                    }
                }
            });

            if (studentToAdd) {
                var year = studentToAdd.year?.name;

                var subjects = [];

                var studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
                    filters: { student: studentToAdd.id },
                    populate: ['subject']
                });

                for (let index = 0; index < studentClasses.length; index++) {
                    const element = studentClasses[index];

                    subjects.push(element.subject.name);
                }

                if (studentToAdd.email && studentToAdd.email.includes('@noemail.com')) studentToAdd.email = '';

                if (anonymisePersonalInformation) {
                    studentToAdd.phone = '';
                }

                responseData.studentToAdd = {
                    studentId: !_.isEmpty(studentToAdd?.studentId) ? studentToAdd?.studentId : 'GEN_NEW_ID',
                    name: studentToAdd.name,
                    lastName: studentToAdd.lastName,
                    email: studentToAdd.email,
                    phone: studentToAdd.phone,
                    phoneCountryCode: studentToAdd.phoneCountryCode,
                    isSen: studentToAdd.isSen,
                    senRequirements: studentToAdd.senRequirements,
                    subjectsIntro: studentToAdd.subjectsIntro,
                    schoolName: studentToAdd.schoolName,
                    year: year,
                    subjects: subjects,
                    isUsingFreeTrialForm: isUsingFreeTrialForm,
                    isFromInvite: isFromInvite,
                    avatarImageName: studentToAdd.avatarImageName,
                    gender: studentToAdd.gender
                };

                var linkedParents = [];
                var parentsToAdd = [];

                for (let index = 0; index < studentToAdd.parents.length; index++) {
                    const parentToAdd = studentToAdd.parents[index];

                    if (parentToAdd.email && parentToAdd.email.includes('@noemail.com')) parentToAdd.email = '';

                    if (anonymisePersonalInformation) {
                        parentToAdd.phone = '';
                    }

                    if (isFromInvite) {
                        linkedParents.push({
                            name: parentToAdd.name,
                            email: parentToAdd.email,
                            lastName: parentToAdd.lastName,
                            avatarImageName: parentToAdd.avatarImageName
                        });
                    } else {
                        parentsToAdd.push({
                            parentId: parentToAdd.parentId,
                            name: parentToAdd.name,
                            lastName: parentToAdd.lastName,
                            email: parentToAdd.email,
                            phone: parentToAdd.phone,
                            phoneCountryCode: parentToAdd.phoneCountryCode,
                            avatarImageName: parentToAdd.avatarImageName
                        });
                    }
                }

                responseData.parentsToAdd = parentsToAdd;
                responseData.linkedParents = linkedParents;
            }
        } else if (isTeacher) {
            var teacherRecords = await strapi.entityService.findMany('api::teacher.teacher', {
                filters: { user: userAccount.id },
                populate: ['cv', 'photo', 'coverLetter']
            });

            if (teacherRecords.length > 0) {
                var teacherRecord = teacherRecords[0];
                var teacherCapabilities = await strapi
                    .service('api::teacher-capability.teacher-capability')
                    .getForTeacher(teacherRecord.id);

                responseData.teacherToAdd = {
                    teacherId: !_.isEmpty(teacherRecord?.teacherId) ? teacherRecord?.teacherId : 'GEN_NEW_ID',
                    name: teacherRecord.name,
                    lastName: teacherRecord.lastName,
                    email: teacherRecord.email,
                    phone: teacherRecord.phone,
                    phoneCountryCode: teacherRecord.phoneCountryCode,
                    linkedInProfile: teacherRecord.linkedInProfile,
                    cv: teacherRecord.cv,
                    photo: teacherRecord.photo,
                    coverLetter: teacherRecord.coverLetter,
                    country: teacherRecord.country,
                    gender: teacherRecord.gender,
                    capabilities: teacherCapabilities
                };

                var status = teacherRecord.status;

                if (status == 'new' || status == 'interviewee') {
                    responseData.teacherStatus = 'Pending';
                }

                if (status == 'barred' || status == 'inactive' || status == 'rejected') {
                    responseData.teacherStatus = 'Rejected';
                }
            }
        }

        return responseData;
    }
}

function cleanName(name) {
    if (name) {
        return _.capitalize(_.toLower(name));
    }
    return name;
}
