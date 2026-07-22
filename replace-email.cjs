const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'email.server.ts');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `function getBaseEmailHtml(title: string, contentHtml: string): string {
  return \`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>\${title}</title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]-->
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
    <!--[if !mso]><!-- -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">
    <!--<![endif]-->
    <style type="text/css">
      body { font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #0f172a; }
      .es-wrapper-color { background-color: #f8fafc; }
      .es-header-body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); border-radius: 20px 20px 0 0; }
      .es-content-body { background-color: #ffffff; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
      .es-footer-body { background-color: transparent; padding-top: 20px; }
      .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; margin-top: 0; }
      .text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
      .card-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin: 25px 0; }
      .btn { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
      .btn-container { text-align: center; margin: 35px 0 20px 0; }
      .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      .row-label { color: #64748b; font-weight: 500; }
      .row-value { color: #0f172a; font-weight: 700; text-align: right; }
      .amount-box { text-align: center; padding: 20px 10px; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 1px solid #dbeafe; border-radius: 16px; margin-bottom: 25px; }
      .amount-label { font-size: 12px; font-weight: 600; color: #3b82f6; text-transform: uppercase; }
      .amount-value { font-size: 32px; font-weight: 800; color: #1e3a8a; margin-top: 4px; }
      @media only screen and (max-width: 600px) {
        .es-content-body { padding: 20px !important; }
        .es-header-body { padding: 25px 20px !important; }
        .h1 { font-size: 20px !important; }
      }
    </style>
  </head>
  <body class="body">
    <div dir="ltr" class="es-wrapper-color">
      <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f8fafc"></v:fill>
			</v:background>
		<![endif]-->
      <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" style="padding: 40px 20px;">
        <tbody>
          <tr>
            <td valign="top" class="esd-email-paddings">
              <table cellspacing="0" cellpadding="0" align="center" class="es-header">
                <tbody>
                  <tr>
                    <td align="center">
                      <table width="600" cellspacing="0" cellpadding="0" align="center" class="es-header-body">
                        <tbody>
                          <tr>
                            <td align="center" style="padding: 35px 40px;">
                               <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; font-family: 'Inter', Arial, sans-serif;">DolaPay</h1>
                               <div style="display: inline-block; margin-top: 8px; background-color: rgba(255, 255, 255, 0.15); color: #e0e7ff; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">Infrastructure de Paiement</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" cellspacing="0" cellpadding="0" class="es-content">
                <tbody>
                  <tr>
                    <td align="center">
                      <table cellspacing="0" align="center" width="600" cellpadding="0" class="es-content-body">
                        <tbody>
                          <tr>
                            <td align="left" style="padding: 0;">
                              \${contentHtml}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellspacing="0" cellpadding="0" align="center" class="es-footer">
                <tbody>
                  <tr>
                    <td align="center">
                      <table cellspacing="0" cellpadding="0" align="center" width="600" class="es-footer-body">
                        <tbody>
                          <tr>
                            <td align="center" style="padding: 25px 40px;">
                               <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0; font-family: 'Inter', Arial, sans-serif;">
                                 <strong>DolaPay</strong> · L'infrastructure financière nouvelle génération en Afrique de l'Ouest.
                               </p>
                               <p style="font-size: 12px; color: #64748b; margin: 0; font-family: 'Inter', Arial, sans-serif;">
                                 Vous recevez cet email car vous avez un compte ou une transaction sur <a href="https://dola-pay.com" style="color: #2563eb; font-weight: 600; text-decoration: none;">dola-pay.com</a>.
                               </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
  \`;
}`;

const functionRegex = /function getBaseEmailHtml\([^)]+\) ?: ?string \{[\s\S]*?\}\n/g;

if (functionRegex.test(content)) {
  content = content.replace(functionRegex, replacement + '\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced getBaseEmailHtml.");
} else {
  console.log("Could not find getBaseEmailHtml.");
}
