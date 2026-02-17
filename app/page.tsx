import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Zap, Shield, Star, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header/Navbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Colmeia</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
              Como Funciona
            </Link>
            <Link href="#servicos" className="text-sm font-medium hover:text-primary transition-colors">
              Serviços
            </Link>
            <Link href="#especialistas" className="text-sm font-medium hover:text-primary transition-colors">
              Para Especialistas
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="w-fit">Conectando Talentos</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Especialistas para seu
              <span className="text-primary"> lar e empresa</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Encontre profissionais qualificados para eletricista, encanador, pintor, faxina e muito mais.
              Rápido, seguro e com avaliações reais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cadastro?tipo=cliente">
                <Button size="lg" className="w-full sm:w-auto">
                  Solicitar Serviço
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/cadastro?tipo=especialista">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sou Especialista
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">1.200+</p>
                  <p className="text-sm text-muted-foreground">Especialistas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">4.8/5</p>
                  <p className="text-sm text-muted-foreground">Avaliação Média</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative lg:block hidden">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 border">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Eletricista</CardTitle>
                        <CardDescription>Instalação e reparo</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Encanador</CardTitle>
                        <CardDescription>Manutenção hidráulica</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="container mx-auto px-4 py-20 bg-secondary/30 -mx-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">Como Funciona</Badge>
          <h2 className="text-3xl md:text-5xl font-bold">Simples, rápido e seguro</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conectamos você aos melhores profissionais em 3 passos simples
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader>
              <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>1. Solicite o Serviço</CardTitle>
              <CardDescription className="text-base">
                Descreva o que você precisa e receba propostas de especialistas qualificados em minutos
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader>
              <div className="h-14 w-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-blue-500" />
              </div>
              <CardTitle>2. Escolha o Profissional</CardTitle>
              <CardDescription className="text-base">
                Compare perfis, avaliações e preços. Escolha o especialista ideal para você
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader>
              <div className="h-14 w-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-green-500" />
              </div>
              <CardTitle>3. Serviço Garantido</CardTitle>
              <CardDescription className="text-base">
                Acompanhe o progresso e avalie o trabalho. Pagamento seguro e protegido
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Serviços Disponíveis</h2>
          <p className="text-muted-foreground text-lg">
            Profissionais para todas as suas necessidades
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, name: "Eletricista", color: "text-yellow-500" },
            { icon: Wrench, name: "Encanador", color: "text-blue-500" },
            { icon: Wrench, name: "Pintor", color: "text-purple-500" },
            { icon: Wrench, name: "Marceneiro", color: "text-orange-500" },
            { icon: Wrench, name: "Jardineiro", color: "text-green-500" },
            { icon: Wrench, name: "Faxineiro", color: "text-pink-500" },
            { icon: Wrench, name: "Pedreiro", color: "text-red-500" },
            { icon: Wrench, name: "Montador", color: "text-indigo-500" },
          ].map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA For Specialists */}
      <section id="especialistas" className="container mx-auto px-4 py-20 bg-primary/5 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="w-fit mx-auto">Para Especialistas</Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            Aumente sua renda como especialista
          </h2>
          <p className="text-xl text-muted-foreground">
            Receba novos trabalhos todos os dias, defina seus próprios preços e construa sua reputação
          </p>
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="space-y-2">
              <Clock className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Flexibilidade</h3>
              <p className="text-sm text-muted-foreground">Trabalhe quando quiser</p>
            </div>
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Mais Trabalhos</h3>
              <p className="text-sm text-muted-foreground">Clientes todos os dias</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Pagamento Seguro</h3>
              <p className="text-sm text-muted-foreground">Receba com garantia</p>
            </div>
          </div>
          <Link href="/cadastro?tipo=especialista">
            <Button size="lg" className="mt-8">
              Cadastre-se como Especialista
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Colmeia</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Conectando pessoas aos melhores especialistas em serviços residenciais e empresariais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Clientes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/cadastro">Solicitar Serviço</Link></li>
                <li><Link href="/como-funciona">Como Funciona</Link></li>
                <li><Link href="/servicos">Todos os Serviços</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Especialistas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/cadastro?tipo=especialista">Cadastre-se</Link></li>
                <li><Link href="/vantagens">Vantagens</Link></li>
                <li><Link href="/ajuda">Central de Ajuda</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/sobre">Sobre Nós</Link></li>
                <li><Link href="/contato">Contato</Link></li>
                <li><Link href="/privacidade">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Colmeia de Especialistas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
