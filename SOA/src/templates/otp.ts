import buildTemplate from './baseTemplate';

export default buildTemplate({
  subject: 'Syndicate of Artists OTP',
  text: ``,
  body: `
  <tr>
    <td align="left" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        Hello,  </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
        <td align="left" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
            <%= code %> is your OTP from the syndicate of Artists, please don’t share it with anyone for your safety. This code is valid for 5 minutes, if the code expires please go and resend the code again.
        </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <td align="left" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    الكود المتغير الخاص بكم هو <%= code %> ,برجاء عدم مشاركته مع أحد للحفاظ على أمان حسابك   </td>
    </tr>
    <tr>
        <td align="left" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        هذا الكود صالح لخمس دقائق فقط
        </td>
    </tr>
    <tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <td align="left" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        Thank you,  </td>
    </tr>
    <td align="left" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        SOA Technical Support  </td>
    </tr>
    `,
});
