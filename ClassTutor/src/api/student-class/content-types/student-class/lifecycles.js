var fromLc = false;

module.exports = {
    async beforeCreate(event) {
        const { data, where, select, populate } = event.params;

        if (!data.name || data.name == '') {
            // set name property

            if (data.student) {
                var student = await strapi.entityService.findOne('api::student.student', data.student);

                if (student) {
                    data.name = student.studentId;
                }
            }
        }
    },

    async beforeUpdate(event) {
        const { result, params } = event;
        const { data, where, select, populate } = event.params;

        var oldObject = await strapi.entityService.findOne('api::student-class.student-class', where.id);
        event.state = oldObject;
    },

    async afterUpdate(event) {
        const { result, params } = event;
        const { data, where, select, populate } = event.params;

        var oldObject = event.state;

        if (oldObject.status != result.status) {
            var newObject = await strapi.entityService.findOne('api::student-class.student-class', result.id);
            var rawData = JSON.stringify(newObject);
            var previousRawData = JSON.stringify(oldObject);
            await strapi.entityService.create('api::student-class-log.student-class-log', {
                data: {
                    name: result.name,
                    status: result.status,
                    rawData: rawData,
                    previousRawData: previousRawData,
                    student_class: result.id
                }
            });
        }
    },

    async afterFindOne(event) {
        const { result, params } = event;

        // if (!fromLc) {
        //     fromLc = true;
        //     // var ff = await strapi.entityService.findOne("api::register-student.register-student", 13);
        //     fromLc = false;
        // }

        await setStatus(result);
    },

    async afterFindMany(event) {
        const { result, params } = event;

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            await setStatus(element);
        }
    }
};

async function setStatus(item) {
    if (item) {
        item.adminStatus = '';
        item.classStatus = '';
        item.displayDate = {};

        // set admin status
        item.adminStatus = item.status;

        // `cancellationPending` is deprecated use `cancellationRequestDate` instead to find out if it cancelled
        // if (item.cancellationPending) item.adminStatus = "cancellationPending";
        if (item.cancellationRequestDate && !item.cancelledDate) item.adminStatus = 'cancellationRequested';
        else if (item.changeRequestDate) item.adminStatus = 'changeRequested';
        else if (item.paymentFailed) item.adminStatus = 'paymentFailed';
        else if (item.paymentWriteOff) item.adminStatus = 'paymentWriteOff';
        if (item.postponeDate) item.adminStatus = 'postpone';

        // set profile status
        item.classStatus = '';

        switch (item.adminStatus) {
            case 'cancelled':
                item.classStatus = 'cancelled';
                break;

            case 'trial':
                item.classStatus = 'trial';
                break;

            case 'cancellationPending':
            case 'cancellationRequested':
            case 'changeRequested':
                item.classStatus = 'cancelling';
                break;

            case 'active':
            case 'paused':
            case 'paymentFailed':
                item.classStatus = 'active';
                break;

            case 'awaitingFeedback':
            case 'firstPaymentOverdue':
            case 'firstPaymentPending':
            case 'postpone':
                item.classStatus = 'pending';
                break;

            default:
                break;
        }

        // set dates
        switch (item.adminStatus) {
            case 'new':
                item.displayDate = { type: 'request_date', date: item.createdDate };
                break;

            case 'cancellationRequested':
                item.displayDate = { type: 'cancellation_request_date', date: item.cancellationRequestDate };
                break;

            case 'changeRequested':
                item.displayDate = { type: 'change_request_date', date: item.changeRequestDate };
                break;

            case 'trial':
            case 'awaitingFeedback':
                item.displayDate = { type: 'trial_date', date: item.trialDate };
                break;

            case 'paymentOverdue':
                item.displayDate = { type: 'payment_overdue_date', date: item.paymentOverdueDate };
                break;

            case 'paymentFailed':
                item.displayDate = { type: 'payment_failed_date', date: item.paymentFailedDate };
                break;

            case 'firstPaymentPending':
                item.displayDate = { type: 'payment_pending_date', date: item.classDate };
                break;

            case 'cancelled':
            case 'cancellationPending':
            case 'inactive':
            case 'paymentWriteOff':
                item.displayDate = { type: 'cancellation_date', date: item.cancelledDate };
                break;

            case 'paused':
                item.displayDate = { type: 'paused_date', date: item.restartDate };
                break;

            case 'postpone':
                item.displayDate = { type: 'postpone_date', date: item.postponeDate };
                break;

            case 'active':
                item.displayDate = { type: 'joined_date', date: item.joinedDate };
                break;

            default:
                break;
        }
        return item;
    }
}
