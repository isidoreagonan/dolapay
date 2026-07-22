export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  coverImage: string;
  category: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "histoire-de-dolapay-solution-magique-paiement-afrique",
    title: "L'histoire de DolaPay : Pourquoi j'ai créé la \"solution magique\" pour les paiements en Afrique",
    excerpt: "Comment la frustration de ne pas pouvoir encaisser mes clients multi-pays via Mobile Money et cartes bancaires m'a poussé à bâtir DolaPay.",
    date: "12 Octobre 2026",
    author: {
      name: "Agonan Isidore Abraham",
      role: "CEO & Fondateur",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agonan&backgroundColor=f0f9ff"
    },
    coverImage: "/images/common/africa-network.jpg",
    category: "Company News",
    content: `
Mon nom est **Agonan Isidore Abraham**, et je suis le CEO et fondateur de DolaPay.

Si vous êtes un entrepreneur, un e-commerçant, ou un développeur travaillant sur le continent africain, vous avez sûrement déjà vécu la même frustration que moi.

Il y a quelques années, j'avais un business florissant et je devais recevoir des paiements de clients situés dans plusieurs pays différents. L'équation semblait simple sur le papier : permettre à mes clients de me payer avec ce qu'ils utilisent tous les jours — le **Mobile Money**, ou leur **Carte Bancaire**.

Mais la réalité technique s'est vite révélée être un cauchemar absolu.

### Le problème de la fragmentation

Chaque fois que j'essayais d'intégrer une solution de paiement, je me heurtais à un mur. 
Soit les agrégateurs de paiement que je trouvais **ne couvraient pas les pays dont j'avais besoin**, soit ils se limitaient uniquement au Mobile Money local. Impossible de trouver un partenaire fiable qui me permettait, avec *une seule intégration*, d'accepter à la fois les cartes bancaires internationales (Visa/Mastercard) et les portefeuilles Mobile Money (Orange, MTN, Moov, Wave) dans de multiples pays de la sous-région.

Je perdais des clients. Je perdais du temps à jongler entre des API instables, des webhooks qui ne répondaient jamais, et des tableaux de bord archaïques où la réconciliation comptable prenait des jours.

### La naissance d'une "Solution Magique"

J'en ai eu assez d'attendre qu'une entreprise étrangère vienne résoudre notre problème de manière bancale. J'ai donc décidé de créer moi-même cette **"solution magique"**. 

Je voulais une infrastructure de paiement qui soit :
1. **Unifiée** : Un seul contrat, une seule API, pour le Mobile Money et les cartes bancaires.
2. **Panafricaine** : Pouvoir encaisser au Bénin, au Sénégal, en Côte d'Ivoire, ou en RDC sans devoir ouvrir une nouvelle entité locale.
3. **Pensée pour les Développeurs** : Des webhooks rapides, une documentation claire (comme Stripe le fait si bien), et des environnements de test robustes.

C'est ainsi qu'est né **DolaPay**.

Aujourd'hui, DolaPay n'est plus juste mon rêve. C'est l'infrastructure de paiement qui propulse des milliers de startups, de freelances et de plateformes e-commerce à travers 12 économies africaines. Nous avons rendu invisible la complexité de l'interopérabilité financière. 

**Que vous vendiez pour 10 000 FCFA ou 10 millions de FCFA par mois, DolaPay est conçu pour vous accompagner sans friction.**

C'est notre première étape. Et ce n'est que le début de l'histoire.

Bienvenue sur DolaPay.
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
