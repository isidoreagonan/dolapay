
import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";

const teamMembers = [
    { name: "Albert Flores", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" },
    { name: "Wade Warren", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" },
    { name: "Annette Black", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
    { name: "Annette Black", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
    { name: "Esther Howard", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
    { name: "Jane Cooper", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" },
    { name: "Robert Fox", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=100" },
    { name: "Robert Fox", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
    { name: "Devon Lane", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=100" },
    { name: "Kristin Watson", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
    { name: "Ralph Edwards", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
    { name: "Ralph Edwards", title: "Chief Executive Officer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" },
];

const TeamGrid = () => {
    return (
        <section className="md:py-[60px] py-12">
            <Container className="md:space-y-20 space-y-8">
                <StaggerContainer className="text-center md:max-w-[630px] max-w-xs mx-auto">
                    <AnimateOnView blur>
                        <h2 className="h2 md:mb-5 mb-3">
                            La confiance des équipes en forte croissance
                        </h2>
                    </AnimateOnView>

                    <AnimateOnView blur delay={0.1}>
                        <p className="text-muted-foreground">
                            Notre mission : donner à chaque marchand et startup africaine l'infrastructure de paiement qu'ils méritent, avec transparence et fiabilité.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4">
                    {teamMembers.map((member, index) => (
                        <AnimateOnView
                            key={index}
                            className="p-4 rounded-2xl bg-card border border-border flex flex-col md:flex-row text-center md:text-left items-center gap-4 transition-all duration-300 hover:bg-white/5"
                        >
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-12 h-12 rounded-[10px] object-cover"
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="text-white font-medium truncate">{member.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{member.title}</span>
                            </div>
                        </AnimateOnView>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default TeamGrid;
