
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from '@/services/api';
import { User as UserType } from '@/services/types';

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
    <div className="px-3 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2 px-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{user.nome}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserInfo;
