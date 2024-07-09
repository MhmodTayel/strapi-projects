/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
module.exports = {
   // Override toolbar config to leave a few buttons
   // toolbar: {
   //    items: [
   //       'heading',
   //       '|',
   //       'bold',
   //       'italic',
   //       'link',
   //       'alignment',
   //       '|',
   //       'undo',
   //       'redo',
   //    ],
   // },
   htmlSupport: {
      allow: [
         // "div", "strong", "span", "ul", "li", "h1", "h2", "h3"
         {
            name: /.*/,
            attributes: true,
            classes: true,
            styles: true
         }
      ]
   },
   // htmlEmbed: {
   //    sanitizeHtml: (inputHtml) => {
   //       return {
   //          html: inputHtml,
   //          // true or false depending on whether the sanitizer stripped anything.
   //          hasChanged: true
   //       };
   //    }
   // },
   // sanitizeHtml: (inputHtml) => {
   //    return {
   //       html: inputHtml,
   //       // true or false depending on whether the sanitizer stripped anything.
   //       hasChanged: true
   //    };
   // },
   allowedContent: true
};