"use client";
import React from "react";
import { motion } from "framer-motion";
import { Scale, Shield, FileText, Mail, Phone, MapPin } from "lucide-react";

const MentionsLegales = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Éditeur du site",
      content: `Le présent site est édité par Ulmann Service, entreprise spécialisée dans la vente de données mobiles et la création de services numériques possédant un registre de commerce reconnu par l’État.

Ulmann Service est dûment enregistrée au Registre du Commerce.

Adresse : Abomey-Calavi Togoudo  M/AZELIGUI
Téléphone : 01 50 95 74 80
Email : ulmannazeligui@gmail.com
Responsable de la publication : AZELIGUI  Prince Ulmann Osias
IFU : 0202557751486`,
    },
    {
      icon: Shield,
      title: "2. Objet du site",
      content: `Ulmann Service propose, entre autres services numériques, la conception et la mise en place de sites web destinés aux votes en ligne.

Le présent site est développé pour le compte de structures, universités ou organisations souhaitant organiser un concours ou une élection interne.`,
    },
    {
      icon: FileText,
      title: "3. Hébergement",
      content: `Le site est hébergé par :

Vercel

Site web : https://vercel.com/`,
    },
    {
      icon: Scale,
      title: "4. Propriété intellectuelle",
      content: `L’ensemble des éléments composant ce site (textes, images, logos, graphiques, contenus, interfaces, structure) est protégé par la législation en vigueur.

Toute reproduction, représentation ou exploitation partielle ou totale, sans autorisation préalable d’Ulmann Service, est strictement interdite.`,
    },
    {
      icon: Shield,
      title: "5. Données personnelles",
      content: `Dans le cadre du fonctionnement du site (inscriptions, gestion des votes, sécurité), certaines données personnelles peuvent être collectées.

Ces données sont utilisées uniquement pour :
• assurer le bon déroulement du concours ;
• garantir la sécurité et la validité des votes ;
• prévenir les fraudes ;
• gérer la participation des candidats et des utilisateurs.

Les données ne sont ni revendues, ni partagées à des tiers non autorisés.

Conformément aux réglementations applicables, chaque utilisateur dispose d’un droit d’accès, de rectification et de suppression.

Pour toute demande : ulmannazeligui@gmail.com`,
    },
    {
      icon: FileText,
      title: "6. Cookies",
      content: `Le site peut utiliser des cookies techniques et analytiques permettant d’assurer son bon fonctionnement.

L’utilisateur peut configurer ses préférences via les paramètres de son navigateur.`,
    },
    {
      icon: Shield,
      title: "7. Responsabilité",
      content: `Ulmann Service s’engage à fournir des services fiables et sécurisés, mais ne saurait être tenue responsable :
• d’interruptions temporaires du service ;
• de problèmes liés au réseau internet ;
• de comportements frauduleux émanant d’utilisateurs ou de tiers ;
• de l’utilisation non conforme du site.

Ulmann Service se réserve le droit d’annuler tout vote suspect ou identifié comme frauduleux.`,
    },
    {
      icon: FileText,
      title: "8. Modification des mentions légales",
      content: `Les présentes mentions peuvent être modifiées à tout moment. L’utilisateur est invité à les consulter régulièrement.`,
    },
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14 lg:mb-16 mt-10 sm:mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 sm:mb-4">
            Mentions Légales – Ulmann Service
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Informations légales relatives à l&apos;utilisation du site Ulmann
            Service
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 border border-primary/20 hover:border-primary/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                  <section.icon
                    size={22}
                    className="text-primary sm:size-[24px]"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
                    {section.title}
                  </h2>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-5 sm:p-7 md:p-8 border border-primary/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 text-center">
            Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <Mail className="text-primary mb-3" size={28} />
              <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Email
              </p>
              <a
                href="mailto:ulmannazeligui@gmail.com"
                className="text-sm sm:text-base text-primary hover:text-secondary transition-colors font-medium break-words"
              >
                ulmannazeligui@gmail.com
              </a>
            </div>
            <div className="flex flex-col items-center text-center">
              <Phone className="text-primary mb-3" size={28} />
              <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Téléphone
              </p>
              <a
                href="tel:+2290150957480"
                className="text-sm sm:text-base text-primary hover:text-secondary transition-colors font-medium"
              >
                +229 01 50 95 74 80
              </a>
            </div>
            <div className="flex flex-col items-center text-center">
              <MapPin className="text-primary mb-3" size={28} />
              <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Adresse
              </p>
              <p className="text-sm sm:text-base text-white font-medium text-center">
                Abomey-Calavi Togoudo M/AZELIGUI
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-xs sm:text-sm text-gray-500 mt-8 sm:mt-10 md:mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Dernière mise à jour :{" "}
          {new Date().toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>
      </div>
    </section>
  );
};

export default MentionsLegales;