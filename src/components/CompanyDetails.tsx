import React from 'react';
import { 
  Building2, MapPin, Calendar, Users, Activity, CheckCircle, XCircle, 
  X, Phone, Mail, Globe, FileText, Award, Shield, Briefcase,
  TrendingUp, Clock, Hash, Building
} from 'lucide-react';
import { Company } from '../types/company';
import { CompanySearchService } from '../services/api';

interface CompanyDetailsProps {
  company: Company;
  onClose: () => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, onClose }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'A' ? 'text-emerald-600' : 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    return status === 'A' ? 
      <CheckCircle className="w-5 h-5 text-emerald-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusText = (status: string) => {
    return status === 'A' ? 'Active' : 'Inactive';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{company.nom_raison_sociale}</h2>
              {company.sigle && (
                <p className="text-emerald-100 font-medium mb-2">{company.sigle}</p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span>SIREN: {CompanySearchService.formatSiren(company.siren)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(company.siege.etat_administratif)}
                  <span>{getStatusText(company.siege.etat_administratif)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Informations générales */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Informations générales
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <p className="text-gray-900">{company.nom_complet}</p>
                </div>
                {company.siege.nature_juridique && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Forme juridique</label>
                    <p className="text-gray-900">
                      {company.siege.libelle_nature_juridique || company.siege.nature_juridique}
                    </p>
                  </div>
                )}
                {company.siege.tranche_effectif_salarie && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tranche d'effectif</label>
                    <p className="text-gray-900">
                      {company.siege.libelle_tranche_effectif || company.siege.tranche_effectif_salarie}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                  <p className="text-gray-900">{formatDate(company.siege.date_creation)}</p>
                </div>
                {company.siege.date_debut_activite && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Début d'activité</label>
                    <p className="text-gray-900">{formatDate(company.siege.date_debut_activite)}</p>
                  </div>
                )}
                {company.siege.date_fin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                    <p className="text-red-600">{formatDate(company.siege.date_fin)}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Siège social */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Siège social
            </h3>
            <div className="bg-emerald-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <div className="text-gray-900">
                    <p>{company.siege.adresse}</p>
                    <p>{company.siege.code_postal} {company.siege.libelle_commune}</p>
                    <p className="text-gray-600">{company.siege.departement} - {company.siege.region}</p>
                  </div>
                  {company.siege.geo_adresse && (
                    <p className="text-sm text-gray-500 mt-2">{company.siege.geo_adresse}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                    <code className="bg-white px-3 py-2 rounded border text-gray-800 font-mono">
                      {CompanySearchService.formatSiret(company.siege.siret)}
                    </code>
                  </div>
                  {company.siege.nom_commercial && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom commercial</label>
                      <p className="text-gray-900">{company.siege.nom_commercial}</p>
                    </div>
                  )}
                  {company.siege.enseigne && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enseigne</label>
                      <p className="text-gray-900">{company.siege.enseigne}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Activité */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Activité
            </h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activité principale</label>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {company.siege.libelle_activite_principale}
                </p>
                <p className="text-gray-600">
                  Code NAF: <span className="font-mono">{company.siege.activite_principale}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Statistiques */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Statistiques
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{company.nombre_etablissements}</p>
                <p className="text-sm text-gray-600">Établissements</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{company.nombre_etablissements_ouverts}</p>
                <p className="text-sm text-gray-600">Ouverts</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {company.nombre_etablissements - company.nombre_etablissements_ouverts}
                </p>
                <p className="text-sm text-gray-600">Fermés</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {company.matching_etablissements?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Correspondants</p>
              </div>
            </div>
          </section>

          {/* Certifications et labels */}
          {company.complements && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Certifications et labels
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {company.complements.est_bio && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Shield className="w-4 h-4 mr-1" />
                        Agriculture Biologique
                      </span>
                    )}
                    {company.complements.est_ess && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        <Shield className="w-4 h-4 mr-1" />
                        Économie Sociale et Solidaire
                      </span>
                    )}
                    {company.complements.est_rge && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Shield className="w-4 h-4 mr-1" />
                        Reconnu Garant de l'Environnement
                      </span>
                    )}
                    {company.complements.est_siae && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        <Shield className="w-4 h-4 mr-1" />
                        Structure d'Insertion par l'Activité Économique
                      </span>
                    )}
                    {company.complements.est_qualiopi && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                        <Shield className="w-4 h-4 mr-1" />
                        Qualiopi
                      </span>
                    )}
                    {company.complements.est_entrepreneur_individuel && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        <Briefcase className="w-4 h-4 mr-1" />
                        Entrepreneur Individuel
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {company.complements.identifiant_association && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant association</label>
                      <p className="text-gray-900 font-mono">{company.complements.identifiant_association}</p>
                    </div>
                  )}
                  {company.complements.liste_idcc && company.complements.liste_idcc.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conventions collectives (IDCC)</label>
                      <div className="flex flex-wrap gap-1">
                        {company.complements.liste_idcc.map((idcc, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {idcc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {company.complements.identifiant_uai && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant UAI</label>
                      <p className="text-gray-900 font-mono">{company.complements.identifiant_uai}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Établissements correspondants */}
          {company.matching_etablissements && company.matching_etablissements.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                Établissements correspondants ({company.matching_etablissements.length})
              </h3>
              <div className="space-y-4">
                {company.matching_etablissements.slice(0, 5).map((etablissement, index) => (
                  <div key={etablissement.siret} className="bg-gray-50 rounded-xl p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
                            SIRET: {CompanySearchService.formatSiret(etablissement.siret)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            etablissement.etat_administratif === 'A' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {etablissement.etat_administratif === 'A' ? 'Actif' : 'Fermé'}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {etablissement.enseigne || etablissement.nom_commercial || 'Établissement'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {etablissement.adresse}
                        </p>
                        <p className="text-sm text-gray-600">
                          {etablissement.code_postal} {etablissement.libelle_commune}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Activité:</span> {etablissement.libelle_activite_principale}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          NAF: {etablissement.activite_principale}
                        </p>
                        <p className="text-sm text-gray-500">
                          Créé le: {formatDate(etablissement.date_creation)}
                        </p>
                        {etablissement.tranche_effectif_salarie && (
                          <p className="text-sm text-gray-500">
                            Effectif: {etablissement.libelle_tranche_effectif || etablissement.tranche_effectif_salarie}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {company.matching_etablissements.length > 5 && (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      ... et {company.matching_etablissements.length - 5} autres établissements
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};