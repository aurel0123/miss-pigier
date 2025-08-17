// app/vote/cancel/page.tsx
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function VoteCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transaction');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center bg-gray-800 p-8 rounded-2xl border border-gray-600">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Paiement annulé
          </h1>
          <p className="text-gray-300">
            Votre paiement a été annulé. Aucun vote n'a été enregistré.
          </p>
        </div>

        {transactionId && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">Transaction annulée:</p>
            <p className="text-gray-300 font-mono text-sm">{transactionId}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              💡 <strong>Pas de souci !</strong> Vous pouvez recommencer votre vote à tout moment. 
              Aucun frais ne vous a été facturé.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.push('/candidates')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux candidats
            </Button>
            
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}