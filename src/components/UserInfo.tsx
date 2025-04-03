
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from '@/services/api';
import { User as UserType } from '@/services/types';
import { formatCurrency } from '@/lib/formatters';

const UserInfo = () => {
  // Mock user data for direct access without authentication
  const [user] = useState<UserType>({
    id: 'mock-user-id',
    nome: 'Usuário Demo',
    email: 'demo@exemplo.com',
    saldoReais: 10000,
    aporteTotal: 5000
  });
  
  const navigate = useNavigate();
  
  const handleLogout = () => {
    api.logout();
    navigate('/auth');
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 overflow-hidden">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.nome)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {getInitials(user.nome)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-medium leading-none">{user.nome}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Saldo: {formatCurrency(user.saldoReais)}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/configuracoes')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInfo;
