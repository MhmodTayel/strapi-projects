module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/account/signupFreeTrial',
            handler: 'account.signupFreeTrial',
        },
        {
            method: 'POST',
            path: '/account/getAccountByToken',
            handler: 'account.getAccountByToken',
        },
        {
            method: 'POST',
            path: '/account/getAccountByEmail',
            handler: 'account.getAccountByEmail',
        },
        {
            method: 'POST',
            path: '/account/passwordReset',
            handler: 'account.passwordReset',
        },
        {
            method: 'POST',
            path: '/account/passwordChange',
            handler: 'account.passwordChange',
        },
        {
            method: 'POST',
            path: '/account/getAccountByPasswordResetToken',
            handler: 'account.getAccountByPasswordResetToken',
        },
        {
            method: 'POST',
            path: '/account/create',
            handler: 'account.create',
            config: {
                description: "Signup or create user account"
            }
        },
        {
            method: 'POST',
            path: '/account/recaptchaVerification',
            handler: 'account.recaptchaVerification',
        },
        {
            method: 'POST',
            path: '/account/sendConfirmationEmail',
            handler: 'account.sendConfirmationEmail',
        }
    ]
}
