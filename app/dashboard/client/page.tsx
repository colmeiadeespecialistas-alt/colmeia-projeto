"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ClientDashboard() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

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
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
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

  const stats = {
    total: services.length,
    pending: services.filter(s => s.status === 'pending').length,
    in_progress: services.filter(s => s.status === 'in_progress').length,
    completed: services.filter(s => s.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <DashboardHeader
        title="Dashboard do Cliente"
        description="Gerencie suas solicitações de serviço"
      />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Serviços</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pendentes</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Em Andamento</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.in_progress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Concluídos</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>O que você gostaria de fazer?</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/dashboard/client/solicitar">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Solicitar Novo Serviço
              </Button>
            </Link>
            <Link href="/dashboard/client/meus-pedidos">
              <Button size="lg" variant="outline" className="gap-2">
                <Briefcase className="h-5 w-5" />
                Ver Todos os Pedidos
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços Recentes</CardTitle>
            <CardDescription>Acompanhe o status dos seus pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Nenhum serviço solicitado ainda</p>
                  <p className="text-sm text-muted-foreground">
                    Clique em &quot;Solicitar Novo Serviço&quot; para começar
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {services.slice(0, 5).map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{service.service_type}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {service.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(service.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(service.status)}
                      <Button variant="ghost" size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
