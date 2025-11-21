"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast("Message envoyé", {
          description: "Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Erreur", {
          description: data.error || "Une erreur est survenue.",
        });
      }
    } catch {
      toast("Erreur", {
        description: "Impossible d'envoyer le message.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl lg:max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 sm:mb-4">
            Contactez-nous
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Vous avez des questions ? N&apos;hésitez pas à nous contacter, nous
            sommes là pour vous aider.
          </p>
        </motion.div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-7 lg:p-8 border border-primary/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
                Envoyez-nous un message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300"
                  >
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="w-full bg-gray-900/50 border-gray-700 focus:border-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full bg-gray-900/50 border-gray-700 focus:border-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300"
                  >
                    Sujet
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Objet de votre message"
                    className="w-full bg-gray-900/50 border-gray-700 focus:border-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-300"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    rows={5}
                    className="w-full bg-gray-900/50 border-gray-700 focus:border-primary resize-none text-sm sm:text-base"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm sm:text-base h-11 sm:h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                Nos coordonnées
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-5 sm:mb-7">
                Rejoignez-nous et participez à l&apos;élection de Miss Pigier.
                Pour toute question ou information, nous sommes à votre
                disposition.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  Icon: Mail,
                  title: "Email",
                  link: "mailto:ulmannazeligui@gmail.com",
                  linkText: "ulmannazeligui@gmail.com",
                  description: "Envoyez-nous un email",
                },
                {
                  Icon: Phone,
                  title: "Téléphone",
                  link: "tel:+22901509574880",
                  linkText: "+229 01 50 95 74 80",
                  description: "Appelez-nous directement",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-5 lg:p-6 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg">
                      <item.Icon
                        size={22}
                        className="text-primary sm:size-[24px]"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                        {item.description}
                      </p>
                      <Link
                        href={item.link}
                        className="text-sm sm:text-base text-primary hover:text-secondary transition-colors font-medium break-words"
                      >
                        {item.linkText}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to action */}
            <motion.div
              className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-4 sm:p-5 lg:p-6 border border-primary/20 mt-4 sm:mt-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                Besoin d&apos;aide ?
              </h4>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">
                Notre équipe est disponible du lundi au vendredi de 9h à 18h
                pour répondre à toutes vos questions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;