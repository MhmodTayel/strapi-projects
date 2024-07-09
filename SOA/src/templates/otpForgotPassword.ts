import buildTemplate from './baseTemplate';

export default buildTemplate({
  subject: 'نقابة المهن التمثيلية- إستعادة كلمة المرور',
  text: ``,
  body: `
  <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    <%= username %> مرحبًا  </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        نأمل أن تكون بخير. نحن هنا لمساعدتك في استعادة كلمة المرور الخاصة بحسابك
        </td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    يرجى استخدام رمز التحقق التالي لإعادة تعيين كلمة المرور الخاصة بك </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    <%= code %> :رمز التحقق</td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    
    
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    إذا كنت لم تطلب إعادة تعيين كلمة المرور الخاصة بحسابك، فقط تجاهل هذه الرسالة. سيبقى حسابك آمنًا ولن يتم التأثير عليه </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    تذكير: لا تشارك رمز التحقق هذا مع أي شخص. يُفضل أن تقوم بإعادة تعيين كلمة المرور الخاصة بك بنفسك عن طريق إدخال الرمز في صفحة إعادة تعيين كلمة المرور</td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    شكرًا لك </br> نقابة المهن التمثيلية </td>
    </tr>
    `,
});
