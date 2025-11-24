export const CAMEROON_REGIONS = [
  "Adamaoua",
  "Centre",
  "Est",
  "Extrême-Nord",
  "Littoral",
  "Nord",
  "Nord-Ouest",
  "Ouest",
  "Sud",
  "Sud-Ouest"
] as const;

export const CAMEROON_DEPARTMENTS: Record<string, string[]> = {
  "Adamaoua": [
    "Djérem", "Faro-et-Déo", "Mayo-Banyo", "Mbéré", "Vina"
  ],
  "Centre": [
    "Haute-Sanaga", "Lekié", "Mbam-et-Inoubou", "Mbam-et-Kim", "Méfou-et-Afamba",
    "Méfou-et-Akono", "Mfoundi", "Nyong-et-Kéllé", "Nyong-et-Mfoumou", "Nyong-et-So'o"
  ],
  "Est": [
    "Boumba-et-Ngoko", "Haut-Nyong", "Kadey", "Lom-et-Djérem"
  ],
  "Extrême-Nord": [
    "Diamaré", "Logone-et-Chari", "Mayo-Danay", "Mayo-Kani", "Mayo-Sava", "Mayo-Tsanaga"
  ],
  "Littoral": [
    "Moungo", "Nkam", "Sanaga-Maritime", "Wouri"
  ],
  "Nord": [
    "Bénoué", "Faro", "Mayo-Louti", "Mayo-Rey"
  ],
  "Nord-Ouest": [
    "Boyo", "Bui", "Donga-Mantung", "Menchum", "Mezam", "Momo", "Ngo-Ketunjia"
  ],
  "Ouest": [
    "Haut-Nkam", "Hauts-Plateaux", "Koung-Khi", "Menoua", "Mifi", "Ndé", "Noun"
  ],
  "Sud": [
    "Dja-et-Lobo", "Mvila", "Océan", "Vallée-du-Ntem"
  ],
  "Sud-Ouest": [
    "Fako", "Koupé-Manengouba", "Lebialem", "Manyu", "Meme", "Ndian"
  ]
};

export const CAMEROON_ARRONDISSEMENTS: Record<string, string[]> = {
  // This would be a very large object, for now I'll add a few examples
  // In a real implementation, you'd have all arrondissements for each department
  "Mfoundi": ["Yaoundé I", "Yaoundé II", "Yaoundé III", "Yaoundé IV", "Yaoundé V", "Yaoundé VI", "Yaoundé VII"],
  "Wouri": ["Douala I", "Douala II", "Douala III", "Douala IV", "Douala V", "Douala VI"],
  // Add more as needed...
};

// BAC series by type
export const BAC_SERIES_BY_TYPE: Record<string, string[]> = {
  "Général": ["A", "C", "D", "E"],
  "Technique": ["F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "IH", "MISE"]
};

export type Region = typeof CAMEROON_REGIONS[number];
export type Department = string; // Would be more specific in full implementation
export type Arrondissement = string; // Would be more specific in full implementation