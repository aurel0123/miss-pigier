"use client";
import React, { useEffect } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Bell } from "lucide-react";
import config from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/database/schema";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const getNotification = React.useCallback(async () => {
    try {
      const res = await fetch(`${config.env.apiEndpoint}/api/notification/`, {
        method: "GET",
      });
      const result = await res.json();

      if (result.success) {
        setNotifications(result.data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des notifications:", err);
    }
  }, []);

  useEffect(() => {
    getNotification(); // ✅ appel unique au montage
  }, [getNotification]);

  const statusColor: Record<string, string> = {
    withdrawal_request: "yellow",
    withdrawal_approved: "green",
    payment_completed: "blue",
    withdrawal_rejected: "red",
  };

  return (
    <>
      {notifications.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell />
            </EmptyMedia>
            <EmptyTitle>Aucune notification</EmptyTitle>
            <EmptyDescription>
              Vous n&apos;avez reçu aucune notification
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col space-y-4">
          {notifications.map((notif) => {
            const label =
              notif.type === "payment_completed"
                ? "Complétée"
                : notif.type === "withdrawal_approved"
                ? "Approuvée"
                : notif.type === "withdrawal_request"
                ? "Demande en cours"
                : "Rejetée";

            const color =
              statusColor[notif.type as keyof typeof statusColor] ?? "gray";

            return (
              <div key={notif.id} className="p-4 border rounded-md shadow-sm">
                <h4 className="font-semibold">{notif.title}</h4>
                <p className="text-sm">{notif.message}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleString()
                      : "Date inconnue"}
                  </span>
                  <Badge
                    className={`bg-${color}-400 text-${color}-800`}
                  >
                    {label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
