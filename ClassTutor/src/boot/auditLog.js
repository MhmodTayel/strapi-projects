const auditBlackList = require('../misc/auditBlackList');
var _ = require('lodash');

auditBlackList.push('api::audit-log.audit-log');
const getContentTypes = async () => {
    let contentTypes = [];
    Object.values(strapi.contentTypes).map((contentType) => {
        if ((contentType.kind === 'collectionType' || contentType.kind === 'singleType') && !contentType.plugin) {
            contentTypes.push(contentType.uid);
        }
    });
    return contentTypes.filter((uid) => !auditBlackList.includes(uid));
};

function extractRelationFields(event) {
    const { attributes } = event.model;
    const relationFields = {};

    for (const [fieldName, fieldDetails] of Object.entries(attributes)) {
        if (fieldDetails.type === 'relation' && fieldDetails.target.includes('api')) {
            relationFields[fieldName] = true;
        }
    }
    return relationFields;
}

const lifecycleHooks = ['beforeCreate', 'beforeUpdate', 'beforeDelete'];

const commonLogic = async (event) => {
    const relations = extractRelationFields(event);
    event.params.populate = {
        ...event.params.populate,
        ...relations
    };
};

const commonLifecycleHooks = {};

lifecycleHooks.forEach((hook) => {
    commonLifecycleHooks[hook] = commonLogic;
});

function simplifyResult(obj) {
    return _.mapValues(obj, (value, key) => {
        if (_.isObject(value) && !_.isEmpty(value)) {
            if (_.isArray(value)) {
                return value.map((item) => (_.isObject(item) ? { id: item.id } : null));
            } else if (key == 'updatedBy' || key == 'createdBy') {
                return {
                    id: value.id,
                    firstname: value.firstname,
                    lastname: value.lastname,
                    email: value.email,
                    username: value.username
                };
            } else {
                return { id: value.id };
            }
        } else {
            return value;
        }
    });
}

const createLog = async (data) => {
    await strapi.entityService.create('api::audit-log.audit-log', {
        data: {
            ...data,
            changedId: `${data.result.id}`,
            user: data.result.updatedBy
        }
    });
};

let data = {};
const lifecycleEvents = {
    ...commonLifecycleHooks,
    afterCreate: async (event) => {
        // @ts-ignore
        const { model, params, result } = event;
        data = {
            uid: model.uid,
            params: _.omit(params, ['populate']),
            result: simplifyResult(result),
            actionType: 'ADD'
        };
        await createLog(data);
    },
    afterUpdate: async (event) => {
        // @ts-ignore
        const { model, params, result } = event;
        if (event.params?.options && event.params.options.ignoreAuditLog) return;
        data = {
            uid: model.uid,
            params: _.omit(params, ['populate']),
            result: simplifyResult(result),
            actionType: params.data.publishedAt ? 'PUBLISH' : 'UPDATE'
        };
        await createLog(data);
    },
    afterDelete: async (event) => {
        // @ts-ignore
        const { model, params, result } = event;
        data = {
            uid: model.uid,
            params: _.omit(params, ['populate']),
            result: simplifyResult(result),
            actionType: 'DELETE'
        };
        await createLog(data);
    }
};
module.exports = async (strapi) => {
    const auditList = await getContentTypes();
    Object.keys(lifecycleEvents).forEach((eventName) => {
        strapi.db.lifecycles.subscribe({
            models: auditList,
            [eventName]: lifecycleEvents[eventName]
        });
    });
};
