import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, CheckCircle } from "lucide-react";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { RegistrationAPI } from "@/lib/api";

const Receipt = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    loadRegistration();
  }, [id]);

  const loadRegistration = async () => {
    if (!id) return;
    
    try {
      const result = await RegistrationAPI.getRegistrationById(id);
      
      if (!result.success || !result.data) {
        toast({
          title: "Error",
          description: "Registration not found",
          variant: "destructive",
        });
        return;
      }

      setRegistration(result.data);
    } catch (error) {
      console.error('Load registration error:', error);
      toast({
        title: "Error",
        description: "Unable to load receipt",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    const receiptElement = document.getElementById("receipt");
    if (!receiptElement) return;

    try {
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`receipt-${registration.registration_number}.pdf`);

      toast({
        title: "Download Successful",
        description: "Your receipt has been downloaded as PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!registration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Registration Successful!
          </h1>
          <p className="text-muted-foreground">
            Here is your registration receipt
          </p>
        </div>

        <Card className="p-8 shadow-lg print:shadow-none" id="receipt">
          <div className="text-center mb-8 border-b pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CU</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              CONCOURS UNIVERSITAIRE 2025
            </h2>
            <p className="text-sm text-muted-foreground">
              Registration Receipt
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="col-span-2 md:col-span-1">
              <img
                src={registration.photo_url}
                alt="Photo du candidat"
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
            </div>
            
            <div className="col-span-2 md:col-span-1 flex items-center justify-center">
              <QRCode
                value={`CONC2025-${registration.id}`}
                size={128}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-semibold text-lg text-primary">
                  {registration.registration_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-semibold">
                  {new Date(registration.created_at).toLocaleDateString('en-US')}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold">
                {registration.first_name} {registration.last_name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-semibold">
                  {new Date(registration.birth_date).toLocaleDateString('en-US')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{registration.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">BAC Series</p>
                <p className="font-semibold">{registration.bac_series}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="font-semibold">{registration.bac_mention}</p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contest Date</p>
                  <p className="font-semibold">
                    {new Date(registration.contest_date).toLocaleDateString('en-US')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{registration.contest_location}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Payment Reference</p>
              <p className="font-semibold">{registration.payment_reference || 'N/A'}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Amount: {registration.payment_amount || 25000} FCFA
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Contest Day Instructions:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Arrive 30 minutes before the exam starts</li>
              <li>Bring this printed receipt</li>
              <li>Bring a valid ID</li>
              <li>Bring your materials (pens, calculator, etc.)</li>
            </ul>
          </div>
        </Card>

        <div className="flex gap-4 mt-6 print:hidden">
          <Button onClick={handleDownloadPDF} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
