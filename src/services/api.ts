const API_BASE_URL = 'https://recherche-entreprises.api.gouv.fr';

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

      return data;
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

      return data;
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
      return company || null;
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

      return data.results?.[0] || null;
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

export type { SearchResponse, CompanyDetails, SearchFilters, NearPointFilters, Company, Etablissement, Complements, Dirigeant, Finances } from '../types/company';