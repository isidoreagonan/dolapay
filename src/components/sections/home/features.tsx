import { AnimateOnView } from '@/components/ui/motion/animate-on-view'
import { StaggerContainer } from '@/components/ui/motion/stagger'
import { Link } from "@tanstack/react-router"
import Container from '../../container'
import { Button } from '../../ui/button'
import {
  FeatureCard,
  FeatureCardAction,
  FeatureCardContent,
  FeatureCardDescription,
  FeatureCardImage,
  FeatureCardOverlay,
  FeatureCardTitle
} from '../../ui/feature-card'

const cards = [
  {
    id: 1,
    title: "Encaissez partout : Mobile Money & Cartes",
    description: "Acceptez les paiements MTN, Orange, Moov, Wave, Airtel, M-Pesa et cartes bancaires dans 12 économies africaines, depuis une seule intégration.",
    imageSrc: "images/home/feature-1.jpg",
    imageAlt: "Marchand africain encaissant un paiement Mobile Money",
    overlayData: {
      src: "images/home/feature-stat-1.webp",
      alt: "Statistiques de paiement en temps réel",
      className: "aspect-[203/188] w-full max-w-[203px]"
    },
    overlayPosition: "bottom-left" as const
  },
  {
    id: 2,
    title: "Créez des liens de paiement sans code",
    description: "Générez un lien de paiement en quelques secondes, partagez-le sur WhatsApp ou intégrez-le à votre site e-commerce — aucune ligne de code requise.",
    imageSrc: "images/home/feature-2.jpg",
    imageAlt: "Lien de paiement DolaPay sur un checkout e-commerce",
    overlayData: {
      src: "images/home/feature-stat-2.png",
      alt: "Aperçu d'un lien de paiement",
      className: "aspect-[244/130] w-full max-w-[244px]"
    },
    overlayPosition: "bottom-left" as const
  },
  {
    id: 3,
    title: "Sécurité transactionnelle de niveau bancaire",
    description: "Chiffrement de bout en bout, détection de fraude et conformité PCI DSS pour protéger chaque transaction sur tout le continent.",
    imageSrc: "images/home/feature-3.jpg",
    imageAlt: "Sécurité des transactions DolaPay en Afrique",
    overlayData: {
      src: "images/home/feature-stat-3.png",
      alt: "Indicateurs de sécurité",
      className: "aspect-[173/180] w-full max-w-[173px]"
    },
    overlayPosition: "bottom-left" as const
  }
]

const Features = () => {

  return (
    <section className="py-12 md:py-[60px] bg-background">
      <Container className="space-y-8 md:space-y-20">
        <StaggerContainer className="text-center max-w-xl mx-auto">
          <AnimateOnView blur>
            <h2 className="h2 mb-6">
              Une seule plateforme, tout le continent
            </h2>
          </AnimateOnView>
          <AnimateOnView blur delay={0.2}>
            <p className='text-muted-foreground'>
              Pay-in, Pay-out, liens de paiement et API robuste — DolaPay couvre 12 marchés africains avec tous les opérateurs majeurs.
            </p>
          </AnimateOnView>
        </StaggerContainer>
        <StaggerContainer
          className='max-w-[1062px] mx-auto md:space-y-[60px] space-y-8'
        >
          {cards.map((card, index) => (
            <AnimateOnView
              delay={index * 0.1}
              key={card.id}
              className={`md:sticky md:top-24 z-10 bg-background md:rounded-[30px] rounded-lg`}
            >
              <FeatureCard
                imagePosition="right"
              >
                <FeatureCardContent>
                  <FeatureCardTitle>{card.title}</FeatureCardTitle>
                  <FeatureCardDescription>{card.description}</FeatureCardDescription>
                  <FeatureCardAction>
                    <Button asChild>
                      <Link to="/contact">
                        En savoir plus
                      </Link>
                    </Button>
                  </FeatureCardAction>
                </FeatureCardContent>
                <FeatureCardImage src={card.imageSrc} alt={card.imageAlt}>
                  <FeatureCardOverlay
                    src={card.overlayData.src}
                    alt={card.overlayData.alt}
                    position={card.overlayPosition}
                    className={card.overlayData.className}
                  />
                </FeatureCardImage>
              </FeatureCard>
            </AnimateOnView>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  )
}

export default Features
