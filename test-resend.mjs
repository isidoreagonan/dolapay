import { Resend } from "resend";

const resend = new Resend("re_BwugtyN1_6JyqoNksaXtD7jG487BfWgs4");

async function test() {
  try {
    const { data, error } = await resend.emails.send({
      from: "DolaPay <notification@dola-pay.com>",
      to: ["dolapoecom1@gmail.com"],
      subject: "Test Resend direct",
      html: "<p>Hello from direct test</p>",
    });
    if (error) {
      console.error("Resend Error:", error);
    } else {
      console.log("Success! ID:", data?.id);
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

test();
