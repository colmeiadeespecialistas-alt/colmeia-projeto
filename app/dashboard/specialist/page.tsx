"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, DollarSign, Star, TrendingUp, MapPin, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SpecialistDashboard() {
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch available jobs
      const { data: available } = await supabase
        .from('service_requests')
        .select('*')
        .eq('status', 'pending')
        .is('specialist_id', null)
        .order('created_at', { ascending: false });

      // Fetch my accepted jobs
      const { data: accepted } = await supabase
        .from('service_requests')
        .select('*')
        .eq('specialist_id', user.id)
        .order('created_at', { ascending: false });

      setAvailableJobs(available || []);
      setMyJobs(accepted || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('service_requests')
        .update({
          specialist_id: user.id,
          status: 'in_progress',
        })
        .eq('id', jobId);

      if (!error) {
        fetchData();
      }
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const stats = {
    available: availableJobs.length,
    in_progress: myJobs.filter(j => j.status === 'in_progress').length,
    completed: myJobs.filter(j => j.status === 'completed').length,
    earnings: myJobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + (j.price || 0), 0),
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <DashboardHeader
        title="Dashboard do Especialista"
        description="Gerencie seus trabalhos e ganhos"
      />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Chamados Disponíveis</CardDescription>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">{stats.available}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Em Andamento</CardDescription>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-blue-600">{stats.in_progress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Concluídos</CardDescription>
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Ganhos Totais</CardDescription>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl text-primary">
                R$ {stats.earnings.toLocaleString('pt-BR')}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Desempenho
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <p className="text-2xl font-bold">4.8</p>
                <span className="text-sm text-muted-foreground">(32 avaliações)</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-2xl font-bold mt-2">96%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio de Resposta</p>
              <p className="text-2xl font-bold mt-2">2h</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados Disponíveis</CardTitle>
            <CardDescription>Novos trabalhos na sua área</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : availableJobs.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Nenhum chamado disponível no momento</p>
                  <p className="text-sm text-muted-foreground">
                    Novos trabalhos aparecerão aqui quando estiverem disponíveis
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">{job.service_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(job.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="font-medium">{job.description}</p>
                        {job.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                        )}
                        {job.price && (
                          <p className="text-lg font-bold text-primary">
                            R$ {job.price.toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button onClick={() => handleAcceptJob(job.id)}>
                          Aceitar Trabalho
                        </Button>
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Jobs in Progress */}
        {myJobs.filter(j => j.status === 'in_progress').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Trabalhos em Andamento</CardTitle>
              <CardDescription>Serviços que você está executando</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myJobs.filter(j => j.status === 'in_progress').map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <Badge variant="default">{job.service_type}</Badge>
                        <p className="font-medium">{job.description}</p>
                        {job.price && (
                          <p className="text-lg font-bold text-primary">
                            R$ {job.price.toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <Button variant="outline">Marcar como Concluído</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
