/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable indent */
// 'use strict';

// module.exports = {
//     /**
//     * Lifecycle callbacks for the `User` model.
//     */
//     lifecycles: {

//         //Called before a user entry is created
//         async beforeCreate(data) {
//             //if the newly created user is a company --> change the role to 'company' (id=5)
//             let roleToAssign;
//             if (data.type === "company") {
//                 try {
//                     roleToAssign = await strapi
//                         .query("role", "users-permissions")
//                         .findOne({ _where: { name: "Company" } });
//                     data.role = roleToAssign.id;
//                 } catch (error) {
//                     console.log("Could not find role with name 'Company'");
//                 }
//             }
//             if (data.type === "individual") {
//                 try {
//                     roleToAssign = await strapi
//                         .query("role", "users-permissions")
//                         .findOne({ _where: { name: "Individual" } });
//                     data.role = roleToAssign.id;
//                 } catch (error) {
//                     console.log("Could not find role with name 'Individual'");
//                 }
//             }
//             // if something goes wrong --> show error in CMS:
//             // throw strapi.errors.badRequest("Error to show in CMS");
//         },

//         //Called after a user entry is created
//         async afterCreate(result, data) {
//             //also create an entry in the customer table
//             try {
//                 let entity = await strapi.services.customer.create({
//                     name: data.name,
//                     user: result.id,
//                     type: data.type
//                 });
//             } catch (error) {
//                 console.log("error:", error)
//             }
//         }
//     }
// };