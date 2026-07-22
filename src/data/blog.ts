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
      avatarUrl: "/images/team/ceo.jpg"
    },
    coverImage: "/images/blog/cover_origin.png",
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
  },
  {
    id: "2",
    slug: "bulk-payout-comment-payer-10000-personnes",
    title: "Bulk Pay-out : Comment envoyer de l'argent vers 10 000 portefeuilles en un clic",
    excerpt: "Découvrez comment notre infrastructure de Bulk Pay-out révolutionne la paie des livreurs, des agriculteurs et des freelances en Afrique.",
    date: "15 Octobre 2026",
    author: {
      name: "Agonan Isidore Abraham",
      role: "CEO & Fondateur",
      avatarUrl: "/images/team/ceo.jpg"
    },
    coverImage: "/images/blog/cover_payout.png",
    category: "Product Updates",
    content: `
L'une des demandes les plus fréquentes que nous recevons chez DolaPay concerne les **décaissements de masse** (Bulk Pay-outs).

Imaginez que vous êtes une startup de livraison avec 500 coursiers répartis entre Abidjan, Dakar et Cotonou. Chaque vendredi, vous devez payer leurs commissions. Avant DolaPay, cela signifiait des fichiers Excel remplis d'erreurs, des heures passées sur les portails opérateurs, et des transferts manuels un par un.

### La puissance de l'API DolaPay

Avec la nouvelle mise à jour de notre API de décaissement, vous pouvez désormais déclencher jusqu'à **10 000 virements simultanés** avec un seul appel API.

Comment ça marche ?
1. **Vous chargez votre balance DolaPay** via virement bancaire ou Mobile Money.
2. **Vous envoyez une requête JSON** contenant les numéros de téléphone et les montants.
3. **Notre moteur de routage s'occupe du reste.** Il détecte automatiquement l'opérateur (Orange, MTN, Wave...) et exécute la transaction instantanément.

### Un tableau de bord pour les équipes financières

Pour les équipes non techniques, nous avons également lancé l'outil **Bulk CSV**. Vous pouvez uploader un simple fichier Excel sur votre dashboard DolaPay, valider l'opération avec un code OTP, et regarder les fonds être distribués en temps réel.

Nous traitons aujourd'hui plus de 20 000 décaissements par jour pour nos partenaires, avec un taux de succès de **99,99%**.

**Prêt à automatiser votre paie ?** Découvrez notre documentation sur les Payouts.
    `
  },
  {
    id: "3",
    slug: "securite-conformite-normes-bancaires-dolapay",
    title: "Conformité & Sécurité : Les normes derrière l'infrastructure DolaPay",
    excerpt: "Comment nous protégeons vos données et vos fonds avec une sécurité de niveau bancaire (PCI-DSS, 3DS, chiffrement de bout en bout).",
    date: "20 Octobre 2026",
    author: {
      name: "Agonan Isidore Abraham",
      role: "CEO & Fondateur",
      avatarUrl: "/images/team/ceo.jpg"
    },
    coverImage: "/images/blog/cover_security.png",
    category: "Industry Insights",
    content: `
Quand on manipule l'argent des autres, la confiance n'est pas une option. C'est le cœur même du produit.

Chez DolaPay, nous avons passé la dernière année à bâtir non seulement une API rapide, mais surtout **l'une des infrastructures les plus sécurisées du continent africain**. 

Voici comment nous protégeons vos opérations quotidiennes.

### 1. Sécurité de niveau bancaire (PCI-DSS)

Tous les paiements par carte bancaire (Visa / Mastercard) traités via DolaPay sont conformes à la norme **PCI-DSS Level 1**. 
Concrètement, cela signifie que vos données de cartes ne touchent jamais nos serveurs d'application de manière non cryptée. Nous utilisons des coffres-forts tokenisés, assurant que même en cas de brèche (ce qui n'est jamais arrivé), les données sont inutilisables.

### 2. Authentification Forte (3D Secure)

Pour lutter contre la fraude sur les cartes internationales, nous imposons le **3D Secure (3DS)** sur toutes les transactions. Les paiements frauduleux ou les tentatives de chargeback sont drastiquement réduites. Vous encaissez l'esprit tranquille.

### 3. Redondance Multi-Région

Notre infrastructure cloud est déployée sur **plusieurs régions**. Si un data center tombe en panne, le trafic bascule automatiquement sur un autre en moins de 5 secondes. C'est ce qui nous permet de vous garantir un **uptime de 99,99%**.

### 4. Conformité Réglementaire

Nous travaillons en étroite collaboration avec les régulateurs locaux (BCEAO, CEMAC) et les banques partenaires pour garantir le strict respect des lois sur la lutte contre le blanchiment d'argent (AML) et le financement du terrorisme (CFT). Le KYC de nos marchands est automatisé mais rigoureux.

DolaPay n'est pas qu'une API élégante. C'est un **coffre-fort technologique** conçu pour scaler avec votre entreprise.
    `
  },
  {
    id: "4",
    slug: "freelances-createurs-paiements-sans-friction-afrique",
    title: "L'essor des paiements sans friction pour les freelances africains",
    excerpt: "Comment les liens de paiement no-code changent la vie des créatifs et indépendants sur le continent.",
    date: "25 Octobre 2026",
    author: {
      name: "Agonan Isidore Abraham",
      role: "CEO & Fondateur",
      avatarUrl: "/images/team/ceo.jpg"
    },
    coverImage: "/images/blog/cover_freelance.png",
    category: "Case Studies",
    content: `
L'économie des créateurs et des freelances explose en Afrique. Designers, développeurs, copywriters, community managers... De plus en plus de talents africains travaillent à leur propre compte, souvent pour des clients situés dans d'autres pays.

Mais il y a un problème récurrent : **Comment se faire payer rapidement et sans frais exorbitants ?**

### La fin des virements bancaires internationaux lents

Auparavant, un freelance sénégalais travaillant pour une entreprise ivoirienne devait attendre un virement bancaire qui prenait 3 jours ouvrés, avec des frais fixes importants. 
D'autres utilisaient des solutions informelles ou des envois d'argent liquide compliqués à tracer pour la comptabilité.

### Entrez : Le Lien de Paiement DolaPay

Avec DolaPay, n'importe quel freelance peut générer un **Lien de Paiement** en 10 secondes depuis son téléphone.

1. Vous entrez le montant de votre facture (ex: 150 000 FCFA).
2. Vous copiez le lien généré.
3. Vous l'envoyez à votre client sur WhatsApp, par email, ou dans une facture PDF.
4. Le client clique et choisit son moyen de paiement préféré (Carte Bancaire s'il est en Europe, ou Mobile Money local s'il est en Afrique).

**L'argent arrive instantanément sur votre solde DolaPay**, prêt à être retiré vers votre propre compte bancaire ou compte Mobile Money personnel.

Plus besoin de compétences en code, plus besoin de créer un site e-commerce complexe. Le commerce digital devient aussi simple qu'un message texte. C'est la promesse de DolaPay pour la nouvelle génération d'entrepreneurs africains.
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
