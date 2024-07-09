import buildTemplate from './baseTemplate';

export default buildTemplate({
  subject: 'نقابة المهن التمثيلية- معلومات حسابك للدخول',
  text: ``,
  body: `
  <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    نأمل أن تكون بخير</td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    نود تزويدك بمعلومات حسابك الخاصة للوصول إلى خدماتنا</td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
         <%= username %> : اسم المستخدم
        </td>
    </tr>
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        <%= password %> : كلمة المرور
        </td>
    </tr>
    <tr>
        <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
        نوع المستخدم: <%= role %> 
         </td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    يرجى استخدام هذه المعلومات لتسجيل الدخول إلى حسابك على موقعنا أو تطبيقنا. بمجرد تسجيل الدخول، يُرجى تغيير كلمة المرور الحالية إلى كلمة مرور قوية وسرية تحفظها بدقة</td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    شكرًا لك على ثقتك في خدماتنا. نتطلع لتقديم أفضل تجربة لك</td>
    </tr>
    <tr>
        <td class="spacer-md" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;display: block;width: 100%;height: 24px;line-height: 24px;"></td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    مع خالص التحية</td>
    </tr>
    <tr>
    <td align="right" class="body text-dark-gray" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;font-style: normal;font-variant: normal;font-size: 14px;font-weight: 400;line-height: 20px;color: #343a40;">
    نقابة المهن التمثيلية</td>
    </tr>
    
    `,
});
