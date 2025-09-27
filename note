"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Candidate } from "@/types";

// Déclaration des types pour FedaPay
declare global {
  interface Window {
    FedaPay: {
      init: (options: any) => void;
      CHECKOUT_COMPLETED: string;
      DIALOG_DISMISSED: string;
    };
  }
}

type VoteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidat: Candidate;
  prixParVote: number;
};

export default function VoteModal({ open, onOpenChange, candidat, prixParVote }: VoteModalProps) {
  const [step, setStep] = useState(1);
  const [nombreVote, setNombreVote] = useState(1);
  const [numeroTelephone, setNumeroTelephone] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const montantTotal = nombreVote * prixParVote;
  const FEDAPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY;
  
  // Charger le script FedaPay Checkout.js
  useEffect(() => {
    const loadFedaPayScript = () => {
      if (typeof window !== 'undefined' && !window.FedaPay && !document.querySelector('script[src*="checkout.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7';
        script.async = true;
        script.onload = () => {
          setScriptLoaded(true);
        };
        script.onerror = () => {
          console.error('Erreur lors du chargement du script FedaPay');
        };
        document.head.appendChild(script);
      } else if (window.FedaPay) {
        setScriptLoaded(true);
      }
    };

    loadFedaPayScript();
  }, []);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validation du nom
    if (!nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (nom.trim().length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }
    
    // Validation du prénom
    if (!prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    } else if (prenom.trim().length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }
    
    // Validation du numéro de téléphone (format béninois corrigé)
    const phoneRegex = /^(\+229|00229)?[0-9]{10}$/;
    if (!numeroTelephone.trim()) {
      newErrors.numeroTelephone = "Le numéro de téléphone est requis";
    } else if (!phoneRegex.test(numeroTelephone.replace(/\s/g, ''))) {
      newErrors.numeroTelephone = "Format invalide (ex: +229 XX XX XX XX ou XX XX XX XX)";
    }
    
    if (nombreVote < 1 || nombreVote > 100) {
      newErrors.nombreVote = "Le nombre de votes doit être entre 1 et 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Réinitialiser le modal quand il se ferme
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setStep(1);
      setNombreVote(1);
      setNumeroTelephone("");
      setNom("");
      setPrenom("");
      setErrors({});
      setIsLoading(false);
    }
    onOpenChange(isOpen);
  };

  // Initialiser le paiement avec FedaPay Checkout.js
  const handlePaymentWithCheckout = async () => {
    if (!validateForm() || !scriptLoaded) {
      if (!scriptLoaded) {
        alert('Script de paiement en cours de chargement...');
      }
      return;
    }

    if (!FEDAPAY_PUBLIC_KEY) {
      alert('Configuration FedaPay manquante. Veuillez vérifier vos clés API.');
      return;
    }

    setIsLoading(true);

    try {
      // Formatage du numéro de téléphone
      const phoneFormatted = numeroTelephone.replace(/\s/g, '').replace(/^(\+229|00229)/, '');
      
      // Préparer les métadonnées pour le suivi
      const metadata = {
        candidat_id: candidat.id,
        evenement_id: candidat.evenementId,
        candidat_nom: `${candidat.nom} ${candidat.prenom}`,
        nombre_votes: nombreVote,
        prix_par_vote: prixParVote,
        numero_telephone: phoneFormatted,
        votant_nom: nom.trim(),
        votant_prenom: prenom.trim(),
        type: 'vote'
      };

      // Initialiser FedaPay Checkout
      window.FedaPay.init({
        public_key: FEDAPAY_PUBLIC_KEY,
        transaction: {
          amount: montantTotal,
          description: `Vote pour ${candidat.nom} ${candidat.prenom} - ${nombreVote} vote(s)`,
          currency: 'XOF'
        },
        customer: {
          firstname: prenom.trim(),
          lastname: nom.trim(),
          email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@vote.app`,
          phone_number: phoneFormatted
        },
        custom_metadata: metadata,
        onComplete: function(reason: string, data: any) {
          setIsLoading(false);
          
          if (reason === window.FedaPay.CHECKOUT_COMPLETED) {
            // Paiement réussi
            console.log('Paiement réussi:', data);
            alert(`Merci ${prenom} ${nom} ! Vos ${nombreVote} vote(s) pour ${candidat.nom} ${candidat.prenom} ont été enregistrés avec succès.`);
            handleClose(false);
            
            // Optionnel: Rafraîchir la page ou mettre à jour les votes
            window.location.reload();
          } else if (reason === window.FedaPay.DIALOG_DISMISSED) {
            // Paiement annulé ou échoué
            console.log('Paiement annulé ou échoué');
          }
        },
        onError: function(error: any) {
          setIsLoading(false);
          console.error('Erreur FedaPay:', error);
          alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
        }
      });

    } catch (error: any) {
      setIsLoading(false);
      console.error("Erreur lors de l'initialisation du paiement:", error);
      alert(error.message || "Erreur lors du traitement du paiement. Veuillez réessayer.");
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateForm()) {
        setStep(2);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg sm:text-xl">
            Voter pour {candidat.nom} {candidat.prenom}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulaire */}
            <div className="flex flex-col gap-4 order-2 md:order-1">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nom" className="text-sm sm:text-base mb-2 block">
                    Nom *
                  </Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                      if (errors.nom) {
                        setErrors(prev => ({...prev, nom: ''}));
                      }
                    }}
                    className={`text-base ${errors.nom ? 'border-red-500' : ''}`}
                  />
                  {errors.nom && (
                    <p className="text-xs text-red-500 mt-1">{errors.nom}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="prenom" className="text-sm sm:text-base mb-2 block">
                    Prénom *
                  </Label>
                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={prenom}
                    onChange={(e) => {
                      setPrenom(e.target.value);
                      if (errors.prenom) {
                        setErrors(prev => ({...prev, prenom: ''}));
                      }
                    }}
                    className={`text-base ${errors.prenom ? 'border-red-500' : ''}`}
                  />
                  {errors.prenom && (
                    <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="numeroTelephone" className="text-sm sm:text-base mb-2 block">
                  Numéro de téléphone *
                </Label>
                <Input
                  id="numeroTelephone"
                  type="tel"
                  placeholder="Ex: XX XX XX XX XX"
                  value={numeroTelephone}
                  onChange={(e) => {
                    setNumeroTelephone(e.target.value);
                    if (errors.numeroTelephone) {
                      setErrors(prev => ({...prev, numeroTelephone: ''}));
                    }
                  }}
                  className={`text-base ${errors.numeroTelephone ? 'border-red-500' : ''}`}
                />
                {errors.numeroTelephone && (
                  <p className="text-xs text-red-500 mt-1">{errors.numeroTelephone}</p>
                )}
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Votre numéro sera associé à ce vote
                </p>
              </div>
              
              <div>
                <Label htmlFor="nombreVote" className="text-sm sm:text-base mb-2 block">
                  Nombre de votes *
                </Label>
                <Input
                  id="nombreVote"
                  type="number"
                  min={1}
                  max={100}
                  value={nombreVote}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(100, Number(e.target.value)));
                    setNombreVote(value);
                    if (errors.nombreVote) {
                      setErrors(prev => ({...prev, nombreVote: ''}));
                    }
                  }}
                  className={`text-base ${errors.nombreVote ? 'border-red-500' : ''}`}
                />
                {errors.nombreVote && (
                  <p className="text-xs text-red-500 mt-1">{errors.nombreVote}</p>
                )}
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Prix par vote: {prixParVote} FCFA
                </p>
              </div>
              
              <div className="p-3 sm:p-4 bg-gray-800 dark:bg-gray-800 rounded-lg">
                <Label className="text-sm sm:text-base">Montant total</Label>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {montantTotal.toLocaleString()} FCFA
                </div>
              </div>
            </div>

            {/* Image du candidat */}
            <div className="flex flex-col items-center justify-center gap-3 order-1 md:order-2">
              <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-xl overflow-hidden">
                <Image
                  src={candidat.image}
                  alt={`${candidat.nom} ${candidat.prenom}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center px-2">
                <h3 className="font-semibold text-base sm:text-lg">
                  {candidat.nom} {candidat.prenom}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {candidat.description}
                </p>
                <p className="text-xs sm:text-sm font-medium text-primary mt-2">
                  Votes actuels: {candidat.nombreVotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 bg-gray-800 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-2">Récapitulatif</h3>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Candidat:</span>
                  <span className="font-medium">{candidat.nom} {candidat.prenom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Votant:</span>
                  <span className="font-medium">{prenom} {nom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Téléphone:</span>
                  <span className="font-medium">{numeroTelephone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nombre de votes:</span>
                  <span className="font-medium">{nombreVote}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix par vote:</span>
                  <span className="font-medium">{prixParVote} FCFA</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-sm sm:text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{montantTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm sm:text-base font-semibold mb-2 block">Moyens de paiement acceptés</Label>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium text-sm sm:text-base">📱 Mobile Money</div>
                  <div className="text-xs sm:text-sm text-gray-500">MTN Money, Moov Money, Celtiis Cash</div>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium text-sm sm:text-base">💳 Carte bancaire</div>
                  <div className="text-xs sm:text-sm text-gray-500">Visa, Mastercard</div>
                </div>
              </div>
            </div>

            {/* Avertissement sécurité */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs sm:text-sm">
                🔒 <strong>Paiement sécurisé</strong> - Vos données sont protégées par FedaPay (certifié PCI DSS)
              </p>
            </div>
          </div>
        )}

        {/* Navigation responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 pt-4 border-t space-y-3 sm:space-y-0">
          <div className="order-2 sm:order-1">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)} 
                className="text-sm sm:text-base px-3 sm:px-4"
                disabled={isLoading}
              >
                ← Précédent
              </Button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
            <Button 
              variant="ghost" 
              onClick={() => handleClose(false)} 
              className="text-sm sm:text-base px-3 sm:px-4 w-full sm:w-auto"
              disabled={isLoading}
            >
              Annuler
            </Button>
            {step < 2 ? (
              <Button 
                onClick={handleNextStep} 
                className="text-sm sm:text-base px-3 sm:px-4 w-full sm:w-auto"
                disabled={isLoading}
              >
                Suivant →
              </Button>
            ) : (
              <Button 
                onClick={handlePaymentWithCheckout} 
                className="bg-primary hover:bg-primary/90 text-sm sm:text-base px-3 sm:px-4 w-full sm:w-auto"
                disabled={isLoading || !scriptLoaded}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Traitement...</span>
                  </div>
                ) : !scriptLoaded ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </div>
                ) : (
                  <>🔒 Payer {montantTotal.toLocaleString()} FCFA</>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}