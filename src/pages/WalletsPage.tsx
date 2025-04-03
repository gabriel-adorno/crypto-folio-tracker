
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import WalletCard from "@/components/Portfolio/WalletCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import api, { Wallet } from "@/services/api";

const WalletsPage = () => {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const data = await api.getWallets();
        setWallets(data);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  return (
    <Layout title="Carteiras">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Carteiras</h1>
          <p className="text-muted-foreground">
            Gerencie suas carteiras de criptomoedas
          </p>
        </div>
        <Button asChild>
          <Link to="/carteiras/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova Carteira
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      ) : wallets.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Você ainda não tem carteiras</h2>
          <p className="text-muted-foreground mb-6">
            Crie sua primeira carteira para começar a gerenciar seus investimentos
          </p>
          <Button asChild>
            <Link to="/carteiras/nova">
              <Plus className="h-4 w-4 mr-2" />
              Criar Carteira
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default WalletsPage;
