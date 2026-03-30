export interface ThemeEntry {
  subject: string;
  theme: string;
}

export const THEMES: ThemeEntry[] = [
  // Histoire
  { subject: "Histoire", theme: "Chrétientés et islam (VIe-XIIIe siècles), des mondes en contact" },
  { subject: "Histoire", theme: "Société, Église et pouvoir politique dans l'occident féodal (XIe-XVe siècles)" },
  { subject: "Histoire", theme: "Transformations de l'Europe et ouverture sur le monde aux XVIe et XVIIe siècles" },
  // Géographie
  { subject: "Géographie", theme: "La question démographique et l'inégal développement" },
  { subject: "Géographie", theme: "Des ressources limitées, à gérer et à renouveler" },
  { subject: "Géographie", theme: "L'environnement, du local au planétaire" },

  // Français
  { subject: "Français", theme: "Le voyage et l'aventure : pourquoi aller vers l'inconnu ?" },
  { subject: "Français", theme: "Avec autrui : familles, amis, réseaux" },
  { subject: "Français", theme: "Imaginer des univers nouveaux" },
  { subject: "Français", theme: "Héros / héroïnes et héroïsmes" },
  { subject: "Français", theme: "L'être humain est-il maître de la nature ?" },

  // Mathématiques
  { subject: "Mathématiques", theme: "Nombres et calculs" },
  { subject: "Mathématiques", theme: "Organisation et gestion de données, fonctions" },
  { subject: "Mathématiques", theme: "Grandeurs et mesures" },
  { subject: "Mathématiques", theme: "Espace et géométrie" },
  { subject: "Mathématiques", theme: "Algorithmique et programmation" },

  // Physique-Chimie
  { subject: "Physique-Chimie", theme: "Organisation et transformations de la matière" },
  { subject: "Physique-Chimie", theme: "Mouvements et interactions" },
  { subject: "Physique-Chimie", theme: "L'énergie, ses transferts et ses conversions" },
  { subject: "Physique-Chimie", theme: "Des signaux pour observer et communiquer" },

  // Sciences de la Vie et de la Terre
  { subject: "Sciences de la Vie et de la Terre", theme: "La planète Terre, l'environnement et l'action humaine" },
  { subject: "Sciences de la Vie et de la Terre", theme: "Le vivant et son évolution" },
  { subject: "Sciences de la Vie et de la Terre", theme: "Le corps humain et la santé" },

  // Technologie
  { subject: "Technologie", theme: "Design, innovation et créativité" },
  { subject: "Technologie", theme: "Les objets techniques, les services et les changements induits dans la société" },
  { subject: "Technologie", theme: "La modélisation et la simulation des objets et systèmes techniques" },
  { subject: "Technologie", theme: "L'informatique et la programmation" },

  // Anglais
  { subject: "Anglais", theme: "Langages" },
  { subject: "Anglais", theme: "École et société" },
  { subject: "Anglais", theme: "Voyages et migrations" },
  { subject: "Anglais", theme: "Rencontres avec d'autres cultures" },

  // Arts Plastiques
  { subject: "Arts Plastiques", theme: "La représentation : images, réalité et fiction" },
  { subject: "Arts Plastiques", theme: "La matérialité de l'oeuvre : l'objet et l'oeuvre" },
  { subject: "Arts Plastiques", theme: "L'oeuvre, l'espace, l'auteur, le spectateur" },

  // Musique
  { subject: "Musique", theme: "Le timbre et l'espace" },
  { subject: "Musique", theme: "La dynamique" },
  { subject: "Musique", theme: "Le temps et le rythme" },
  { subject: "Musique", theme: "La forme" },
  { subject: "Musique", theme: "Le successif et le simultané" },
  { subject: "Musique", theme: "Les styles" },

  // EMC (pas dans SUBJECT_EMOJI mais pertinent pour 5e)
  { subject: "EMC", theme: "Agir pour l'égalité femmes-hommes et lutter contre les discriminations" },
  { subject: "EMC", theme: "La solidarité et ses échelles" },

  // Espagnol
  { subject: "Espagnol", theme: "Langages" },
  { subject: "Espagnol", theme: "École et société" },
  { subject: "Espagnol", theme: "Voyages et migrations" },
  { subject: "Espagnol", theme: "Rencontres avec d'autres cultures" },
];
