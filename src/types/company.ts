export interface Company {
  siren: string;
  nom_complet: string;
  nom_raison_sociale: string;
  sigle?: string;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  siege: Etablissement;
  matching_etablissements?: Etablissement[];
  complements?: Complements;
  dirigeants?: Dirigeant[];
  finances?: Finances;
  section?: string;
  date_creation?: string;
  date_fermeture?: string;
  date_mise_a_jour?: string;
  statut_diffusion?: string;
  categorie_entreprise?: string;
  annee_categorie_entreprise?: string;
  etat_administratif?: string;
  nature_juridique?: string;
  activite_principale?: string;
  section_activite_principale?: string;
  tranche_effectif_salarie?: string;
  annee_tranche_effectif_salarie?: string;
  caractere_employeur?: string;
}

export interface Etablissement {
  siret: string;
  nic?: string;
  siret_siege_social?: string;
  nom_commercial?: string;
  enseigne?: string;
  activite_principale: string;
  libelle_activite_principale: string;
  activite_principale_registre_metier?: string;
  libelle_activite_principale_registre_metier?: string;
  adresse: string;
  complement_adresse?: string;
  numero_voie?: string;
  indice_repetition_voie?: string;
  type_voie?: string;
  libelle_voie?: string;
  code_postal: string;
  libelle_commune: string;
  libelle_commune_etranger?: string;
  distribution_speciale?: string;
  commune?: string;
  code_commune?: string;
  code_cedex?: string;
  libelle_cedex?: string;
  code_pays_etranger?: string;
  libelle_pays_etranger?: string;
  departement: string;
  region: string;
  epci?: string;
  date_creation: string;
  date_debut_activite?: string;
  date_fin?: string;
  date_fermeture?: string;
  date_mise_a_jour?: string;
  etat_administratif: string;
  enseigne_1?: string;
  enseigne_2?: string;
  enseigne_3?: string;
  denomination_usuelle_1?: string;
  denomination_usuelle_2?: string;
  denomination_usuelle_3?: string;
  nature_juridique?: string;
  libelle_nature_juridique?: string;
  tranche_effectif_salarie?: string;
  libelle_tranche_effectif?: string;
  annee_effectif?: number;
  annee_tranche_effectif_salarie?: string;
  numero_tva_intracommunautaire?: string;
  geo_adresse?: string;
  geo_id?: string;
  latitude?: string;
  longitude?: string;
  geo_l4?: string;
  geo_l5?: string;
  is_siege?: boolean;
  est_siege?: boolean;
  ancien_siege?: boolean;
  nom_complet?: string;
  liste_enseignes?: string[];
  liste_finess?: string[];
  liste_rge?: string[];
  liste_uai?: string[];
  liste_idcc?: string[];
  liste_id_bio?: string[];
  liste_id_organisme_formation?: string[];
  statut_diffusion?: string;
  statut_diffusion_etablissement?: string;
  caractere_employeur?: string;
  cedex?: string;
  indice_repetition?: string;
}

export interface Complements {
  convention_collective_renseignee?: boolean;
  est_bio?: boolean;
  est_entrepreneur_individuel?: boolean;
  est_ess?: boolean;
  est_finess?: boolean;
  est_rge?: boolean;
  est_siae?: boolean;
  est_qualiopi?: boolean;
  est_uai?: boolean;
  est_association?: boolean;
  est_entrepreneur_spectacle?: boolean;
  est_organisme_formation?: boolean;
  est_patrimoine_vivant?: boolean;
  est_achats_responsables?: boolean;
  est_alim_confiance?: boolean;
  est_collectivite_territoriale?: boolean;
  est_service_public?: boolean;
  est_l100_3?: boolean;
  est_societe_mission?: boolean;
  liste_idcc?: string[];
  liste_finess?: string[];
  liste_rge?: string[];
  liste_uai?: string[];
  liste_id_organisme_formation?: string[];
  identifiant_association?: string;
  identifiant_uai?: string;
  type_siae?: string;
  statut_bio?: boolean;
  statut_entrepreneur_spectacle?: string;
  bilan_ges_renseigne?: boolean;
  collectivite_territoriale?: {
    code?: string;
    code_insee?: string;
    niveau?: string;
    elus?: Array<{
      nom: string;
      prenoms: string;
      fonction: string;
      annee_de_naissance?: string;
      sexe?: string;
      date_election?: string;
    }>;
  };
  egapro_renseignee?: boolean;
  egapro?: {
    annee_indicateur?: number;
    note?: number;
    note_sur?: number;
    structure?: string;
  };
  spectacle_vivant?: {
    licence_entrepreneur?: string[];
    licence_producteur?: string[];
  };
}

export interface Dirigeant {
  nom?: string;
  prenoms?: string;
  prenom?: string;
  nom_usage?: string;
  annee_de_naissance?: string;
  date_de_naissance?: string;
  mois_naissance?: number;
  lieu_naissance?: string;
  nationalite?: string;
  role?: string;
  role_description?: string;
  qualite?: string;
  date_prise_poste?: string;
  date_fin_mandat?: string;
  raison_sociale?: string;
  siren?: string;
  denomination?: string;
  identifiant?: string;
  type_dirigeant?: string;
}

export interface Finances {
  [year: string]: {
    ca?: number;
    resultat_net?: number;
    effectif?: number;
    date_cloture_exercice?: string;
    duree_exercice?: number;
  };
}

export interface SearchResponse {
  results: Company[];
  total_results: number;
  page: number;
  per_page: number;
  total_pages: number;
  erreur?: boolean;
  message?: string;
}

export interface SearchFilters {
  activite_principale?: string;
  section_activite_principale?: string;
  code_postal?: string;
  code_commune?: string;
  departement?: string;
  region?: string;
  epci?: string;
  nature_juridique?: string;
  tranche_effectif_salarie?: string;
  etat_administratif?: string;
  categorie_entreprise?: string;
  code_collectivite_territoriale?: string;
  
  // Certifications et labels
  est_ess?: boolean;
  est_bio?: boolean;
  est_rge?: boolean;
  est_siae?: boolean;
  est_qualiopi?: boolean;
  est_association?: boolean;
  est_entrepreneur_individuel?: boolean;
  est_entrepreneur_spectacle?: boolean;
  est_organisme_formation?: boolean;
  est_patrimoine_vivant?: boolean;
  est_achats_responsables?: boolean;
  est_alim_confiance?: boolean;
  est_collectivite_territoriale?: boolean;
  est_service_public?: boolean;
  est_l100_3?: boolean;
  est_societe_mission?: boolean;
  est_finess?: boolean;
  est_uai?: boolean;
  
  // Autres filtres
  convention_collective_renseignee?: boolean;
  egapro_renseignee?: boolean;
  bilan_ges_renseigne?: boolean;
  
  // Identifiants spécifiques
  id_convention_collective?: string;
  id_finess?: string;
  id_rge?: string;
  id_uai?: string;
  
  // Recherche par personne
  nom_personne?: string;
  prenoms_personne?: string;
  date_naissance_personne_min?: string;
  date_naissance_personne_max?: string;
  type_personne?: 'dirigeant' | 'elu';
  
  // Finances
  ca_min?: number;
  ca_max?: number;
  resultat_net_min?: number;
  resultat_net_max?: number;
  
  // Options de réponse
  limite_matching_etablissements?: number;
  minimal?: boolean;
  include?: string;
}

export interface NearPointFilters {
  lat: number;
  long: number;
  radius?: number;
  activite_principale?: string;
  section_activite_principale?: string;
  limite_matching_etablissements?: number;
  minimal?: boolean;
  include?: string;
}

export type CompanyDetails = Company;