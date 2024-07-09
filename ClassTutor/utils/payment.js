const luxon = require('luxon');

/**
 * next payment date is 1th or 15th from the next month which furthest
 * @param {string} startDate
 * @returns {string}
 */
module.exports.calculateNextPaymentDate = function (startDate) {
    const nextMonth = luxon.DateTime.fromISO(startDate).plus({ month: 1 });
    console.log(`startDate ${startDate} next month : ${nextMonth.toFormat('YYYY-MM-DD')}`);
    const next1th = nextMonth.startOf('month');
    const next15th = nextMonth.startOf('month').plus({ day: 15 });
    let nextPaymentDate = next1th;
    if (next15th.startOf('day') < nextMonth.startOf('day')) {
        nextPaymentDate = next15th;
    }
    console.log(`next payment date should be ${nextPaymentDate}`);
    return nextPaymentDate.toISO();
};
