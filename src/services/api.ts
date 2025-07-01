const API_BASE_URL = 'https://recherche-entreprises.api.gouv.fr';

// Service pour enrichir les données avec les informations RCS et documents
class CompanyEnrichmentService {
  // Simulation d'enrichissement des données RCS
  // En production, vous devriez utiliser une API comme Pappers, Infogreffe, ou l'API INPI
  static async enrichCompanyData(company: Company): Promise<Company> {
    try {
      // Simulation des données RCS basées sur le SIREN
      const rcsData = this.generateRCSData(company);
      const documents = this.generateDocuments(company);
      
      return {
        ...company,
        rcs: rcsData,
        documents: documents
      };
    } catch (error) {
      console.warn('Impossible d\'enrichir les données RCS:', error);
      return company;
    }
  }

  private static generateRCSData(company: Company) {
    // Simulation des données RCS
    const greffes = [
      { code: '7501', nom: 'Paris', ville: 'Paris' },
      { code: '6901', nom: 'Lyon', ville: 'Lyon' },
      { code: '1301', nom: 'Marseille', ville: 'Marseille' },
      { code: '3101', nom: 'Toulouse', ville: 'Toulouse' },
      { code: '5901', nom: 'Lille', ville: 'Lille' },
      { code: '3301', nom: 'Bordeaux', ville: 'Bordeaux' },
      { code: '4401', nom: 'Nantes', ville: 'Nantes' },
      { code: '6701', nom: 'Strasbourg', ville: 'Strasbourg' }
    ];

    const departement = company.siege?.departement || '75';
    const greffeIndex = parseInt(departement) % greffes.length;
    const greffe = greffes[greffeIndex];

    return {
      numero_rcs: `${company.siren} RCS ${greffe.ville}`,
      lieu_immatriculation: greffe.ville,
      greffe: `Greffe du Tribunal de Commerce de ${greffe.ville}`,
      code_greffe: greffe.code,
      date_immatriculation: company.siege?.date_creation || company.date_creation,
      capital_social: this.generateCapitalSocial(company),
      devise_capital: 'EUR',
      forme_juridique: company.siege?.libelle_nature_juridique || 'Société par actions simplifiée',
      forme_juridique_code: company.nature_juridique || '5710',
      duree_personne_morale: '99 ans',
      date_cloture_exercice: '31/12',
      objet_social: this.generateObjetSocial(company)
    };
  }

  private static generateCapitalSocial(company: Company): number {
    // Simulation du capital social basé sur la taille de l'entreprise
    const effectif = company.siege?.tranche_effectif_salarie || '00';
    
    switch (effectif) {
      case '00': return Math.floor(Math.random() * 50000) + 1000; // 1K-50K
      case '01': case '02': return Math.floor(Math.random() * 100000) + 10000; // 10K-100K
      case '03': case '11': return Math.floor(Math.random() * 500000) + 50000; // 50K-500K
      case '12': case '21': return Math.floor(Math.random() * 2000000) + 100000; // 100K-2M
      case '22': case '31': return Math.floor(Math.random() * 10000000) + 500000; // 500K-10M
      default: return Math.floor(Math.random() * 50000000) + 1000000; // 1M-50M
    }
  }

  private static generateObjetSocial(company: Company): string {
    const activite = company.siege?.libelle_activite_principale || '';
    
    if (activite.toLowerCase().includes('informatique') || activite.toLowerCase().includes('logiciel')) {
      return 'Développement, édition et commercialisation de logiciels informatiques, conseil en systèmes et logiciels informatiques, formation informatique.';
    } else if (activite.toLowerCase().includes('commerce')) {
      return 'Commerce de gros et de détail, import-export, représentation commerciale, courtage.';
    } else if (activite.toLowerCase().includes('conseil')) {
      return 'Conseil en organisation et gestion d\'entreprise, études et recherches, formation professionnelle.';
    } else if (activite.toLowerCase().includes('construction') || activite.toLowerCase().includes('bâtiment')) {
      return 'Travaux de construction, rénovation, aménagement, maîtrise d\'œuvre, études techniques.';
    } else {
      return `Activités liées à ${activite.toLowerCase()}, et toutes opérations commerciales, industrielles, financières, mobilières et immobilières s\'y rapportant.`;
    }
  }

  private static generateDocuments(company: Company): CompanyDocument[] {
    const documents: CompanyDocument[] = [];
    const currentYear = new Date().getFullYear();
    
    // Statuts
    documents.push({
      id: `statuts-${company.siren}`,
      type: 'statuts',
      libelle: 'Statuts constitutifs',
      date_depot: company.siege?.date_creation || company.date_creation,
      disponible: true,
      format: 'PDF',
      pages: Math.floor(Math.random() * 20) + 10,
      taille: Math.floor(Math.random() * 500000) + 100000
    });

    // Comptes annuels des 3 dernières années
    for (let year = currentYear - 1; year >= currentYear - 3; year--) {
      documents.push({
        id: `comptes-${company.siren}-${year}`,
        type: 'comptes_annuels',
        libelle: `Comptes annuels ${year}`,
        date_depot: `${year + 1}-06-30`,
        date_cloture_exercice: `${year}-12-31`,
        disponible: Math.random() > 0.3, // 70% de chance d'être disponible
        format: 'PDF',
        pages: Math.floor(Math.random() * 30) + 15,
        taille: Math.floor(Math.random() * 1000000) + 200000
      });
    }

    // Rapports de gestion
    for (let year = currentYear - 1; year >= currentYear - 2; year--) {
      if (Math.random() > 0.5) { // 50% de chance d'avoir un rapport
        documents.push({
          id: `rapport-${company.siren}-${year}`,
          type: 'rapport_gestion',
          libelle: `Rapport de gestion ${year}`,
          date_depot: `${year + 1}-06-30`,
          date_cloture_exercice: `${year}-12-31`,
          disponible: true,
          format: 'PDF',
          pages: Math.floor(Math.random() * 50) + 20,
          taille: Math.floor(Math.random() * 800000) + 150000
        });
      }
    }

    // Modifications statutaires récentes
    if (Math.random() > 0.6) { // 40% de chance d'avoir des modifications
      documents.push({
        id: `modification-${company.siren}`,
        type: 'modification_statutaire',
        libelle: 'Modification des statuts',
        date_depot: `${currentYear - 1}-03-15`,
        disponible: true,
        format: 'PDF',
        pages: Math.floor(Math.random() * 10) + 5,
        taille: Math.floor(Math.random() * 200000) + 50000
      });
    }

    return documents.sort((a, b) => 
      new Date(b.date_depot || '').getTime() - new Date(a.date_depot || '').getTime()
    );
  }

  static getDocumentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'statuts': 'Statuts',
      'comptes_annuels': 'Comptes annuels',
      'rapport_gestion': 'Rapport de gestion',
      'modification_statutaire': 'Modification statutaire',
      'proces_verbal': 'Procès-verbal',
      'bilan': 'Bilan',
      'compte_resultat': 'Compte de résultat',
      'annexe': 'Annexe'
    };
    return labels[type] || type;
  }

  static getDocumentIcon(type: string): string {
    switch (type) {
      case 'statuts': return '📋';
      case 'comptes_annuels': return '📊';
      case 'rapport_gestion': return '📈';
      case 'modification_statutaire': return '📝';
      case 'proces_verbal': return '📄';
      default: return '📄';
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Simulation du téléchargement de document
  static async downloadDocument(document: CompanyDocument): Promise<void> {
    try {
      // En production, vous feriez un appel à l'API pour obtenir l'URL de téléchargement
      const blob = new Blob(['Document simulé'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${document.libelle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw new Error('Impossible de télécharger le document');
    }
  }
}

export class CompanySearchService {
  static async searchCompanies(
    query: string,
    page: number = 1,
    perPage: number = 10,
    filters?: SearchFilters
  ): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams({
        q: query.trim(),
        page: page.toString(),
        per_page: Math.min(perPage, 25).toString()
      });

      // Ajout des filtres si fournis
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'boolean') {
              params.append(key, value.toString());
            } else if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/search?${params}`);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Paramètres de recherche invalides. Vérifiez votre requête.');
        } else if (response.status === 429) {
          throw new Error('Trop de requêtes. Veuillez patienter avant de relancer la recherche.');
        } else if (response.status >= 500) {
          throw new Error('Erreur du serveur. Veuillez réessayer plus tard.');
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.erreur) {
        throw new Error(data.message || 'Erreur lors de la recherche');
      }

      // Enrichir les données avec les informations RCS
      const enrichedResults = await Promise.all(
        data.results.map((company: Company) => 
          CompanyEnrichmentService.enrichCompanyData(company)
        )
      );

      return {
        ...data,
        results: enrichedResults
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Impossible de récupérer les données. Vérifiez votre connexion.');
    }
  }

  static async searchNearPoint(
    filters: NearPointFilters,
    page: number = 1,
    perPage: number = 10
  ): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams({
        lat: filters.lat.toString(),
        long: filters.long.toString(),
        radius: (filters.radius || 5).toString(),
        page: page.toString(),
        per_page: Math.min(perPage, 25).toString()
      });

      // Ajout des autres filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (key !== 'lat' && key !== 'long' && key !== 'radius' && 
            value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/near_point?${params}`);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Paramètres de géolocalisation invalides.');
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.erreur) {
        throw new Error(data.message || 'Erreur lors de la recherche géographique');
      }

      // Enrichir les données avec les informations RCS
      const enrichedResults = await Promise.all(
        data.results.map((company: Company) => 
          CompanyEnrichmentService.enrichCompanyData(company)
        )
      );

      return {
        ...data,
        results: enrichedResults
      };
    } catch (error) {
      console.error('Erreur lors de la recherche géographique:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Impossible de récupérer les données géographiques.');
    }
  }

  static async getCompanyBySiren(siren: string): Promise<Company | null> {
    try {
      const cleanSiren = siren.replace(/\s/g, '');
      const response = await fetch(`${API_BASE_URL}/search?q=${cleanSiren}&per_page=1`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.erreur) {
        throw new Error(data.message || 'Erreur lors de la recherche');
      }

      // Vérifier que le SIREN correspond exactement
      const company = data.results?.find((c: Company) => c.siren === cleanSiren);
      
      if (company) {
        return await CompanyEnrichmentService.enrichCompanyData(company);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la recherche SIREN:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Impossible de récupérer les données de l\'entreprise.');
    }
  }

  static async getCompanyBySiret(siret: string): Promise<Company | null> {
    try {
      const cleanSiret = siret.replace(/\s/g, '');
      const response = await fetch(`${API_BASE_URL}/search?q=${cleanSiret}&per_page=1`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.erreur) {
        throw new Error(data.message || 'Erreur lors de la recherche');
      }

      const company = data.results?.[0];
      
      if (company) {
        return await CompanyEnrichmentService.enrichCompanyData(company);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la recherche SIRET:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Impossible de récupérer les données de l\'établissement.');
    }
  }

  // Méthodes utilitaires
  static formatSiren(siren: string): string {
    const clean = siren.replace(/\s/g, '');
    return clean.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  static formatSiret(siret: string): string {
    const clean = siret.replace(/\s/g, '');
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  }

  static isSiren(query: string): boolean {
    const cleanQuery = query.replace(/\s/g, '');
    return /^\d{9}$/.test(cleanQuery);
  }

  static isSiret(query: string): boolean {
    const cleanQuery = query.replace(/\s/g, '');
    return /^\d{14}$/.test(cleanQuery);
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  static getStatusLabel(etatAdministratif: string): string {
    switch (etatAdministratif) {
      case 'A': return 'Active';
      case 'C': return 'Cessée';
      case 'F': return 'Fermée';
      default: return 'Inconnu';
    }
  }

  static getStatusColor(etatAdministratif: string): string {
    switch (etatAdministratif) {
      case 'A': return 'text-emerald-600';
      case 'C': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  static getStatusBgColor(etatAdministratif: string): string {
    switch (etatAdministratif) {
      case 'A': return 'bg-emerald-100 text-emerald-800';
      case 'C': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  static getCertificationLabel(key: string): string {
    const labels: Record<string, string> = {
      est_bio: 'Agriculture Biologique',
      est_ess: 'Économie Sociale et Solidaire',
      est_rge: 'Reconnu Garant de l\'Environnement',
      est_siae: 'Structure d\'Insertion par l\'Activité Économique',
      est_qualiopi: 'Certification Qualiopi',
      est_entrepreneur_individuel: 'Entrepreneur Individuel',
      est_finess: 'Établissement de Santé (FINESS)',
      est_uai: 'Unité Administrative Immatriculée',
      est_association: 'Association',
      est_entrepreneur_spectacle: 'Entrepreneur du Spectacle',
      est_organisme_formation: 'Organisme de Formation',
      est_patrimoine_vivant: 'Entreprise du Patrimoine Vivant',
      est_achats_responsables: 'Relations Fournisseurs et Achats Responsables',
      est_alim_confiance: 'Alim\'Confiance',
      est_collectivite_territoriale: 'Collectivité Territoriale',
      est_service_public: 'Service Public',
      est_l100_3: 'Administration L.100-3',
      est_societe_mission: 'Société à Mission'
    };
    return labels[key] || key;
  }

  static getCertificationColor(key: string): string {
    const colors: Record<string, string> = {
      est_bio: 'bg-green-100 text-green-800',
      est_ess: 'bg-purple-100 text-purple-800',
      est_rge: 'bg-blue-100 text-blue-800',
      est_siae: 'bg-orange-100 text-orange-800',
      est_qualiopi: 'bg-cyan-100 text-cyan-800',
      est_entrepreneur_individuel: 'bg-indigo-100 text-indigo-800',
      est_finess: 'bg-pink-100 text-pink-800',
      est_uai: 'bg-yellow-100 text-yellow-800',
      est_association: 'bg-violet-100 text-violet-800',
      est_entrepreneur_spectacle: 'bg-rose-100 text-rose-800',
      est_organisme_formation: 'bg-teal-100 text-teal-800',
      est_patrimoine_vivant: 'bg-amber-100 text-amber-800',
      est_achats_responsables: 'bg-lime-100 text-lime-800',
      est_alim_confiance: 'bg-emerald-100 text-emerald-800',
      est_collectivite_territoriale: 'bg-slate-100 text-slate-800',
      est_service_public: 'bg-stone-100 text-stone-800',
      est_l100_3: 'bg-zinc-100 text-zinc-800',
      est_societe_mission: 'bg-sky-100 text-sky-800'
    };
    return colors[key] || 'bg-gray-100 text-gray-800';
  }

  static getTrancheEffectifLabel(code: string): string {
    const tranches: Record<string, string> = {
      'NN': 'Non renseigné',
      '00': '0 salarié',
      '01': '1 ou 2 salariés',
      '02': '3 à 5 salariés',
      '03': '6 à 9 salariés',
      '11': '10 à 19 salariés',
      '12': '20 à 49 salariés',
      '21': '50 à 99 salariés',
      '22': '100 à 199 salariés',
      '31': '200 à 249 salariés',
      '32': '250 à 499 salariés',
      '41': '500 à 999 salariés',
      '42': '1000 à 1999 salariés',
      '51': '2000 à 4999 salariés',
      '52': '5000 à 9999 salariés',
      '53': '10000 salariés et plus'
    };
    return tranches[code] || code;
  }

  static getSectionActiviteLabel(code: string): string {
    const sections: Record<string, string> = {
      'A': 'Agriculture, sylviculture et pêche',
      'B': 'Industries extractives',
      'C': 'Industrie manufacturière',
      'D': 'Production et distribution d\'électricité, de gaz, de vapeur et d\'air conditionné',
      'E': 'Production et distribution d\'eau ; assainissement, gestion des déchets et dépollution',
      'F': 'Construction',
      'G': 'Commerce ; réparation d\'automobiles et de motocycles',
      'H': 'Transports et entreposage',
      'I': 'Hébergement et restauration',
      'J': 'Information et communication',
      'K': 'Activités financières et d\'assurance',
      'L': 'Activités immobilières',
      'M': 'Activités spécialisées, scientifiques et techniques',
      'N': 'Activités de services administratifs et de soutien',
      'O': 'Administration publique',
      'P': 'Enseignement',
      'Q': 'Santé humaine et action sociale',
      'R': 'Arts, spectacles et activités récréatives',
      'S': 'Autres activités de services',
      'T': 'Activités des ménages en tant qu\'employeurs',
      'U': 'Activités extra-territoriales'
    };
    return sections[code] || code;
  }
}

export { CompanyEnrichmentService };
export type { SearchResponse, CompanyDetails, SearchFilters, NearPointFilters, Company, Etablissement, Complements, Dirigeant, Finances, CompanyDocument } from '../types/company';
