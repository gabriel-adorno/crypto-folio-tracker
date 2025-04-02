
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";
import { toast } from "sonner";

const MoneyTransactionForm = () => {
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const user = await api.getUser();
        setUserBalance(user.saldoReais);
      } catch (error) {
        console.error("Erro ao buscar saldo do usuário:", error);
        toast.error("Erro ao carregar saldo atual");
      }
    };
    
    fetchUserBalance();
  }, []);
  
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(depositAmount);
    
    if (!depositAmount || amount <= 0) {
      toast.error("Informe um valor válido para depósito");
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await api.deposit(amount);
      setUserBalance(user.saldoReais);
      setDepositAmount("");
    } catch (error) {
      console.error("Erro ao realizar depósito:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    
    if (!withdrawAmount || amount <= 0) {
      toast.error("Informe um valor válido para saque");
      return;
    }
    
    if (amount > userBalance) {
      toast.error("Saldo insuficiente para saque");
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await api.withdraw(amount);
      setUserBalance(user.saldoReais);
      setWithdrawAmount("");
    } catch (error) {
      console.error("Erro ao realizar saque:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center">Saldo Disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center">
            {formatCurrency(userBalance)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <Tabs defaultValue="deposit">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="deposit">Depósito</TabsTrigger>
            <TabsTrigger value="withdraw">Saque</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit">
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Fundos</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Valor a depositar (R$)</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    placeholder="0,00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    step="any"
                    min="0"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !depositAmount || parseFloat(depositAmount) <= 0}
                >
                  {loading ? "Processando..." : "Depositar"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="withdraw">
            <CardHeader>
              <CardTitle className="text-lg">Sacar Fundos</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount">Valor a sacar (R$)</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="0,00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    step="any"
                    min="0"
                    max={userBalance}
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    Máximo disponível para saque: {formatCurrency(userBalance)}
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    loading || 
                    !withdrawAmount || 
                    parseFloat(withdrawAmount) <= 0 || 
                    parseFloat(withdrawAmount) > userBalance
                  }
                >
                  {loading ? "Processando..." : "Sacar"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default MoneyTransactionForm;
