import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";

interface WaitlistWelcomeProps {
  email: string;
  idea?: string;
}

export default function WaitlistWelcome({ email, idea }: WaitlistWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Got your Templio pitch.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://templio.app/logo.svg"
            alt="Templio Logo"
            width="80"
            height="80"
            style={logo}
          />
          <Heading style={h1}>Thanks for the pitch.</Heading>
          <Text style={text}>
            I got your idea. I&apos;ll read it properly and reach out from this
            same address.
          </Text>

          {idea && (
            <>
              <Text style={label}>Your pitch</Text>
              <Container style={quote}>
                <Text style={quoteText}>{idea}</Text>
              </Container>
            </>
          )}

          <Text style={text}>
            Templio is a passion project - custom websites for people who still
            care how the web feels. No templates, no invoices, no sales calls.
            Just sites I&apos;d want to exist.
          </Text>

          <Text style={text}>
            I take on a few of these at a time, so it might take a minute to
            hear back. I read every pitch.
          </Text>

          <Hr style={divider} />

          <Text style={fineprint}>
            Sent to <strong>{email}</strong>. If this wasn&apos;t you, just
            ignore it.
          </Text>

          <Text style={footer}>
            Take care,
            <br />
            <a href="https://www.ayush.im" style={link}>
              Ayush
            </a>{" "}
            at Templio
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
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.25",
  margin: "32px 0 24px",
  padding: "0 40px",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
  margin: "16px 0",
};

const label = {
  color: "#666666",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  padding: "0 40px",
  margin: "32px 0 8px",
};

const quote = {
  borderLeft: "3px solid #000000",
  backgroundColor: "#f5f5f5",
  margin: "0 40px 16px",
  padding: "16px 20px",
};

const quoteText = {
  color: "#111111",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0",
  fontStyle: "italic" as const,
  whiteSpace: "pre-wrap" as const,
};

const divider = {
  borderColor: "#eaeaea",
  margin: "32px 40px",
};

const fineprint = {
  color: "#888888",
  fontSize: "13px",
  lineHeight: "20px",
  padding: "0 40px",
  margin: "16px 0",
};

const footer = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
  margin: "24px 0 0 0",
};

const link = {
  color: "#000000",
  textDecoration: "underline",
};
