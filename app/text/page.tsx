"use client"

import { useState, useEffect } from "react";
import config from "@/lib/config";

// Déclaration des types pour FedaPay
declare global {
  interface Window {
    FedaPay: {
      init: (options: any) => void;
      checkout: (options: any) => void;
      CHECKOUT_COMPLETED: string;
      DIALOG_DISMISSED: string;
    };
  }
}

export default function FedaPayTestButton() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Fonction pour ajouter des logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  // Charger le script FedaPay
  useEffect(() => {
    const loadFedaPayScript = () => {
      if (typeof window !== 'undefined') {
        addLog('Vérification du script FedaPay...');
        
        const existingScript = document.querySelector('script[src*="checkout.js"]');
        
        if (!existingScript && !window.FedaPay) {
          addLog('Chargement du script FedaPay...');
          const script = document.createElement('script');
          script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7';
          script.async = true;
          script.onload = () => {
            addLog('✅ Script FedaPay chargé avec succès');
            setScriptLoaded(true);
          };
          script.onerror = (error) => {
            addLog('❌ Erreur lors du chargement du script FedaPay');
            console.error(error);
          };
          document.head.appendChild(script);
        } else if (window.FedaPay) {
          addLog('✅ Script FedaPay déjà disponible');
          setScriptLoaded(true);
        }
      }
    };

    loadFedaPayScript();
  }, []);

  // Test simple du paiement FedaPay
  const testFedaPay = () => {
    addLog('🚀 Début du test FedaPay...');
    
    if (!scriptLoaded || !window.FedaPay) {
      addLog('❌ Script FedaPay non disponible');
      alert('Script FedaPay non chargé');
      return;
    }

    // Configuration de la clé publique depuis votre config
    const FEDAPAY_PUBLIC_KEY = config.env.fedapay.publicKey;
    
    if (!FEDAPAY_PUBLIC_KEY) {
      addLog(`❌ Clé publique FedaPay manquante: ${FEDAPAY_PUBLIC_KEY}`);
      alert('Veuillez configurer votre clé publique FedaPay dans config.env.fedapay.publicKey');
      return;
    }

    addLog(`🔑 Clé publique: ${FEDAPAY_PUBLIC_KEY?.substring(0, 10)}...`);

    setIsLoading(true);
    addLog('💳 Configuration du paiement...');

    try {
      const fedaPayConfig = {
        public_key: FEDAPAY_PUBLIC_KEY,
        transaction: {
          amount: 1000, // 1000 FCFA pour le test
          description: 'Test de paiement FedaPay',
          currency: 'XOF'
        },
        customer: {
          firstname: 'Test',
          lastname: 'User',
          email: 'test@example.com',
          phone_number: '+22997123456'
        },
        onComplete: function(reason: string, data: any) {
          addLog(`📋 Callback onComplete: ${reason}`);
          setIsLoading(false);
          
          if (reason === window.FedaPay.CHECKOUT_COMPLETED) {
            addLog('✅ Paiement réussi !');
            alert('Paiement réussi ! ' + JSON.stringify(data));
          } else if (reason === window.FedaPay.DIALOG_DISMISSED) {
            addLog('⚠️ Paiement annulé');
            alert('Paiement annulé');
          }
        },
        onError: function(error: any) {
          addLog(`❌ Erreur: ${JSON.stringify(error)}`);
          setIsLoading(false);
          alert('Erreur: ' + JSON.stringify(error));
        }
      };

      addLog('🔧 Configuration créée, initialisation...');
      console.log('Config FedaPay:', fedaPayConfig);

      // Initialiser FedaPay
      window.FedaPay.init(fedaPayConfig);
      addLog('🎯 FedaPay.init() appelé');

    } catch (error: any) {
      addLog(`💥 Exception: ${error.message}`);
      setIsLoading(false);
      alert('Exception: ' + error.message);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Test FedaPay Checkout</h2>
        
        {/* Status */}
        <div className="mb-4 p-3 rounded-lg">
          <div className={`text-sm ${scriptLoaded ? 'text-green-600' : 'text-yellow-600'}`}>
            Status: {scriptLoaded ? '✅ Script FedaPay chargé' : '⏳ Chargement...'}
          </div>
        </div>

        {/* Configuration info */}
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            🔑 Configuration détectée
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Clé FedaPay: {config.env.fedapay.publicKey ? 
              `${config.env.fedapay.publicKey.substring(0, 15)}...` : 
              'Non configurée'}
          </p>
        </div>

        {/* Bouton de test */}
        <div className="space-y-3">
          <button
            onClick={testFedaPay}
            disabled={!scriptLoaded || isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              !scriptLoaded || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Traitement...
              </div>
            ) : (
              '🧪 Tester FedaPay (1000 FCFA)'
            )}
          </button>

          <button
            onClick={clearLogs}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🗑️ Effacer les logs
          </button>
        </div>
      </div>

      {/* Console de logs */}
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 min-h-40 max-h-80 overflow-y-auto font-mono text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">📋 Console de debug</span>
          <span className="text-xs text-gray-500">{logs.length} messages</span>
        </div>
        {logs.length === 0 ? (
          <div className="text-gray-500">En attente...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>

      {/* Informations de debug */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-3">🔍 Informations de debug</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Clé FedaPay:</span>{' '}
            <span className={config.env.fedapay.publicKey ? 'text-green-600' : 'text-red-600'}>
              {config.env.fedapay.publicKey ? 
                `${config.env.fedapay.publicKey.substring(0, 15)}...` : 
                'Non configurée'}
            </span>
          </div>
          <div>
            <span className="font-medium">Window.FedaPay:</span>{' '}
            <span className={typeof window !== 'undefined' && window.FedaPay ? 'text-green-600' : 'text-red-600'}>
              {typeof window !== 'undefined' && window.FedaPay ? 'Disponible' : 'Non disponible'}
            </span>
          </div>
          <div>
            <span className="font-medium">Script chargé:</span>{' '}
            <span className={scriptLoaded ? 'text-green-600' : 'text-red-600'}>
              {scriptLoaded ? 'Oui' : 'Non'}
            </span>
          </div>
          <div>
            <span className="font-medium">User Agent:</span>{' '}
            <span className="text-gray-600 text-xs break-all">
              {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions pour intégrer dans votre projet */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
          📝 Pour intégrer dans votre projet
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li>Vérifiez que votre clé publique FedaPay est bien configurée dans <code>config.env.fedapay.publicKey</code></li>
          <li>Testez d'abord avec ce bouton pour valider la configuration</li>
          <li>Intégrez ensuite dans votre modal de vote</li>
          <li>Vérifiez les logs de la console pour diagnostiquer les erreurs</li>
        </ol>
      </div>
    </div>
  );
}