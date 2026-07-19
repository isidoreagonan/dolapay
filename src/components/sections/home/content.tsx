import lottie1 from '@/assets/lottie/content-1.json';
import lottie2 from '@/assets/lottie/content-2.json';
import lottie3 from '@/assets/lottie/content-3.json';
import { AnimateOnView } from '@/components/ui/motion/animate-on-view';
import { StaggerContainer } from '@/components/ui/motion/stagger';
import Lottie from 'lottie-react';
import Container from '../../container';

const streamlineFeatures = [
  {
    id: 1,
    title: "Pay-in Mobile Money & Cartes",
    description: "Encaissez sur MTN, Orange, Moov, Wave, Airtel, M-Pesa et cartes Visa/Mastercard en un seul appel API.",
    lottieData: lottie1,
  },
  {
    id: 2,
    title: "Bulk Pay-out instantanés",
    description: "Payez fournisseurs, agents et livreurs en masse, en temps réel, vers tout portefeuille Mobile Money africain.",
    lottieData: lottie2,
  },
  {
    id: 3,
    title: "Liens de paiement sans code, API pour développeurs",
    description: "Créez un lien en 10 secondes ou intégrez notre API REST moderne — SDKs, webhooks et documentation claire inclus.",
    lottieData: lottie3,
  },
];

const Content = () => {
  return (
    <section className="py-12 md:py-[60px]">
      <Container className="space-y-8 md:space-y-20">
        <StaggerContainer className="text-center">
          <AnimateOnView blur>
            <h2 className="h2 md:mb-5 mb-3">
              Un système tout-en-un pour encaisser et payer
            </h2>
          </AnimateOnView>
          <AnimateOnView blur delay={0.2}>
            <p className="text-muted-foreground">
              De l'encaissement au décaissement, DolaPay orchestre tous vos flux financiers depuis une seule intégration.
            </p>
          </AnimateOnView>
        </StaggerContainer>
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {streamlineFeatures.slice(0, 2).map((feature, index) => (
              <AnimateOnView key={feature.id} delay={index * 0.1}>
                <div className="border-0 bg-card rounded-[32px] overflow-hidden">
                  <div className="w-full aspect-[519/317] flex items-center justify-center">
                    <Lottie
                      animationData={feature.lottieData}
                      loop={true}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-6 text-center md:text-left">
                    <h3 className="h4 mb-[9px]">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </AnimateOnView>
            ))}
          </div>
          <AnimateOnView delay={0.2}>
            <div className="border-0 bg-card rounded-[32px] overflow-hidden">
              <div className="w-full xl:h-[350px] flex items-center justify-center">
                <Lottie
                  animationData={streamlineFeatures[2].lottieData}
                  loop={true}
                  className="w-full h-full"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="h4 mb-[9px]">{streamlineFeatures[2].title}</h3>
                <p className="text-muted-foreground">{streamlineFeatures[2].description}</p>
              </div>
            </div>
          </AnimateOnView>
        </StaggerContainer>
      </Container>
    </section>
  )
}

export default Content
