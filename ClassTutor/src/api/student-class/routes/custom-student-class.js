'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/student-classes/getClassesForSales',
            handler: 'student-class.getClassesForSales'
        },
        {
            method: 'POST',
            path: '/student-classes/confirm-payment',
            handler: 'student-class.confirmPayment'
        }
    ]
};
