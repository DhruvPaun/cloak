import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

export default function VerifyEmail(
  username:string,
  verificationCode:string
) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-aws text-[#212121]">
          <Preview>Email Verification</Preview>
          <Container className="p-5 mx-auto bg-[#eee]">
            <Section className="bg-white">
              <Section className="py-[25px] px-[35px]">
                <Heading className="text-[#333] text-[20px] font-bold mb-[15px]">
                  Verify your email address Mr {username}
                </Heading>
                <Text className="text-[#333] text-[14px] leading-[24px] mt-6 mb-[14px] mx-0">
                  Thanks for starting the new account creation process. We
                  want to make sure it's really you. Please enter the following
                  verification code when prompted. If you don&apos;t want to
                  create an account, you can ignore this message.
                </Text>
                <Section className="flex items-center justify-center">
                  <Text className="text-[#333] m-0 font-bold text-center text-[14px]">
                    Verification code
                  </Text>

                  <Text className="text-[#333] text-[36px] my-[10px] mx-0 font-bold text-center">
                    {verificationCode}
                  </Text>
                  <Text className="text-[#333] text-[14px] m-0 text-center">
                    (This code is valid for 10 minutes)
                  </Text>
                </Section>
              </Section>
              <Hr />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
