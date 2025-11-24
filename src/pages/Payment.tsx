import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registration, setRegistration] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobile-money");
  const [paymentData, setPaymentData] = useState({
    mobileNumber: "",
    transactionRef: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  useEffect(() => {
    loadRegistration();
  }, [id]);

  const loadRegistration = async () => {
    if (!id) return;
    
    try {
      const result = await RegistrationAPI.getRegistrationById(id);

      if (!result.success || !result.data) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données d'inscription",
          variant: "destructive",
        });
        return;
      }

      setRegistration(result.data);
    } catch (error) {
      console.error('Load registration error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'inscription",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentRef = `PAY${Date.now()}`;
      const paymentDate = new Date().toISOString();
      
      // Update payment status via API
      const result = await RegistrationAPI.updatePaymentStatus(id!, {
        paymentStatus: 'completed',
        paymentReference: paymentRef,
        paymentDate: paymentDate
      });

      if (!result.success) {
        throw new Error(result.message || 'Failed to update payment status');
      }

      toast({
        title: "Paiement réussi",
        description: "Votre paiement a été effectué avec succès",
      });

      navigate(`/receipt/${id}`);
    } catch (error: any) {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!registration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Paiement</h1>
            <p className="text-muted-foreground">
              Frais d'inscription: {registration.payment_amount || 25000} FCFA
            </p>
          </div>

          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Candidat</h3>
            <p className="text-sm text-muted-foreground">
              {registration.first_name} {registration.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              Numéro d'inscription: {registration.registration_number}
            </p>
          </div>

          <Tabs defaultValue="mobile-money" onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="mobile-money" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile Money
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Carte Bancaire
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mobile-money" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Numéro de téléphone</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  value={paymentData.mobileNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, mobileNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionRef">Référence de transaction</Label>
                <Input
                  id="transactionRef"
                  placeholder="REF123456"
                  value={paymentData.transactionRef}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Date d'expiration</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/AA"
                    value={paymentData.cardExpiry}
                    onChange={(e) => setPaymentData({ ...paymentData, cardExpiry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input
                    id="cardCvv"
                    placeholder="123"
                    maxLength={3}
                    value={paymentData.cardCvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cardCvv: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            className="w-full mt-6"
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Traitement..." : "Payer maintenant"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Vos informations de paiement sont sécurisées
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
