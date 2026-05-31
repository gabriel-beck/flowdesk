"use client";

import { useState } from "react";
import { useClients } from "@/hooks";
import { useClientModal } from "@/hooks/useClientModal";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientModal } from "@/components/clients/ClientModal";
import type { ClientStatus } from "@/types";

type SortableKey = "name" | "lastAppointment" | "totalSpent" | "totalAppointments";

export default function ClientsPage() {
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState<ClientStatus | "all">("all");
  const [page, setPage]       = useState(1);
  const [sortBy, setSortBy]   = useState<SortableKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { clients, isLoading, totalPages, totalCount } = useClients({
    search, status, page, pageSize: 8, sortBy, sortDir,
  });

  const { selectedClient, isOpen, openModal, closeModal } = useClientModal();

  function handleSort(key: SortableKey) {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("asc"); }
    setPage(1);
  }

  return (
    <div>
      <PageHeader title="Clients" />
      <ClientFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        totalCount={totalCount}
      />
      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        search={search}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onClientClick={openModal}
      />
      <ClientModal
        client={selectedClient}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </div>
  );
}
