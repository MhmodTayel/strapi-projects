# Strapi plugin async-mail

# Status: Work in Progress

The `async-mail` plugin makes it possible to send form data from anonymous users to a defined email address. Form data is stored in a collection and sent asyncronously by a cronjob. A typical use case is a contact form that is supposed to send entered data to a defined email address.

##  🖐 Requirements


- strapi 4 
- nodes 18|20

## ⏳ Install

```
yarn add strapi-plugin-async-mail
```

## 🔌 Usage

Define a ASYNC_MAIL_RECIPIENT Address in your `.env`

```
curl -d "subject=Mailsubject&message=Mail+Text" "http://127.0.0.1:1337/async-mail"
{
  "id": 5,
  "subject": "Mailsubject",
  "message": "Mail Text",
  "status": "new",
  "from": "example@cross-solution.de",
  "recipient": "example@cross-solution.de",
  "sentAt": null,
  "replyTo": null,
  "priority": null,
  "meta": null,
  "createdAt": "2024-07-07T09:21:04.937Z",
  "updatedAt": "2024-07-07T09:21:04.937Z"
}
```





