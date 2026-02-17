"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const serviceTypes = [
  "Eletricista",
  "Encanador",
  "Pintor",
  "Marceneiro",
  "Jardineiro",
  "Faxineiro",
  "Pedreiro",
  "Montador de Móveis",
  "Dedetização",
  "Ar Condicionado",
  "Chaveiro",
  "Vidraceiro",
  "Outro",
];

export default function SolicitarServicoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    service_type: "",
    description: "",
    location: "",
    price: "",
    preferred_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error: insertError } = await supabase
        .from('service_requests')
        .insert([
          {
            client_id: user.id,
            service_type: formData.service_type,
            description: formData.description,
            location: formData.location,
            price: formData.price ? parseFloat(formData.price) : null,
            preferred_date: formData.preferred_date || null,
            status: 'pending',
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/client');
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Erro ao criar solicitação");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <DashboardHeader
        title="Solicitar Novo Serviço"
        description="Descreva o serviço que você precisa"
      />

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <Link href="/dashboard/client">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Serviço</CardTitle>
            <CardDescription>
              Preencha os detalhes para que os especialistas possam entender sua necessidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-green-600">
                    Solicitação criada com sucesso!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Redirecionando para o dashboard...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service_type">
                    Tipo de Serviço <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Selecione um serviço</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descrição do Serviço <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva detalhadamente o que você precisa..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Seja específico para receber propostas mais precisas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Localização <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Cidade, Bairro"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Orçamento Estimado (R$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">Opcional</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_date">Data Preferencial</Label>
                    <Input
                      id="preferred_date"
                      name="preferred_date"
                      type="date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-muted-foreground">Opcional</p>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
                  <Link href="/dashboard/client" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
