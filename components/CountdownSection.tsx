"use client";
import config from "@/lib/config";
import React, { useEffect, useState } from "react";
const CountdownSection = () => {
  const [timerleft, setTimerleft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    secondes: 0,
  });
  const getCurrentEvent = async () => {
    try {
      const response = await fetch(
        `${config.env.apiEndpoint}/api/Evenement/get`
      );
      if (response.ok) {
        const data = await response.json();
        return data[0]?.dateFin;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'événement:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDateAndStartTimer = async () => {
      const dateFinStr = await getCurrentEvent();
      if (!dateFinStr) return;

      const DateFin = new Date(dateFinStr).getTime();

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const Difference = DateFin - now;

        if (Difference > 0) {
          setTimerleft({
            days: Math.floor(Difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (Difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((Difference % (1000 * 60 * 60)) / (1000 * 60)),
            secondes: Math.floor((Difference % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    };

    fetchDateAndStartTimer();
  }, []);

  return (
    <section className="py-20 px-10">
      <div className="w-full flex flex-col items-center justify-center">
        <h3 className="text-white text-xl mb-4">Evènement</h3>
        <h2 className="lg:text-5xl text-xl md:text-3xl font-bold text-primary mb-6">
          Décompte jusqu&apos;à la finale
        </h2>
        <p className="text-gray-300 text-lg mb-12">
          Ne manquez pas la fin de l&apos;événement !
        </p>
      </div>
      <div className="CountDown lg:flex lg:flex-row md:flex grid grid-cols-2 gap-8 w-full justify-center items-center">
        <div className="bg-gradient-to-b from-yellow-400/10 to-transparent border-2 border-yellow-400/30 rounded-lg p-6 w-[131px] h-[131px] flex flex-col items-center shadow-[0_0_20px_rgba(255,215,0,0.3),0_0_40px_rgba(255,215,0,0.2),0_0_60px_rgba(255,215,0,0.1)]">
          <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {String(timerleft.days).padStart(2, "0")}
          </div>
          <div className="text-white text-lg font-semibold">JOURS</div>
        </div>
        <div className="bg-gradient-to-b from-yellow-400/10 to-transparent border-2 border-yellow-400/30 rounded-lg p-6 w-[131px] h-[131px] flex flex-col items-center shadow-[0_0_20px_rgba(255,215,0,0.3),0_0_40px_rgba(255,215,0,0.2),0_0_60px_rgba(255,215,0,0.1)]">
          <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {String(timerleft.hours).padStart(2, "0")}
          </div>
          <div className="text-white text-lg font-semibold">HEURES</div>
        </div>
        <div className="bg-gradient-to-b from-yellow-400/10 to-transparent border-2 border-yellow-400/30 rounded-lg p-6 w-[131px] h-[131px] flex flex-col items-center shadow-[0_0_20px_rgba(255,215,0,0.3),0_0_40px_rgba(255,215,0,0.2),0_0_60px_rgba(255,215,0,0.1)]">
          <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {String(timerleft.minutes).padStart(2, "0")}
          </div>
          <div className="text-white text-lg font-semibold">MINUTES</div>
        </div>
        <div className="bg-gradient-to-b from-yellow-400/10 to-transparent border-2 border-yellow-400/30 rounded-lg p-6 w-[131px] h-[131px] flex flex-col items-center shadow-[0_0_20px_rgba(255,215,0,0.3),0_0_40px_rgba(255,215,0,0.2),0_0_60px_rgba(255,215,0,0.1)]">
          <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {String(timerleft.secondes).padStart(2, "0")}
          </div>
          <div className="text-white text-lg font-semibold">SECONDES</div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
