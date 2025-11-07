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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<any[]>([]);

  const getNotification = async () => {
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
  };

  const handleApproved = async (id: string, action: string) => {
    const data = { id, action };

    try {
      const res = await fetch(`${config.env.apiEndpoint}/api/retray/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Demande d'approbation", {
          description: "Vous venez d'approuver la demande de retrait",
        });
        await getNotification(); 
      } else {
        toast.error("Erreur", {
          description: result.error || "Impossible d'approuver la demande",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la requête PATCH:", error);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);
  
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
        <div className="flex flex-col space-y-4 w-full">
          {notifications.map((notif) => (
            <Item
              key={notif.id}
              className="p-4 border rounded-md shadow-sm w-full" // <- w-full ici
            >
              <ItemContent className="w-full">
                {" "}
                {/* <- forcer largeur */}
                <ItemTitle className="flex flex-col items-start space-y-1 w-full">
                  {" "}
                  {/* <- w-full */}
                  <h4 className="font-semibold">{notif.title}</h4>
                  <p className="text-sm">{notif.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </ItemTitle>
              </ItemContent>
              <ItemActions className="flex gap-4">
                <Button className="bg-green-500 text-white hover:bg-green-400" onClick={() => handleApproved(notif.id, "approuver")}>
                  Approuver
                </Button>
                <Button variant="destructive">Refuser</Button>
              </ItemActions>
            </Item>
          ))}
        </div>
      )}
    </>
  );
}
