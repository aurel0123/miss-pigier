"use client";
import { Candidate } from "@/types";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import Script from "next/script";

// Déclaration TypeScript pour FedaPay
declare global {
  interface Window {
    FedaPay: {
      init: (options: any) => any;
      CHECKOUT_COMPLETED: number;
      DIALOG_DISMISSED: number;
    };
  }
}

interface ModalVoteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
  prixVote: number;
}

const VoteModal = ({
  open,
  onOpenChange,
  candidate,
  prixVote,
}: ModalVoteProps) => {
  const [step, setStep] = useState(1);
  const [nombreVote, setNombreVote] = useState(1);
  const [numeroTelephone, setNumeroTelephone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fedaPayLoaded, setFedaPayLoaded] = useState(false);

  const montantTotal = prixVote * nombreVote;
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const phoneRegex = /^(\+229|00229)?\d{10}$/;
    if (!numeroTelephone.trim()) {
      newErrors.numeroTelephone = "Le numéro de téléphone est requis";
    } else if (!phoneRegex.test(numeroTelephone.replace(/\s/g, ""))) {
      newErrors.numeroTelephone =
        "Format invalide (ex: +229 XX XX XX XX XX ou XX XX XX XX XX)";
    }

    if (nombreVote < 1 || nombreVote > 100) {
      newErrors.nombreVote =
        "Le nombre de votes doit être supérieure à 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setStep(1);
      setNombreVote(1);
      setNumeroTelephone("");
      setErrors({});
      setIsLoading(false);
    }
    onOpenChange(isOpen);
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

  const handlePayment = async () => {
    if (!fedaPayLoaded) {
      alert("Le système de paiement est en cours de chargement. Veuillez patienter.");
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Créer le paiement en base de données
      const paiementResponse = await fetch('/api/paiement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numeroTel: numeroTelephone,
          montant: montantTotal,
          evenementId: candidate.evenementId,
          candidatId: candidate.id,
          nombreVote: nombreVote,
        }),
      });

      if (!paiementResponse.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const paiementData = await paiementResponse.json();

      // 2. Initialiser le widget FedaPay et ouvrir la boîte de dialogue
      const widget = window.FedaPay.init({
        public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
        environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
        transaction: {
          amount: montantTotal,
          description: `Vote pour ${candidate.nom} ${candidate.prenom}`,
          custom_metadata: {
            paiement_id: paiementData.paiementId,
            candidat_id: candidate.id,
            nombre_votes: nombreVote
          }
        },
        customer: {
          phone_number: {
            number: numeroTelephone,
            country: 'BJ' // Code pays pour le Bénin
          }
        },
        currency: {
          iso: 'XOF' // Franc CFA
        },
        onComplete: async ({ reason, transaction }) => {
          console.log('Résultat du paiement:', { reason, transaction });
          
          if (reason === window.FedaPay.CHECKOUT_COMPLETED) {
            // Paiement réussi
            alert('Paiement effectué avec succès ! Vos votes ont été comptabilisés.');
            
            // Optionnel: vérifier le statut côté serveur
            try {
              const verificationResponse = await fetch(`/api/paiement/verify/${paiementData.paiementId}`);
              const verificationData = await verificationResponse.json();
              
              if (verificationData.success) {
                // Fermer le modal et actualiser si nécessaire
                handleClose(false);
                // Vous pouvez ici déclencher une actualisation des données
                //window.location.reload();
              }
            } catch (error) {
              console.error('Erreur lors de la vérification:', error);
            }
            
          } else if (reason === window.FedaPay.DIALOG_DISMISSED) {
            // Paiement annulé par l'utilisateur
            console.log('Paiement annulé par l\'utilisateur');
          }
          
          setIsLoading(false);
        }
      });

      // Ouvrir la boîte de dialogue de paiement
      widget.open();

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chargement du script FedaPay */}
      <Script
        src="https://cdn.fedapay.com/checkout.js?v=1.1.7"
        onLoad={() => {
          console.log('FedaPay Checkout.js chargé');
          setFedaPayLoaded(true);
        }}
        onError={() => {
          console.error('Erreur lors du chargement de FedaPay');
        }}
      />

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg sm:text-xl">
              Voter pour {candidate.nom} {candidate.prenom}
            </DialogTitle>
          </DialogHeader>
          
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4 order-2 md:order-1">
                <div>
                  <Label
                    htmlFor="numeroTelephone"
                    className="text-sm sm:text-base mb-2 block"
                  >
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
                        setErrors((prev) => ({ ...prev, numeroTelephone: "" }));
                      }
                    }}
                    className={`text-base ${
                      errors.numeroTelephone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.numeroTelephone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.numeroTelephone}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Votre numéro sera associé à ce vote
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="nombreVote"
                    className="text-sm sm:text-base mb-2 block"
                  >
                    Nombre de votes *
                  </Label>
                  <Input
                    id="nombreVote"
                    type="number"
                    min={1}
                    max={100}
                    value={nombreVote}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(100, Number(e.target.value))
                      );
                      setNombreVote(value);
                      if (errors.nombreVote) {
                        setErrors((prev) => ({ ...prev, nombreVote: "" }));
                      }
                    }}
                    className={`text-base ${
                      errors.nombreVote ? "border-red-500" : ""
                    }`}
                  />
                  {errors.nombreVote && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.nombreVote}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Prix par vote: {prixVote} FCFA
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
                    src={candidate.image}
                    alt={`${candidate.nom} ${candidate.prenom}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center px-2">
                  <h3 className="font-semibold text-base sm:text-lg">
                    {candidate.nom} {candidate.prenom}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {candidate.description}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-primary mt-2">
                    Votes actuels: {candidate.nombreVotes}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-gray-800 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  Récapitulatif
                </h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>Candidat:</span>
                    <span className="font-medium">
                      {candidate.nom} {candidate.prenom}
                    </span>
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
                    <span className="font-medium">{prixVote} FCFA</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-sm sm:text-lg">
                    <span>Total:</span>
                    <span className="text-primary">
                      {montantTotal.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm sm:text-base font-semibold mb-2 block">
                  Moyens de paiement acceptés
                </Label>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm sm:text-base">
                      📱 Mobile Money
                    </div>
                    <div className="text-xs sm:text-sm ">
                      MTN Money, Moov Money
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm sm:text-base">
                      💳 Carte bancaire
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-red-500 text-base font-bold">
                  Des frais de transaction peuvent être appliqués.
                </p>
                <p className="text-lg text-white ">
                  En cliquant sur &apos;Payer maintenant&apos;, une boîte de dialogue sécurisée s'ouvrira.
                </p>
              </div>
            </div>
          )}

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
                  className="bg-primary hover:bg-primary/90 text-sm sm:text-base px-3 sm:px-4 w-full sm:w-auto"
                  onClick={handlePayment}
                  disabled={isLoading || !fedaPayLoaded}
                >
                  {isLoading ? "Traitement..." : !fedaPayLoaded ? "Chargement..." : "Payer maintenant"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteModal;