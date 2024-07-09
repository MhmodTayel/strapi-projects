##🔔 Event notifications (using Socket.IO)

Server will start and init socket.io connection for clients to join.

Clients will be able to connect to the server and once connect will do the following:

1. Client sends "join" message to the server with the following json:

    - `{ "userId": 1, "entityId": 1, "portal": "admin" }`
    - `userId` is the id of the logged in user
    - `entityId` is the id of the entity object, for example if its student, it will be sudent id, if admin, its the admin id and so on for parent and teacher.
    - `portal` is where the user is logged into, will be one of `admin`, `teacher`, `parent` or `student`.
    - if an admin user of permission of meeting recording from `user.additionalPermission` joins with value of `meeting-recording` the value in `portal` field will be `admin-meeting-recording` instead of just `admin`

1. Server will add this connection to some rooms on the server-side using socket.io rooms feature.
    - Rooms will be created using the passed json values `userId`, `entityId` and `portal`
    - The server uses these rooms to send messages to them from the backend
    - The functionality of these notifications are defined below in their respective sections

**Client will listen to the following events from server**

1. `welcome`
    - To receive the first connection confirmation message
    - No action required by client
    - No message to display to the user
1. `notify`

    - To receive the notifications that are displayed to the message to clients
    - Some of the se notifications will just be text message, and some will be links
    - If its link or not, check the `entity` object, if blank it will be just text message

1. `notify-background`
    - To receive notifications as background tasks
    - No messages are displayed to the user

**Server to client event notification json**

```
{
    eventCode: "Unique code sent to client to identify the purpose of message",
    message: "String message text",
    entity: "Type of entity this message is intended for",
    entityId: "Database id of the entity",
    eventType: "To show the severinity of the message, can be one of info, success, warning, error or question", // only info is used currently
    persist: "To show if the notification is to be persisted i.e. stick in the UI", // not used currently
}
```

**_Background notifications will have following json_**

```
{
    eventCode: "",
    entity: "",
    entityId: "",
    eventType: "",
    persist: ""
}
```

**🚀 Testing: Postman script available**

Below is the list of notifications that are sent to clients in different portals alongwith their event codes. Some of these events are to be run on background only.

####👤 Admin notifications

| Event Code | Entity          | Receiver    | Event Type | Background | Message                           |
| ---------- | --------------- | ----------- | ---------- | ---------- | --------------------------------- |
| 1001       | Student         | admin-users | info       | false      | New student has signed up         |
| 1002       | Teacher         | admin-users | info       | false      | New teacher has signed up         |
| 1003       | Teacher         | admin-users | info       | false      | Teacher has rejected offer        |
| 1004       | Teacher         | admin-users | info       | false      | Teacher has accepted offer        |
| 1005       | Teacher         | admin-users | info       | false      | Teacher has completed onboarding  |
| 1006       | Teacher         | admin-users | info       | false      | Teacher has reapplied             |
| 1007       | Student         | admin-users | info       | false      | Postponement end student          |
| 1008       | Student         | admin-users | info       | false      | Postponement end student-class    |
| 1009       | registerStudent | admin-users | info       | false      | Behaviour issue added for student |

####👤 Teacher notifications

| Event Code | Entity   | Receiver          | Event Type | Background | Message                                   |
| ---------- | -------- | ----------------- | ---------- | ---------- | ----------------------------------------- |
| 1100       | Homework | teacher-users     | info       | true       | The homework is available for marking     |
| 1101       | Homework | teacher-users     | info       | true       | The homework is locked to a teacher       |
| 1102       | Register | teacher-user-{id} | info       | false      | A class has been assigned to you          |
| 1103       | Register | teacher-user-{id} | info       | false      | A class has been assigned to someone else |
| 1104       | Register | teacher-user-{id} | info       | false      | A class has been {cancelled/absent}       |
| 1105       | Register | teacher-users     | info       | true       | The homework marking is complete          |
| 1106       | Class    | teacher-users     | info       | true       | The class date or time has changed        |

####👤 Parent notifications

| Event Code | Entity   | Receiver         | Event Type | Background | Message                            |
| ---------- | -------- | ---------------- | ---------- | ---------- | ---------------------------------- |
| 1200       | Register | parent-user-{id} | info       | false      | Student awarded star student       |
| 1201       | Register | parent-user-{id} | info       | false      | Student was absent                 |
| 1202       | Register | parent-user-{id} | info       | false      | Review lesson                      |
| 1203       | Register | parent-user-{id} | info       | false      | Behaviour issue                    |
| 1204       | Class    | parent-user-{id} | info       | false      | The class date or time has changed |

####👤 Student notifications

| Event Code | Entity   | Receiver          | Event Type | Background | Message                            |
| ---------- | -------- | ----------------- | ---------- | ---------- | ---------------------------------- |
| 1300       | Register | student-user-{id} | info       | false      | Awarded star student               |
| 1301       | Register | student-user-{id} | info       | false      | Student was absent                 |
| 1302       | Register | student-user-{id} | info       | false      | Review lesson                      |
| 1303       | Register | student-user-{id} | info       | false      | Behaviour issue                    |
| 1304       | Class    | student-user-{id} | info       | false      | The class date or time has changed |

####👤 Entity Notifications

| Event Code | Entity   | Receiver             | Event Type | Background | Message                                                 |
| ---------- | -------- | -------------------- | ---------- | ---------- | ------------------------------------------------------- |
| 1400       | Register | entity-register-{id} | info       | true       | Register student data updated for {{registerStudentId}} |

##Fetch notifications from api

The above socketio setup will show the realtime notifications, but once the user logs in to the app, we need to show them previous notifications. When notifications are received by the app, they are stored in the backend database in event-messages table. Use the below logic to fetch notifications for different user types:

`GET` request for `api/event-messages`

-   8 notifications per page
    -   load more button will be used for paging starting from page 1
-   get upto last 15 days of notifications, use `createdAt` field for this
-   filter the `receiverId` based on the below with "OR" condition:

    -   user-id-{user_id}
    -   {portal}-user-{entity_id}
    -   {portal}-users
        -   for admin meeting-recording users this will be "admin-meeting-recording-users"
