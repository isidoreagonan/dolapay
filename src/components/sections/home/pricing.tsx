import { AnimateOnView } from '@/components/ui/motion/animate-on-view'
import { StaggerContainer } from '@/components/ui/motion/stagger'
import Container from '../../container'
import { PricingCard } from '../../ui/pricing-card'

const pricingPlans = [
  {
    id: 1,
    title: "Standard",
    description: "Tarification unique et transparente pour tous les marchands et startups en croissance.",
    price: "2%",
    pricePeriod: "+ frais opérateur",
    features: [
      "Commission fixe DolaPay de 2% par transaction",
      "Frais réels de l'opérateur local répercutés à l'identique",
      "Aucun frais d'installation, aucun frais mensuel",
      "Aucun frais caché — jamais",
      "Accès complet à l'API, liens de paiement et Bulk Pay-out",
      "Support technique et documentation développeur inclus",
    ],
    buttonText: "Commencer gratuitement",
    buttonLink: "/pricing/starter",
    isHighlighted: false,
  },
  {
    id: 2,
    title: "Scale",
    description: "Pour les e-commerçants et plateformes à fort volume — tarifs négociés dès 100M FCFA/mois.",
    price: "Sur devis",
    pricePeriod: "",
    features: [
      "Commission dégressive selon volume",
      "Frais opérateur préférentiels via nos partenariats",
      "Manager de compte dédié 7j/7",
      "SLA garanti et intégration prioritaire",
      "Reporting avancé et réconciliation automatique",
      "Support 24/7 par WhatsApp, Slack et téléphone",
    ],
    buttonText: "Parler à un expert",
    buttonLink: "/pricing/professional",
    isHighlighted: true,
    backgroundImage: "/images/pricing/pricing-bg.webp",
  },
]

const Pricing = () => {

  return (
    <section className="py-12 md:py-[60px]">
      <Container className="space-y-8 md:space-y-20">
        <StaggerContainer className="text-center">
          <AnimateOnView blur>
            <h2 className="h2 mb-5">
              Une tarification, zéro surprise
            </h2>
          </AnimateOnView>
          <AnimateOnView blur delay={0.2}>
            <p className="text-muted-foreground">
              2% de commission DolaPay + les frais réels de l'opérateur local. Aucun frais caché, aucun frais d'installation.
            </p>
          </AnimateOnView>
        </StaggerContainer>
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1058px] mx-auto">
            {pricingPlans.map((plan, index) => (
              <AnimateOnView key={plan.id} delay={index * 0.1}>
                <PricingCard
                  title={plan.title}
                  description={plan.description}
                  price={plan.price}
                  pricePeriod={plan.pricePeriod}
                  features={plan.features}
                  buttonText={plan.buttonText}
                  buttonLink={plan.buttonLink}
                  isHighlighted={plan.isHighlighted}
                  backgroundImage={plan.backgroundImage}
                />
              </AnimateOnView>
            ))}
          </div>
        </StaggerContainer>
      </Container>
    </section>
  )
}

export default Pricing
