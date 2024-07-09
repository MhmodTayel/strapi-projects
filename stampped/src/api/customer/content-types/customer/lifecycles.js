/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
// 'use strict';
// const { sanitizeEntity } = require('strapi-utils/lib');
// const auth_email = require('../../../../extensions/users-permissions/controllers/Auth_email')

// function generateSalesTeamAssociateCode() {
//    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//    let code = '';
//    for (let i = 0; i < 8; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       code += characters.charAt(randomIndex);
//    }
//    return code;
// }

// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
//  * to customize this model
//  */
// const getUser = async (userId) => {
//    const user = await strapi.query('user', 'users-permissions').findOne({
//       id: userId
//    });
//    //sanitize the found user object, and remove the "uploaded_documents" property (could be too large)
//    return Object.assign({}, sanitizeEntity(user, {
//       model: strapi.query('user', 'users-permissions').model,
//    }), { uploaded_documents: undefined })
// }

// module.exports = {
//    lifecycles: {
//       //before a Customer record is created
//       async beforeCreate(data) {
//          const sanitizedUser = await getUser(data.user)
//          //create a label for the customer
//          data.label = sanitizedUser.username
//       },
//       //after a Customer record is created
//       async afterCreate(result, data) {
//          await strapi.services.customer.update({ id: result.id }, {
//             //create the label with id for the customer
//             label_with_id: data.label + ` (${result.id})`
//          });
//       },
//       //before a Customer record is being updated
//       async beforeUpdate(params, data) {
//          const customer = await strapi
//             .query("customer")
//             .findOne({ id: params.id });
//          const locale = customer.user.lastLocale || "en"
//          if (customer.sales_team !== params.sales_team) {
//             // user changed sales_team for a customer
//             if (!customer.sales_team && data.sales_team && !customer.sales_team_associate_code) {
//                // there was no team selected before, user chose an existing team (and there was no sales_team_associate_code set yet)
//                // --> generate the sales_team_associate_code
//                data.sales_team_associate_code = generateSalesTeamAssociateCode()
//             }
//          }
//          //create a label for the customer
//          if (data.type === "company" && data.agent_status !== "none") {
//             data.label = data.name_first + " " + data.name_last
//          } else {
//             data.label = customer.user.username
//          }
//          data.label_with_id = data.label + ` (${params.id})`

//          const originalAgentStatus = customer.agent_status;
//          const newAgentStatus = data.agent_status;
//          const needToSendEmail = (originalAgentStatus !== newAgentStatus)
//             || (data.agent_status === "docs_need_updating" && data.docs_need_updating_remarks !== customer.docs_need_updating_remarks)
//             || (data.agent_status === "disapproved" && data.agent_status_disapproved_remarks !== customer.agent_status_disapproved_remarks)
//             || (data.agent_status === "retracted" && data.agent_status_retracted_remarks !== customer.agent_status_retracted_remarks)

//          if (needToSendEmail) {
//             // the agent_status has been CHANGED

//             //If the customer has just been approved as an agent --> send an email
//             if (newAgentStatus === 'approved') {
//                try {
//                   await auth_email.sendCompanyReviewApprovedEmail(customer.user, data, locale)
//                } catch (error) {
//                   console.log("error:", error)
//                }
//             }
//             //If the customer's verification data needs updating' --> send an email
//             if (newAgentStatus === 'docs_need_updating') {
//                try {
//                   await auth_email.sendCompanyReviewDocsNeedUpdatingEmail(customer.user, data, locale)
//                } catch (error) {
//                   console.log("error:", error)
//                }
//             }
//             //If the customer has just been disapproved as an agent --> send an email
//             if (newAgentStatus === 'disapproved') {
//                try {
//                   await auth_email.sendCompanyReviewDisapprovedEmail(customer.user, data, locale)
//                } catch (error) {
//                   console.log("error:", error)
//                }
//             }
//             //If the customer has just been disapproved as an agent --> send an email
//             if (newAgentStatus === 'retracted') {
//                try {
//                   await auth_email.sendCompanyReviewRetractedEmail(customer.user, data, locale)
//                } catch (error) {
//                   console.log("error:", error)
//                }
//             }
//          }

//          if (newAgentStatus !== 'none' && data.type === "individual") {
//             throw strapi.errors.badRequest("Can only change agent_status for companies");
//          }
//       },

//       //after a Customer record is being updated
//       // async afterUpdate(result, params, data) {

//       // }
//    },
// };

const { v4: uuid } = require('uuid');

module.exports = {
  async beforeCreate({params}) {
    const {data} = params
    if (!data.uuid) {
      data.uuid = uuid();
   }
  },
};