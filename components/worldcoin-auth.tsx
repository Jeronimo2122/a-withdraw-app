"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MiniKit } from "@worldcoin/minikit-js";
import { useToast } from "@/components/ui/use-toast";

interface WorldcoinAuthProps {
  onAuthSuccess?: (address: string) => void;
}

export default function WorldcoinAuth({ onAuthSuccess }: WorldcoinAuthProps) {
  const [isWorldApp, setIsWorldApp] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkWorldApp = async () => {
      const installed = MiniKit.isInstalled();
      setIsWorldApp(installed);

      if (installed && MiniKit.user.walletAddress) {
        setUserAddress(MiniKit.user.walletAddress);
        if (onAuthSuccess) {
          onAuthSuccess(MiniKit.user.walletAddress);
        }
      }
    };

    checkWorldApp().catch(console.error);
  }, []);

  const handleConnect = async () => {
    try {
      const installed = MiniKit.isInstalled();
      if (!installed) {
        toast({
          title: "World App Required",
          description: "Please open this app in the World App to connect your account",
          variant: "destructive",
        });
        return;
      }

      // Aquí deberías realizar alguna acción como walletAuth, dependiendo de tu flujo
      // Simularemos que ya está conectado MiniKit.user.walletAddress

      if (MiniKit.user.walletAddress) {
        setUserAddress(MiniKit.user.walletAddress);
        toast({
          title: "Connected to World App",
          description: "Successfully connected to your World App account",
        });

        if (onAuthSuccess) {
          onAuthSuccess(MiniKit.user.walletAddress);
        }
      } else {
        toast({
          title: "No address found",
          description: "World App did not return an address",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to World App",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isWorldApp ? (
        userAddress ? (
          <div className="flex flex-col gap-2 p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-700">Connected with Worldcoin</p>
            <p className="text-xs text-green-600 truncate">{userAddress}</p>
          </div>
        ) : (
          <Button onClick={handleConnect} variant="outline" className="flex gap-2">
            Connect with Worldcoin
          </Button>
        )
      ) : null}
    </div>
  );
}
