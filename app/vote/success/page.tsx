// app/vote/success/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface PaymentInfo {
  transaction_id: string;
  montant: number;
  nombreVotes: number;
  candidat: {
    nom: string;
    prenom: string;
  };
  status: string;
}

export default function VoteSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get('transaction');
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setError('ID de transaction manquant');
      setIsLoading(false);
      return;
    }

    fetchPaymentInfo();
  }, [transactionId]);

  const fetchPaymentInfo = async () => {
    try {
      const response = await fetch(`/api/payment/status?transaction=${transactionId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentInfo(data.payment);
      } else {
        setError(data.message || 'Erreur lors de la récupération des informations');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Vérification de votre paiement...</p>
          <p className="text-sm text-gray-400 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-gray-800 p-8 rounded-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Erreur</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button 
            onClick={() => router.push('/candidates')}
            className="w-full"
          >
            Retour aux candidats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center bg-gray-800 p-8 rounded-2xl border border-primary/30">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">
            🎉 Vote enregistré avec succès !
          </h1>
          <p className="text-gray-300">
            Merci pour votre participation au concours
          </p>
        </div>

        {paymentInfo && (
          <div className="bg-gray-700 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Récapitulatif</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Candidat:</span>
                <span className="text-white font-medium">
                  {paymentInfo.candidat.nom} {paymentInfo.candidat.prenom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nombre de votes:</span>
                <span className="text-white font-medium">{paymentInfo.nombreVotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Montant payé:</span>
                <span className="text-primary font-bold">
                  {paymentInfo.montant.toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Statut:</span>
                <span className="text-green-400 font-medium">
                  {paymentInfo.status === 'completed' ? '✅ Confirmé' : paymentInfo.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction:</span>
                <span className="text-gray-300 font-mono text-sm">
                  {paymentInfo.transaction_id}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              <strong>📱 Important:</strong> Vos votes sont maintenant comptabilisés ! 
              Vous pouvez voter à nouveau autant de fois que vous le souhaitez.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => router.push('/candidates')}
              className="flex-1"
              variant="outline"
            >
              Voir tous les candidats
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Voter à nouveau
            </Button>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'J\'ai voté !',
                    text: `Je viens de voter pour ${paymentInfo?.candidat.nom} ${paymentInfo?.candidat.prenom} ! Votez vous aussi 👇`,
                    url: window.location.origin + '/candidates'
                  });
                }
              }}
            >
              📤 Partager
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}