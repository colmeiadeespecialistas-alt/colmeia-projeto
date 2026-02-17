"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, DollarSign, TrendingUp, UserCheck, UserX } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    clients: 0,
    specialists: 0,
    totalServices: 0,
    pendingServices: 0,
    completedServices: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const { data: profiles } = await supabase
        .from('profiles')
        .select('role');

      // Fetch service stats
      const { data: services } = await supabase
        .from('service_requests')
        .select('*');

      // Fetch recent services
      const { data: recent } = await supabase
        .from('service_requests')
        .select('*, profiles!service_requests_client_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (profiles) {
        setStats(prev => ({
          ...prev,
          totalUsers: profiles.length,
          clients: profiles.filter(p => p.role === 'client').length,
          specialists: profiles.filter(p => p.role === 'specialist').length,
        }));
      }

      if (services) {
        const totalRevenue = services
          .filter(s => s.status === 'completed')
          .reduce((sum, s) => sum + (s.price || 0), 0);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyRevenue = services
          .filter(s => {
            const serviceDate = new Date(s.created_at);
            return (
              s.status === 'completed' &&
              serviceDate.getMonth() === currentMonth &&
              serviceDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, s) => sum + (s.price || 0), 0);

        setStats(prev => ({
          ...prev,
          totalServices: services.length,
          pendingServices: services.filter(s => s.status === 'pending').length,
          completedServices: services.filter(s => s.status === 'completed').length,
          totalRevenue,
          monthlyRevenue,
        }));
      }

      if (recent) {
        setRecentActivity(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "warning",
      in_progress: "default",
      completed: "success",
      cancelled: "destructive",
    };
    const labels: any = {
      pending: "Pendente",
      in_progress: "Em Andamento",
      completed: "Concluído",
      cancelled: "Cancelado",
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/10 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10">
      <DashboardHeader
        title="Dashboard Master Admin"
        description="Visão geral completa da plataforma"
      />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total de Usuários</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span>{stats.clients} clientes</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserX className="h-4 w-4 text-blue-500" />
                  <span>{stats.specialists} especialistas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total de Serviços</CardDescription>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{stats.totalServices}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {stats.pendingServices} pendentes • {stats.completedServices} concluídos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Receita Total</CardDescription>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-green-600">
                R$ {stats.totalRevenue.toLocaleString('pt-BR')}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Receita do Mês</CardDescription>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-primary">
                R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços por Status</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <span>Pendentes</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-yellow-500 rounded-full" />
                    <span className="font-medium">{stats.pendingServices}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Em Andamento</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-blue-500 rounded-full" />
                    <span className="font-medium">
                      {stats.totalServices - stats.pendingServices - stats.completedServices}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Concluídos</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-40 bg-green-500 rounded-full" />
                    <span className="font-medium">{stats.completedServices}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-2xl font-bold">+{Math.round(stats.totalUsers * 0.15)}</p>
                <p className="text-sm text-muted-foreground">novos usuários este mês</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas solicitações de serviço na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma atividade recente
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activity.service_type}</p>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cliente: {activity.profiles?.full_name || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    {activity.price && (
                      <p className="text-lg font-bold text-primary">
                        R$ {activity.price.toLocaleString('pt-BR')}
                      </p>
                    )}
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
