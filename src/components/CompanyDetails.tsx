import React, { useState } from 'react';
import { 
  Building2, MapPin, Calendar, Users, Activity, CheckCircle, XCircle, 
  X, Phone, Mail, Globe, FileText, Award, Shield, Briefcase,
  TrendingUp, Clock, Hash, Building, Download, Eye, Euro,
  Scale, Gavel, Calendar as CalendarIcon, FileCheck
} from 'lucide-react';
import { Company, CompanyDocument } from '../types/company';
import { CompanySearchService, CompanyEnrichmentService } from '../services/api';

interface CompanyDetailsProps {
  company: Company;
  onClose: () => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'rcs' | 'documents'>('general');
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

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

  const handleDownloadDocument = async (document: CompanyDocument) => {
    if (!document.disponible) return;
    
    setDownloadingDoc(document.id);
    try {
      await CompanyEnrichmentService.downloadDocument(document);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    } finally {
      setDownloadingDoc(null);
    }
  };

  const tabs = [
    { id: 'general', label: 'Informations générales', icon: Building2 },
    { id: 'rcs', label: 'Informations RCS', icon: Scale },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-6">
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
                {company.rcs?.numero_rcs && (
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>RCS: {company.rcs.numero_rcs}</span>
                  </div>
                )}
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

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-8">
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
                    {company.siege.libelle_nature_juridique && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Forme juridique</label>
                        <p className="text-gray-900">{company.siege.libelle_nature_juridique}</p>
                      </div>
                    )}
                    {company.siege.tranche_effectif_salarie && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tranche d'effectif</label>
                        <p className="text-gray-900">
                          {CompanySearchService.getTrancheEffectifLabel(company.siege.tranche_effectif_salarie)}
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
            </div>
          )}

          {activeTab === 'rcs' && company.rcs && (
            <div className="space-y-8">
              {/* Informations RCS */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  Registre du Commerce et des Sociétés
                </h3>
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro RCS</label>
                        <p className="text-lg font-mono text-gray-900">{company.rcs.numero_rcs}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lieu d'immatriculation</label>
                        <p className="text-gray-900">{company.rcs.lieu_immatriculation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Greffe</label>
                        <p className="text-gray-900">{company.rcs.greffe}</p>
                      </div>
                      {company.rcs.date_immatriculation && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date d'immatriculation</label>
                          <p className="text-gray-900">{formatDate(company.rcs.date_immatriculation)}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {company.rcs.capital_social && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Capital social</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {CompanySearchService.formatCurrency(company.rcs.capital_social)}
                          </p>
                        </div>
                      )}
                      {company.rcs.forme_juridique && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Forme juridique</label>
                          <p className="text-gray-900">{company.rcs.forme_juridique}</p>
                        </div>
                      )}
                      {company.rcs.duree_personne_morale && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                          <p className="text-gray-900">{company.rcs.duree_personne_morale}</p>
                        </div>
                      )}
                      {company.rcs.date_cloture_exercice && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Clôture d'exercice</label>
                          <p className="text-gray-900">{company.rcs.date_cloture_exercice}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Objet social */}
              {company.rcs.objet_social && (
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-emerald-600" />
                    Objet social
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-900 leading-relaxed">{company.rcs.objet_social}</p>
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Documents officiels
                </h3>
                <div className="text-sm text-gray-500">
                  {company.documents?.filter(d => d.disponible).length || 0} document(s) disponible(s)
                </div>
              </div>

              {company.documents && company.documents.length > 0 ? (
                <div className="space-y-4">
                  {company.documents.map((document) => (
                    <div
                      key={document.id}
                      className={`border rounded-xl p-4 transition-all ${
                        document.disponible 
                          ? 'border-gray-200 hover:border-emerald-300 hover:shadow-md' 
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                              {CompanyEnrichmentService.getDocumentIcon(document.type)}
                            </span>
                            <div>
                              <h4 className={`font-medium ${
                                document.disponible ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {document.libelle}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {CompanyEnrichmentService.getDocumentTypeLabel(document.type)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {document.date_depot && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Déposé le {formatDate(document.date_depot)}</span>
                              </div>
                            )}
                            {document.date_cloture_exercice && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Exercice {new Date(document.date_cloture_exercice).getFullYear()}</span>
                              </div>
                            )}
                            {document.pages && (
                              <span>{document.pages} page(s)</span>
                            )}
                            {document.taille && (
                              <span>{CompanyEnrichmentService.formatFileSize(document.taille)}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {document.disponible ? (
                            <button
                              onClick={() => handleDownloadDocument(document)}
                              disabled={downloadingDoc === document.id}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {downloadingDoc === document.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              <span className="text-sm font-medium">
                                {downloadingDoc === document.id ? 'Téléchargement...' : 'Télécharger'}
                              </span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                              <XCircle className="w-4 h-4" />
                              <span className="text-sm">Non disponible</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun document disponible</h4>
                  <p className="text-gray-600">
                    Les documents officiels de cette entreprise ne sont pas encore disponibles.
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">À propos des documents</h4>
                    <p className="text-sm text-blue-800">
                      Les documents sont issus des dépôts officiels au Registre du Commerce et des Sociétés (RCS). 
                      Ils incluent les statuts, comptes annuels, rapports de gestion et autres actes juridiques.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
