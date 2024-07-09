const { DateTime } = require('luxon');

function checkSetAgent(newAgentId, agentsExisting) {
    for (let i = 0; i < agentsExisting.length; i++) {
        const agent = agentsExisting[i];

        if (agent === newAgentId) {
            return true;
        }
    }

    return false;
}



module.exports = {
    checkSetAgent
};
