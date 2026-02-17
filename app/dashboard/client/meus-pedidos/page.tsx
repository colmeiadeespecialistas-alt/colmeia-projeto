"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Search, Clock, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function MeusPedidosPage() {
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, statusFilter, services]);

  const fetchServices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setServices(data);
        setFilteredServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "warning" as const, icon: Clock },
      in_progress: { label: "Em Andamento", variant: "default" as const, icon: Clock },
      completed: { label: "Concluído", variant: "success" as const, icon: CheckCircle2 },
      cancelled: { label: "Cancelado", variant: "destructive" as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <DashboardHeader
        title="Meus Pedidos"
        description="Acompanhe todos os seus serviços solicitados"
      />

      <div className="container mx-auto px-6 py-8 space-y-6">
        <Link href="/dashboard/client">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por tipo ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sm:w-48"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </Select>
          </CardContent>
        </Card>

        {/* Services List */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              Carregando pedidos...
            </CardContent>
          </Card>
        ) : filteredServices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 space-y-4">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">
                  {services.length === 0
                    ? "Nenhum serviço solicitado ainda"
                    : "Nenhum resultado encontrado"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {services.length === 0
                    ? "Solicite um novo serviço para começar"
                    : "Tente ajustar os filtros de busca"}
                </p>
              </div>
              {services.length === 0 && (
                <Link href="/dashboard/client/solicitar">
                  <Button>Solicitar Serviço</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className="text-base font-medium">
                          {service.service_type}
                        </Badge>
                        {getStatusBadge(service.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(service.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <p className="text-foreground">{service.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {service.location && (
                          <div>
                            <span className="font-medium">Local:</span> {service.location}
                          </div>
                        )}
                        {service.preferred_date && (
                          <div>
                            <span className="font-medium">Data preferencial:</span>{" "}
                            {new Date(service.preferred_date).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      {service.price && (
                        <p className="text-2xl font-bold text-primary">
                          R$ {service.price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        {service.status === 'pending' && (
                          <Button variant="ghost" size="sm">
                            Cancelar
                          </Button>
                        )}
                        {service.status === 'completed' && (
                          <Button size="sm">Avaliar</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && services.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Mostrando {filteredServices.length} de {services.length} pedidos
                </span>
                <div className="flex gap-6">
                  <span>
                    <span className="font-medium">{services.filter(s => s.status === 'pending').length}</span>{" "}
                    pendentes
                  </span>
                  <span>
                    <span className="font-medium">{services.filter(s => s.status === 'completed').length}</span>{" "}
                    concluídos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
