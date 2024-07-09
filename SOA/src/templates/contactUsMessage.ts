import buildTemplate from './baseTemplate';

export default buildTemplate({
  subject: 'SOA Message',
  text: `You've a new message!
  Name: <%= Name %>
  Email: <%= Email %>
  Message: <%= Message %>`,
  body: `
  <tr>
      <td align="left" class="headline-two text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 24px;font-weight: 500;line-height: 32px;color: #343a40;">
          You've a new message!
      </td>
  </tr>
  <tr>
      <td class="spacer-sm" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 16px;line-height: 16px;"></td>
  </tr>
  <tr>
      <td align="left" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
          <p><span style="font-size: 14px;font-weight: 500" >Name: </span><%= Name %></p>
          <p><span style="font-size: 14px;font-weight: 500" >Email: </span><%= Email %></p>
          <p><span style="font-size: 14px;font-weight: 500" >Message: </span><%= Message %></p>
      </td>
  </tr>
  <tr>
      <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
  </tr>`,
});
