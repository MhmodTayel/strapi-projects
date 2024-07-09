module.exports = Object.freeze({
    ACCOUNT: {
        ACCOUNT_SIGNUP_WELCOME_FREE_TRIAL: {
            subject: 'Thank you for submitting free trial form',
            subPath: 'account',
            templateFile: 'account-signup-welcome-free-trial-form.hbs'
        },
        ACCOUNT_SIGNUP_STUDENT_PASSWORD: {
            subject: 'Student accounts are ready',
            subPath: 'account',
            templateFile: 'account-signup-student-passwords.hbs'
        },
        ACCOUNT_SIGNUP_WELCOME_INVITATION: {
            subject: 'You have been invited to join ClassTutor',
            subPath: 'account',
            templateFile: 'account-signup-welcome-invitation.hbs'
        },
        ACCOUNT_RESET_PASSWORD: {
            subject: 'Password reset request',
            subPath: 'account',
            templateFile: 'account-reset-password.hbs'
        },
        ACCOUNT_RESET_PASSWORD_STUDENT: {
            subject: 'Password reset request for student',
            subPath: 'account',
            templateFile: 'account-reset-password-student.hbs'
        },
        ACCOUNT_SIGNUP_TEACHER_INVITATION: {
            subject: 'You have been invited to join ClassTutor',
            subPath: 'account',
            templateFile: 'account-signup-teacher-invitation.hbs'
        },
        ACCOUNT_EMAIL_CONFIRMATION: {
            subject: 'Class Tutor email confirmation',
            subPath: 'account',
            templateFile: 'account-email-confirmation.hbs'
        }
    },
    TEACHER: {
        TEACHER_SIGNUP_APPLICATION_ACCEPTED: {
            subject: 'Teacher application accepted',
            subPath: 'teacher',
            templateFile: 'teacher-signup-application-accepted.hbs'
        },
        TEACHER_SIGNUP_APPLICATION_RECEIVED: {
            subject: 'Teacher application received',
            subPath: 'teacher',
            templateFile: 'teacher-signup-application-received.hbs'
        },
        TEACHER_SIGNUP_APPLICATION_REJECTED: {
            subject: 'Teacher application rejected',
            subPath: 'teacher',
            templateFile: 'teacher-signup-application-rejected.hbs'
        },
        TEACHER_SIGNUP_INTERVIEW_ACCEPTED: {
            subject: 'Teacher interview accepted',
            subPath: 'teacher',
            templateFile: 'teacher-signup-interview-accepted.hbs'
        },
        TEACHER_SIGNUP_INTERVIEW_REJECTED: {
            subject: 'Teacher interview rejected',
            subPath: 'teacher',
            templateFile: 'teacher-signup-interview-rejected.hbs'
        }
    },
    PARENT: {
        PARENT_ATTENDANCE_BEHAVIOUR_ISSUE: {
            subject: '{{studentName}} behaviour issue reported',
            subPath: 'parent',
            templateFile: 'parent-attendance-behaviour-template.hbs'
        },
        PARENT_ATTENDANCE_STAR_STUDENT: {
            subject: 'Star student - {{studentName}}',
            subPath: 'parent',
            templateFile: 'parent-attendance-star-template.hbs'
        }
    },
    TRIAL: {
        TRAIL_DATE_PASSED_AND_STUDENT_ATTENDED: {
            subject: 'Trial passed and {{studentName}} attended',
            subPath: 'trial',
            templateFile: 'trial-date-passed-and-student-attended.hbs'
        },
        TRAIL_DATE_PASSED_AND_THE_STUDENT_MISSED: {
            subject: 'Trial passed and {{studentName}} absent',
            subPath: 'trial',
            templateFile: 'trial-date-passed-and-the-student-missed.hbs'
        },
        TRAIL_EMAIL_TEMPLATE_CANCELLED: {
            subject: "{{studentName}}'s trial is cancelled",
            subPath: 'trial',
            templateFile: 'trial-email-template-cancelled.hbs'
        },
        TRAIL_EMAIL_TEMPLATE_CONFIRM: {
            subject: "{{studentName}}'s trial is confirmed",
            subPath: 'trial',
            templateFile: 'trial-email-template-confirm.hbs'
        },
        TRAIL_EMAIL_TEMPLATE_CHANGED: {
            subject: "{{studentName}}'s trial is changed",
            subPath: 'trial',
            templateFile: 'trial-email-template-changed.hbs'
        }
    },
    PAYMENT: {
        PAYMENT_CONFIRM: {
            subject: 'Payment confirmation',
            subPath: 'payment',
            templateFile: 'payment-confirm.hbs'
        },
        PAYMENT_FAILED: {
            subject: 'Payment failed',
            subPath: 'payment',
            templateFile: 'payment-failed-template.hbs'
        },
        PAYMENT_INVOICE: {
            subject: 'Payment invoice',
            subPath: 'payment',
            templateFile: 'payment-invoice-template.hbs'
        },
        PAYMENT_OVERDUE: {
            subject: 'Payment overdue',
            subPath: 'payment',
            templateFile: 'payment-overdue-template.hbs'
        }
    },
    BOOKING: {
        BOOKING_CANCELLED_AND_OVERDUE_INVOICE: {
            subject: "{{studentName}}'s booking is cancelled and invoice overdue",
            subPath: 'booking',
            templateFile: 'booking-cancelled-and-overdue-invoice.hbs'
        },
        BOOKING_CANCELLED_DATE_PASSES_AND_INVOICE_PAID: {
            subject: "{{studentName}}'s booking is cancelled and invoice paid",
            subPath: 'booking',
            templateFile: 'booking-cancelled-date-passes-and-invoice-paid.hbs'
        },
        BOOKING_CANCELLED: {
            subject: "{{studentName}}'s booking is cancelled",
            subPath: 'booking',
            templateFile: 'booking-cancelled-template.hbs'
        },
        BOOKING_CHANGED: {
            subject: "{{studentName}}'s booking is changed",
            subPath: 'booking',
            templateFile: 'booking-changed-template.hbs'
        },
        BOOKING_CONFIRM: {
            subject: "{{studentName}}'s booking is confirmed",
            subPath: 'booking',
            templateFile: 'booking-confirm-template.hbs'
        }
    },
    POSTPONEMENT: {
        POSTPONEMENT_REMINDER: {
            subject: 'Postponement reminding',
            subPath: 'postponement',
            templateFile: 'postponement-reminder.hbs'
        }
    }
});
