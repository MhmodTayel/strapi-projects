export default [
  {
    method: "POST",
    path: "/",
    handler: "controller.create",
    config: {
      policies: [],
      auth: false,
    },
  },
];
