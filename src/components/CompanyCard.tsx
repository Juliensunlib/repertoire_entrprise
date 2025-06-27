import React from 'react';
import { Building2, MapPin, Calendar, Users, Activity, CheckCircle, XCircle, Eye, ChevronRight, Euro, TrendingUp } from 'lucide-react';
import { Company } from '../types/company';
import { CompanySearchService } from '../services/api';

interface CompanyCardProps {
  company: Company;
  onViewDetails: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    return status === 'A' ? 
      <CheckCircle className="w-4 h-4 text-emerald-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getLatestFinances = () => {
    if (!company.finances) return null;
    const years = Object.keys(company.finances).sort().reverse();
    if (years.length === 0) return null;
    return { year: years[0], data: company.finances[years[0]] };
  };

  const getCertifications = () => {
    if (!company.complements) return [];
    
    const certifications = [];
    const certKeys = [
      'est_bio', 'est_ess', 'est_rge', 'est_siae', 'est_qualiopi',
      'est_association', 'est_entrepreneur_individuel', 'est_organisme_formation',
      'est_patrimoine_vivant', 'est_service_public', 'est_societe_mission'
    ];

    certKeys.forEach(key => {
      if (company.complements?.[key as keyof typeof company.complements]) {
        certifications.push({
          key,
          label: CompanySearchService.getCertificationLabel(key),
          color: CompanySearchService.getCertificationColor(key)
        });
      }
    });

    return certifications;
  };

  const latestFinances = getLatestFinances();
  const certifications = getCertifications();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {company.nom_raison_sociale}
            </h3>
            {company.sigle && (
              <p className="text-emerald-600 font-medium text-sm mb-2">
                {company.sigle}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">SIREN:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">
                {CompanySearchService.formatSiren(company.siren)}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(company.siege.etat_administratif)}
            <span className={`font-medium px-2 py-1 rounded-full text-xs ${CompanySearchService.getStatusBgColor(company.siege.etat_administratif)}`}>
              {CompanySearchService.getStatusLabel(company.siege.etat_administratif)}
            </span>
          </div>
        </div>

        {/* Informations du siège */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Siège social
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{company.siege.adresse}</p>
                  <p className="text-gray-600">
                    {company.siege.code_postal} {company.siege.libelle_commune}
                  </p>
                  <p className="text-gray-500">{company.siege.region}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div className="text-sm">
                  <span className="text-gray-600">Créée le </span>
                  <span className="font-medium text-gray-900">
                    {formatDate(company.siege.date_creation)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {company.siege.libelle_activite_principale}
                  </p>
                  <p className="text-gray-500 font-mono">
                    NAF: {company.siege.activite_principale}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {(company.siege.nom_commercial || company.siege.enseigne) && (
            <div className="mt-3 pt-3 border-t border-emerald-200">
              {company.siege.nom_commercial && (
                <p className="text-sm">
                  <span className="text-gray-600">Nom commercial: </span>
                  <span className="font-medium text-gray-900">{company.siege.nom_commercial}</span>
                </p>
              )}
              {company.siege.enseigne && (
                <p className="text-sm">
                  <span className="text-gray-600">Enseigne: </span>
                  <span className="font-medium text-gray-900">{company.siege.enseigne}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{company.nombre_etablissements}</p>
            <p className="text-xs text-gray-600">Établissements</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-600">{company.nombre_etablissements_ouverts}</p>
            <p className="text-xs text-gray-600">Ouverts</p>
          </div>
          {company.siege.tranche_effectif_salarie && (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-bold text-blue-600">
                {CompanySearchService.getTrancheEffectifLabel(company.siege.tranche_effectif_salarie)}
              </p>
              <p className="text-xs text-gray-600">Effectif</p>
            </div>
          )}
          {latestFinances && (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Euro className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-bold text-green-600">
                {CompanySearchService.formatCurrency(latestFinances.data.ca || 0)}
              </p>
              <p className="text-xs text-gray-600">CA {latestFinances.year}</p>
            </div>
          )}
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {certifications.slice(0, 6).map((cert) => (
                <span
                  key={cert.key}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cert.color}`}
                >
                  {cert.label}
                </span>
              ))}
              {certifications.length > 6 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{certifications.length - 6} autres
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dirigeants */}
        {company.dirigeants && company.dirigeants.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-2">Dirigeants</h5>
            <div className="space-y-1">
              {company.dirigeants.slice(0, 2).map((dirigeant, index) => (
                <div key={index} className="text-sm text-blue-700">
                  {dirigeant.type_dirigeant === 'personne physique' ? (
                    <span>
                      {dirigeant.prenoms} {dirigeant.nom} - {dirigeant.qualite}
                    </span>
                  ) : (
                    <span>
                      {dirigeant.denomination || dirigeant.raison_sociale} - {dirigeant.qualite}
                    </span>
                  )}
                </div>
              ))}
              {company.dirigeants.length > 2 && (
                <div className="text-xs text-blue-600">
                  +{company.dirigeants.length - 2} autres dirigeants
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bouton voir détails */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(company)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            Voir la fiche complète
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};