interface ContentType {
  kind: string;
  plugin: string;
}
const getContentTypes = async (strapi) => {
  let contentTypes = [];
  Object.values(strapi.contentTypes).map((contentType: ContentType) => {
    if (
      (contentType.kind === 'collectionType' ||
        contentType.kind === 'singleType') &&
      !contentType.plugin
    ) {
      contentTypes.push(contentType);
    }
  });
  return contentTypes;
};

interface Attribute {
  type: string;
  target?: string;
  component?: string;
  components?: string[];
}

interface ContentType {
  attributes: Record<string, Attribute>;
}

interface Item {
  attributes: any[]; // Update with the appropriate type for your `attributes` array
}

const getStructure = (
  item: Item,
  contentType: ContentType,
  type: string,
  componentName?: string,
  zoneName?: string,
  parentComponentName?: string
) => {
  for (const [attributeKey, attributeValue] of Object.entries<Attribute>(
    contentType.attributes
  )) {
    switch (attributeValue.type) {
      case 'text':
      case 'string':
      case 'media':
      case 'biginteger':
      case 'float':
      case 'decimal':
      case 'integer':
        switch (type) {
          case 'component':
            item.attributes.push({
              key: attributeKey,
              value: attributeValue,
              type: 'text',
              container: 'component',
              componentName: componentName,
            });
            break;
          case 'componentInZone':
            item.attributes.push({
              key: attributeKey,
              value: attributeValue,
              type: 'text',
              container: 'componentInZone',
              zone: zoneName,
              componentName: componentName,
            });
            break;
          case 'nestedComponentInComponentInZone':
            item.attributes.push({
              key: attributeKey,
              value: attributeValue,
              type: 'text',
              container: 'nestedComponentInComponentInZone',
              zone: `${zoneName}/${parentComponentName}`,
              componentName: componentName,
            });
            break;
          case 'default':
            item.attributes.push({
              key: attributeKey,
              value: attributeValue,
              type: 'text',
              container: 'default',
            });
            break;
        }
        break;
      case 'component':
        switch (type) {
          case 'default':
            const component = strapi.components[attributeValue.component];
            if (component)
              getStructure(item, component, 'component', attributeKey);
            break;
          case 'componentInZone':
            const zoneComponentInZone =
              strapi.components[attributeValue.component];
            if (zoneComponentInZone)
              getStructure(
                item,
                zoneComponentInZone,
                'nestedComponentInComponentInZone',
                attributeKey,
                zoneName,
                componentName
              );
            break;
        }
        break;
      case 'dynamiczone':
        if (type === 'default') {
          for (const componentName of attributeValue.components) {
            const component = strapi.components[componentName];
            getStructure(
              item,
              component,
              'componentInZone',
              componentName,
              attributeKey
            );
          }
        }
        break;
      default:
        break;
    }
  }
};

const parse = async (strapi) => {
  let potentialFields = [];
  let contentTypes = await getContentTypes(strapi);

  for (const contentType of contentTypes) {
    let item = {
      uid: contentType.uid,
      kind: contentType.kind,
      attributes: [],
    };
    getStructure(item, contentType, 'default');
    potentialFields.push(item);
  }
  const fields = potentialFields.filter(
    (content) => content.attributes.length > 0
  );
  return fields;
};

function extractAttributes(data) {
  const result = [];

  for (const item of data) {
    const { uid, attributes } = item;
    for (const attribute of attributes) {
      const { type } = attribute.value;
      if (type == 'media')
        result.push({
          uid,
          key: attribute.key,
          componentName: attribute.componentName,
        });
    }
  }

  return result
    .reduce((accumulator, current) => {
      const found = accumulator.find(
        (item) => item.uid === current.uid && item.key === current.key
      );
      if (!found) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .reduce((accumulator, current) => {
      const foundIndex = accumulator.findIndex(
        (item) => item.uid === current.uid
      );
      if (foundIndex !== -1) {
        accumulator[foundIndex].populate.push(current.key);
      } else {
        accumulator.push({
          uid: current.uid,
          populate: [current.key],
          componentName: current.componentName,
        });
      }
      return accumulator;
    }, []);
}

function getIds(data) {
  if (Array.isArray(data)) {
    return data.map((item) => item.id);
  } else if (typeof data === 'object' && data !== null && 'id' in data) {
    return [data.id];
  } else {
    return [];
  }
}

function getIdsWithHash(obj, ids = []) {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.hasOwnProperty('hash')) {
      ids.push(obj.id);
    } else {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          getIdsWithHash(obj[key], ids);
        }
      }
    }
  }
  return ids;
}

export { parse, extractAttributes, getIds, getIdsWithHash };
