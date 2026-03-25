import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";

interface WaitlistWelcomeProps {
  email: string;
}

export default function WaitlistWelcome({ email }: WaitlistWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Templio beta invite request is in.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://templio.app/logo.svg"
            alt="Templio Logo"
            width="120"
            height="120"
            style={logo}
          />
          <Heading style={h1}>Templio beta request received</Heading>
          <Text style={text}>
            Thanks for requesting access to Templio. Your email has been added
            to our invite-only beta list.
          </Text>
          <Text style={text}>
            Templio is an invite-only beta website builder for custom
            portfolios, studio sites, and community hubs. No templates, just
            your taste.
          </Text>
          <Text style={text}>
            We&apos;re opening access in small batches. We&apos;ll reach out as
            new spots open for the email below:
            <br />
            <br />
            <strong>{email}</strong>
          </Text>
          <Text style={text}>
            Thanks for the patience. Software always says it will be soon and
            then argues with reality for a while.
          </Text>
          <Text style={footer}>
            Best,
            <br />
            <a href="https://www.ayush.im">Ayush Rameja</a> at Templio
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logo = {
  display: "block",
  margin: "40px auto 20px",
};

const h1 = {
  color: "#000000",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
  margin: "16px 0",
};

const footer = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
  margin: "32px 0 0 0",
};
