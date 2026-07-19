import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/company/contact")({ component: Contact });
import Layout from "@/components/layout";
import ContactForm from "@/components/sections/contact/contact-form";

const Contact = () => {

  return (
    <>

      <Layout>
        <ContactForm />
      </Layout>
    </>
  );
};




