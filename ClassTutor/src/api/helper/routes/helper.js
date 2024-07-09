module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/helper/changeCollection',
            handler: 'helper.changeCollection'
        },
        {
            method: 'GET',
            path: '/helper/getSubjectRate',
            handler: 'helper.getSubjectRate'
        },
        {
            method: 'PUT',
            path: '/helper/:invoiceId/send',
            handler: 'helper.sendInvoice'
        },
        {
            method: 'PUT',
            path: '/helper/:invoiceId/paid',
            handler: 'helper.payInvoice'
        },
        {
            method: 'PUT',
            path: '/helper/:invoiceId/cancel',
            handler: 'helper.cancelInvoice'
        }
    ]
};
