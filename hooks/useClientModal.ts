"use client";

import { useState, useCallback } from "react";
import type { Client } from "@/types";

interface UseClientModalReturn {
  selectedClient: Client | null;
  isOpen: boolean;
  openModal: (client: Client) => void;
  closeModal: () => void;
}

export function useClientModal(): UseClientModalReturn {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Keep client data while closing animation plays
    setTimeout(() => setSelectedClient(null), 200);
  }, []);

  return { selectedClient, isOpen, openModal, closeModal };
}
