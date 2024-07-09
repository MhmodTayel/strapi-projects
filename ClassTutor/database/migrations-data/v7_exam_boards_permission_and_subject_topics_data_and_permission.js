'use strict';
const _ = require('lodash');

module.exports = async () => {

  //Populating topics table 
  const parentTopic1 = { name: '19th-century novels and prose for GCSE', parent_topic: null, type: "English" };
  const parentTopic2 = { name: 'Shakespeare for GCSE', parent_topic: null, type: "English" };
  const parentTopic3 = { name: 'Modern drama texts for GCSE', parent_topic: null, type: "English" };
  const parentTopic4 = { name: 'Modern prose texts for GCSE', parent_topic: null, type: "English" };
  const parentTopic5 = { name: 'Poetry', parent_topic: null, type: "English" };

  var subjectTopics = [
    parentTopic1,
    { name: 'A Christmas Carol by Charles Dickens', parent_topic: parentTopic1, type: "English" },
    { name: 'Great Expectations by Charles Dickens', parent_topic: parentTopic1, type: "English" },
    { name: 'Frankenstein by Mary Shelley', parent_topic: parentTopic1, type: "English" },
    { name: 'Jane Eyre by Charlotte Brontë', parent_topic: parentTopic1, type: "English" },
    { name: 'Pride and Prejudice by Jane Austen', parent_topic: parentTopic1, type: "English" },
    { name: 'The Sign of Four by Arthur Conan Doyle', parent_topic: parentTopic1, type: "English" },
    { name: 'The Strange Case of Dr Jekyll and Mr Hyde by Robert Louis Stevenson', parent_topic: parentTopic1, type: "English" },
    { name: 'Silas Marner by George Eliot', parent_topic: parentTopic1, type: "English" },
    { name: 'War of the Worlds by HG Wells', parent_topic: parentTopic1, type: "English" },
    parentTopic2,
    { name: 'Macbeth', parent_topic: parentTopic2, type: "English" },
    { name: 'Romeo and Juliet', parent_topic: parentTopic2, type: "English" },
    { name: 'The Tempest', parent_topic: parentTopic2, type: "English" },
    { name: 'Merchant of Venice', parent_topic: parentTopic2, type: "English" },
    { name: 'Much Ado About Nothing', parent_topic: parentTopic2, type: "English" },
    { name: 'Julius Caesar', parent_topic: parentTopic2, type: "English" },
    { name: 'Twelfth Night', parent_topic: parentTopic2, type: "English" },
    { name: 'Othello', parent_topic: parentTopic2, type: "English" },
    { name: 'Henry V', parent_topic: parentTopic2, type: "English" },
    parentTopic3,
    { name: 'The Empress by Tanika Gupta', parent_topic: parentTopic3, type: "English" },
    { name: 'Refugee Boy by Benjamin Zephaniah (adapted  by Lemn Sissay)', parent_topic: parentTopic3, type: "English" },
    { name: 'An Inspector Calls by JB Priestley', parent_topic: parentTopic3, type: "English" },
    { name: 'Blood Brothers by Willy Russell', parent_topic: parentTopic3, type: "English" },
    { name: 'The History Boys by Alan Bennett', parent_topic: parentTopic3, type: "English" },
    { name: 'DNA by Dennis Kelly', parent_topic: parentTopic3, type: "English" },
    { name: 'Curious Incident of the Dog in the Night-time by Mark Haddon / Simon Stephens', parent_topic: parentTopic3, type: "English" },
    { name: 'A Taste of Honey by Shelagh Delaney', parent_topic: parentTopic3, type: "English" },
    { name: 'Hobson’s Choice by Harold Brighouse', parent_topic: parentTopic3, type: "English" },
    { name: 'Journey’s End by RC Sherriff  ', parent_topic: parentTopic3, type: "English" },
    { name: 'My Mother Said I Never Should by Charlotte Keatley', parent_topic: parentTopic3, type: "English" },
    { name: 'A View From the Bridge by Arthur Miller', parent_topic: parentTopic3, type: "English" },
    { name: 'Be My Baby by Amanda Whittington', parent_topic: parentTopic3, type: "English" },
    { name: 'Dancing at Lughnasa by Brian Friel', parent_topic: parentTopic3, type: "English" },
    { name: 'All My Sons by Arthur Miller', parent_topic: parentTopic3, type: "English" },
    { name: 'Philadelphia, Here I Come! by Brian Friel', parent_topic: parentTopic3, type: "English" },
    { name: 'Our Town by Thornton Wilder', parent_topic: parentTopic3, type: "English" },
    { name: 'Leave Taking by Winsome Pinnock', parent_topic: parentTopic3, type: "English" },
    { name: 'Princess & the Hustler by Chinonyerem Odimba', parent_topic: parentTopic3, type: "English" },
    { name: 'Three Dublin Plays by Sean O’Casey', parent_topic: parentTopic3, type: "English" },
    parentTopic4,
    { name: 'Coram Boy by Jamila Gavin', parent_topic: parentTopic4, type: "English" },
    { name: 'Boys Don’t Cry by Malorie Blackman', parent_topic: parentTopic4, type: "English" },
    { name: 'Things Fall Apart by Chinua Achebe', parent_topic: parentTopic4, type: "English" },
    { name: 'Lord of the Flies by William Golding', parent_topic: parentTopic4, type: "English" },
    { name: 'The Power and the Glory by Graham Greene', parent_topic: parentTopic4, type: "English" },
    { name: 'To Kill A Mockingbird by Harper Lee', parent_topic: parentTopic4, type: "English" },
    { name: 'Animal Farm by George Orwell', parent_topic: parentTopic4, type: "English" },
    { name: 'Of Mice and Men by John Steinbeck', parent_topic: parentTopic4, type: "English" },
    { name: 'Anita & Me by Meera Syal', parent_topic: parentTopic4, type: "English" },
    { name: 'Woman in Black by Susan Hill', parent_topic: parentTopic4, type: "English" },
    { name: 'Never Let Me Go by Kazuo Ishiguro', parent_topic: parentTopic4, type: "English" },
    { name: 'Paddy Clarke Ha Ha Ha by Roddy Doyle', parent_topic: parentTopic4, type: "English" },
    { name: 'Heroes by Robert Cormier', parent_topic: parentTopic4, type: "English" },
    { name: 'About a Boy by Nick Hornby', parent_topic: parentTopic4, type: "English" },
    { name: 'Resistance by Owen Sheers', parent_topic: parentTopic4, type: "English" },
    { name: 'I Know Why the Caged Bird Sings by Maya Angelou', parent_topic: parentTopic4, type: "English" },
    { name: 'Ash on a Young Man’s Sleeve by Danni Abse', parent_topic: parentTopic4, type: "English" },
    { name: 'Oranges are Not the Only Fruit by Jeanette Winterson', parent_topic: parentTopic4, type: "English" },
    { name: 'How Many Miles to Babylon? by Jennifer Johnston', parent_topic: parentTopic4, type: "English" },
    { name: 'Pigeon English by Stephen Kelman', parent_topic: parentTopic4, type: "English" },
    { name: 'Chanda’s Secrets by Allan Stratton', parent_topic: parentTopic4, type: "English" },
    { name: 'My Name is Leon by Kit de Waal', parent_topic: parentTopic4, type: "English" },
    parentTopic5,
    { name: 'Love and Relationships', parent_topic: parentTopic5, type: "English" },
    { name: 'Power and Conflict', parent_topic: parentTopic5, type: "English" },
    { name: 'Worlds and Lives', parent_topic: parentTopic5, type: "English" },
    { name: 'Youth and Age', parent_topic: parentTopic5, type: "English" }
  ];

  for (const topic of subjectTopics) {
    var parentId = null;

    if (topic.parent_topic) {
      const existingParentTopic = await strapi.entityService.findMany('api::subject-topic.subject-topic', {
        filters: { name: topic.parent_topic.name }
      });

      parentId = existingParentTopic[0].id;
    }

    await strapi.entityService.create('api::subject-topic.subject-topic', {
      data: {
        name: topic.name,
        parent_topic: parentId,
        type: topic.type
      }
    });
  }

  //END Populating subject topics table 

  //Adding permissions to exam-board and subject-topic tables 
  var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
  var authenticatedRole = _.find(roles, { type: 'authenticated' });

  var rolePermissions = [
    { permission: 'api::exam-board.exam-board.find', roles: [authenticatedRole.id] },
    { permission: 'api::subject-topic.subject-topic.find', roles: [authenticatedRole.id] },
  ];

  for (let i = 0; i < rolePermissions.length; i++) {
    const rolePermission = rolePermissions[i];

    for (let j = 0; j < rolePermission.roles.length; j++) {
      const roleId = rolePermission.roles[j];

      await strapi.entityService.create('plugin::users-permissions.permission', {
        data: {
          action: rolePermission.permission,
          role: roleId
        }
      });
    }
  }
};