import feature3 from "@/assets/lottie/512k new.json"
import feature2 from "@/assets/lottie/edward collins new new.json"
import feature1 from "@/assets/lottie/progress hours spent.json"
import { Link } from "@tanstack/react-router"
import Container from '../../container'
import { Button } from '../../ui/button'
import {
  FeatureCard,
  FeatureCardAction,
  FeatureCardBenefitItem,
  FeatureCardBenefits,
  FeatureCardContent,
  FeatureCardDescription,
  FeatureCardImage,
  FeatureCardOverlay,
  FeatureCardTitle
} from '../../ui/feature-card'

const Features = () => {

  return (
    <section className="md:py-[60px] py-12 bg-background">
      <Container className="md:space-y-16 space-y-8">
        {/* Card 1: Intelligent Financial Insights */}
        <FeatureCard imagePosition="right" className="border-0 bg-[rgba(20,20,20,1)] sticky top-24">
          <FeatureCardContent>
            <div className="bg-white/10 text-white px-5 py-2 rounded-full mb-5">Intelligent Financial Insights</div>
            <FeatureCardTitle className='mb-5'>
              Make Smarter Money Decisions Quickly
            </FeatureCardTitle>
            <FeatureCardDescription className='mb-5'>
              Access real-time analytics and personalized insights to optimize your finances, investments, and business growth effectively.
            </FeatureCardDescription>
            <FeatureCardBenefits>
              <FeatureCardBenefitItem>
                Monitor spending trends and income patterns effortlessly.
              </FeatureCardBenefitItem>
              <FeatureCardBenefitItem>
                Generate detailed reports for informed decision-making.
              </FeatureCardBenefitItem>
              <FeatureCardBenefitItem>
                Receive actionable alerts to stay ahead financially.
              </FeatureCardBenefitItem>
            </FeatureCardBenefits>
            <FeatureCardAction>
              <Button asChild>
                <Link to="/contact">
                  Learn More
                </Link>
              </Button>
            </FeatureCardAction>
          </FeatureCardContent>
          <FeatureCardImage
            src="/images/feature/feature-alt-1.png"
            alt="Man using smartphone for financial analytics"
          >
            <FeatureCardOverlay
              animationData={feature1}
              position="top-left"
              className='aspect-[213/138] max-w-[213px] w-full'
            />
          </FeatureCardImage>
        </FeatureCard>

        {/* Card 2: Effortless Payments And Transfers */}
        <FeatureCard imagePosition="left" className="border-0 bg-[rgba(20,20,20,1)] sticky top-24">
          <FeatureCardImage
            src="/images/feature/feature-alt-2.png"
            alt="Person making payment transfer"
          >
            <FeatureCardOverlay
              animationData={feature2}
              position="top-right"
              className='aspect-[228/254] max-w-[228px] w-full'
            />
          </FeatureCardImage>
          <FeatureCardContent>
            <div className="bg-white/10 text-white px-5 py-2 rounded-full mb-5">
              Effortless Payments And Transfers
            </div>
            <FeatureCardTitle>
              Send Money With Total Confidence
            </FeatureCardTitle>
            <FeatureCardDescription className='mb-5'>
              Execute fast, secure transfers anytime, anywhere, ensuring your payments are seamless and worry-free across accounts.
            </FeatureCardDescription>
            <FeatureCardBenefits>
              <FeatureCardBenefitItem>
                Instant domestic and international transfers.
              </FeatureCardBenefitItem>
              <FeatureCardBenefitItem>
                Multi-account management in one dashboard.
              </FeatureCardBenefitItem>
              <FeatureCardBenefitItem>
                Enhanced security protocols for every transaction.
              </FeatureCardBenefitItem>
            </FeatureCardBenefits>
            <FeatureCardAction>
              <Button asChild>
                <Link to="/contact">
                  Learn More
                </Link>
              </Button>
            </FeatureCardAction>
          </FeatureCardContent>
        </FeatureCard>

        {/* Card 3: Flexible Business Solutions */}
        <FeatureCard imagePosition="right" className="border-0 bg-[rgba(20,20,20,1)] sticky top-24">
          <FeatureCardContent>
            <div className="bg-white/10 text-white px-5 py-2 rounded-full mb-5">
              Flexible Business Solutions
            </div>
            <FeatureCardTitle>
              Empower Your Business Growth Today
            </FeatureCardTitle>
            <FeatureCardDescription className='mb-5'>
              Access working capital, customizable financial tools, and support designed to scale your business efficiently.
            </FeatureCardDescription>
            <FeatureCardBenefits>
              <FeatureCardBenefitItem>
                Quick funding options for operational needs.
              </FeatureCardBenefitItem>
              <FeatureCardBenefitItem>
                Flexible credit and spending tools.
              </FeatureCardBenefitItem>
              <FeatureCardBenefitItem>
                Dedicated support for growing enterprises.
              </FeatureCardBenefitItem>
            </FeatureCardBenefits>
            <FeatureCardAction>
              <Button asChild>
                <Link to="/contact">
                  Learn More
                </Link>
              </Button>
            </FeatureCardAction>
          </FeatureCardContent>
          <FeatureCardImage
            src="/images/feature/feature-alt-3.png"
            alt="Business meeting and investment growth"
          >
            <FeatureCardOverlay
              animationData={feature3}
              position="bottom-left"
              className='aspect-[292/187] max-w-[292px] w-full bg-card'
            />
          </FeatureCardImage>
        </FeatureCard>
      </Container>
    </section>
  )
}

export default Features
