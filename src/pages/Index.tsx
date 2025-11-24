import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, FileText, CreditCard, Download, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            University Contest Registration <br />2025
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Register online securely and receive your receipt instantly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8"
              onClick={() => navigate("/registration")}
            >
              Register Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8"
              onClick={() => navigate("/simple-admin-login")}
            >
              Admin Area
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple and Fast Registration Process
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Registration Form</h3>
              <p className="text-muted-foreground">
                Fill in your personal, academic and parental information in minutes
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <CreditCard className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Secure Payment</h3>
              <p className="text-muted-foreground">
                Pay your registration fees via Mobile Money or credit card securely
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Download className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Instant Receipt</h3>
              <p className="text-muted-foreground">
                Download and print your receipt with QR verification code
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Important Information</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contest Date: December 15, 2025</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Registration Fee: 25,000 FCFA</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Required Documents: ID photo, BAC and Probatoire information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>The registration receipt is mandatory on contest day</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to register?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            The process takes only a few minutes
          </p>
          <Button
            size="lg"
            className="text-lg px-8"
            onClick={() => navigate("/registration")}
          >
            Start Registration
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
