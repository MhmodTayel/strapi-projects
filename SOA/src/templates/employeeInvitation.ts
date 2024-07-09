import buildTemplate from './baseTemplate';

export default buildTemplate({
  subject: 'دعوة تفعيل حساب موظف لنقابة المهن التمثيلية',
  text: ``,
  body: `
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        ,<%= user.firstname %> <%= user.lastname %> مرحبًا
        </td>
    </tr>
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        ,لقد تمت دعوتك لاستخدام لوحة التحكم الإدارية لـنقابة المهن التمثيلية. يُرجى النقر على الزر أدناه لتفعيل حسابك

        </td>
    </tr>
    <tr>
        <td class="spacer-sm" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 16px;line-height: 16px;"></td>        
    </tr>
    
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
        <td align="right" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;">
            <table border="0" cellspacing="0" cellpadding="0" role="presentation" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td align="right" class="button-bg button-bg-primary" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-radius: 2px;background-color: #007bff;">
                            <a href=<%= url %> class="button button-primary" style="color: white;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-weight: 700;text-decoration: none;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;border-radius: 2px;display: inline-block;font-size: 14px;padding: 10px 20px 10px;border: 1px solid #007bff;">قبول الدعوة</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        شكرًا لك ونتطلع إلى رؤيتك على منصتنا
        </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        مع أطيب التحيات </br> نقابة المهن التمثيلية
        </td>
    </tr>
    `,
});
