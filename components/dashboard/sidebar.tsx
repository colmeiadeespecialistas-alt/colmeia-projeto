"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Briefcase,
  Clock,
  User,
  LogOut,
  Wrench,
  Users,
  DollarSign,
  Settings,
  BarChart3
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  role: "client" | "specialist" | "admin";
  userName: string;
  userEmail: string;
}

const clientLinks = [
  { href: "/dashboard/client", label: "Início", icon: Home },
  { href: "/dashboard/client/solicitar", label: "Novo Serviço", icon: Briefcase },
  { href: "/dashboard/client/meus-pedidos", label: "Meus Pedidos", icon: Clock },
  { href: "/dashboard/client/perfil", label: "Meu Perfil", icon: User },
];

const specialistLinks = [
  { href: "/dashboard/specialist", label: "Início", icon: Home },
  { href: "/dashboard/specialist/chamados", label: "Chamados Disponíveis", icon: Briefcase },
  { href: "/dashboard/specialist/meus-trabalhos", label: "Meus Trabalhos", icon: Clock },
  { href: "/dashboard/specialist/ganhos", label: "Ganhos", icon: DollarSign },
  { href: "/dashboard/specialist/perfil", label: "Meu Perfil", icon: User },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/dashboard/admin/servicos", label: "Serviços", icon: Briefcase },
  { href: "/dashboard/admin/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/dashboard/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const links = role === "admin" ? adminLinks : role === "specialist" ? specialistLinks : clientLinks;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full border-r bg-card">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Colmeia</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
