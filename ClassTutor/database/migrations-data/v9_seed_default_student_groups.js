module.exports = async () => {
    studentGroups = [
        { name: 'New', type: 'student' },
        { name: 'Old: Call Again', type: 'student' },
        { name: 'Trial: Call Back', type: 'student' },
        { name: 'Trial: No Answer - 1st Attempt', type: 'student' },
        { name: 'Trial: No Answer - 2nd Attempt', type: 'student' },
        { name: 'Trial: No Answer - 3rd Attempt', type: 'student' },
        { name: 'Pause', type: 'student' },
        { name: 'Pause Finished', type: 'student' },
        { name: 'Waiting Class Confirmation', type: 'student' },
        { name: 'Free Trial Arranged', type: 'student' },
        { name: 'Pending Decision', type: 'student' },
        { name: 'Pending Decision - Called 1 time', type: 'student' },
        { name: 'Pending Decision - Called 2 times', type: 'student' },
        { name: 'Pending Decision - Called 3 times', type: 'student' },
        { name: "Pending Decision - There's still hope", type: 'student' },
        { name: 'Pending Payment 1', type: 'student' },
        { name: 'Pending Payment 2', type: 'student' },
        { name: 'Pending Payment 3', type: 'student' },
        { name: 'Pending Cancellation', type: 'student' },
        { name: 'Invalid / Abandoned', type: 'student' },
        { name: 'Sold - Subscription Needed', type: 'student' },
        { name: 'Sold', type: 'student' },
        { name: 'Summer Break', type: 'student' },
        { name: 'Change Requested', type: 'student' },
        { name: 'Cancelled - No Answer', type: 'student' },
        { name: 'Cancelled - No Trial', type: 'student' },
        { name: 'Cancelled - Post Trial', type: 'student' },
        { name: 'Cancelled - Post Trial No Answer', type: 'student' },
        { name: 'Cancelled - Change Class', type: 'student' },
        { name: 'Cancelled - Post Paid Lessons', type: 'student' },
        { name: 'Cancelled - Finished / Graduated', type: 'student' },
        { name: 'Old - No Answer 1', type: 'student' },
        { name: 'Old - No Answer 2', type: 'student' },
        { name: 'Old - No Answer 3', type: 'student' },
        { name: 'Old - Cancelled', type: 'student' },
        { name: 'Blacklist', type: 'student' },
        { name: 'Join Later', type: 'student' },
        { name: 'Join Later - Followup Due', type: 'student' }
    ];
    for (let i = 0; i < studentGroups.length; i++) {
        const studentGroup = studentGroups[i];
        studentGroup.order = i+1;
        await strapi.entityService.create('api::group.group', { data: studentGroup });
    }
};
