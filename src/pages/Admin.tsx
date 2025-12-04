import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Users, DollarSign, LogOut, Settings, Edit, CheckCircle, XCircle, BarChart3, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RegistrationAPI } from "@/lib/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dashboard state
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [bacSeriesFilter, setBacSeriesFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Payment management state
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Contest settings state
  const [contestDate, setContestDate] = useState("");
  const [contestLocation, setContestLocation] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");

  // Bulk operations state
  const [selectedRegistrations, setSelectedRegistrations] = useState<number[]>([]);

  const handleLogout = async () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("admin_email");
    navigate("/simple-admin-login");
  };

  const handleUpdatePaymentStatus = () => {
    if (!selectedRegistration) return;

    updatePaymentStatusMutation.mutate({
      id: selectedRegistration.id,
      status: paymentStatus,
      amount: paymentAmount ? parseInt(paymentAmount) : undefined,
    });
  };

  const handleUpdateContestSettings = () => {
    updateContestSettingsMutation.mutate({
      contest_date: contestDate || undefined,
      contest_location: contestLocation || undefined,
      payment_amount: registrationFee ? parseInt(registrationFee) : undefined,
    });
  };

  const handleBulkStatusUpdate = (status: string) => {
    selectedRegistrations.forEach(id => {
      updatePaymentStatusMutation.mutate({
        id,
        status: status as "pending" | "completed" | "failed",
      });
    });
    setSelectedRegistrations([]);
  };

  const toggleRegistrationSelection = (id: number) => {
    setSelectedRegistrations(prev =>
      prev.includes(id)
        ? prev.filter(regId => regId !== id)
        : [...prev, id]
    );
  };

  // Query to fetch all registrations
  const { data: registrations = [], isLoading, error: queryError } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const result = await RegistrationAPI.getRegistrations();
      return result.data || [];
    },
    retry: (failureCount, error: any) => {
      return failureCount < 2;
    },
  });

  // Query for statistics
  const { data: stats } = useQuery({
    queryKey: ["registration-stats"],
    queryFn: async () => {
      const data = await RegistrationAPI.getRegistrationStats();
      return data;
    },
  });

  // Mutations
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status, amount }: { id: number; status: "pending" | "completed" | "failed"; amount?: number }) => {
      const result = await RegistrationAPI.updatePaymentStatus(id.toString(), {
        paymentStatus: status,
        paymentAmount: amount,
        paymentDate: status === "completed" ? new Date().toISOString() : undefined,
      });
      if (!result.success) {
        throw new Error(result.message || 'Failed to update payment status');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registration-stats"] });
      toast({
        title: "Succès",
        description: "Statut de paiement mis à jour",
      });
      setSelectedRegistration(null);
    },
    onError: (error) => {
      console.error('Update payment error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de paiement",
        variant: "destructive",
      });
    },
  });

  const updateContestSettingsMutation = useMutation({
    mutationFn: async (settings: { contest_date?: string; contest_location?: string; payment_amount?: number }) => {
      const result = await RegistrationAPI.updateContestSettings(settings);
      if (!result.success) {
        throw new Error(result.message || 'Failed to update contest settings');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({
        title: "Succès",
        description: "Paramètres du concours mis à jour",
      });
    },
  });

  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];

    return registrations.filter((reg: any) => {
      const matchesSearch =
        reg.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.registration_number?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion = !regionFilter || regionFilter === "all" || reg.region === regionFilter;
      const matchesGender = !genderFilter || genderFilter === "all" || reg.gender === genderFilter;
      const matchesBacSeries = !bacSeriesFilter || bacSeriesFilter === "all" || reg.bac_series === bacSeriesFilter;
      const matchesPaymentStatus = !paymentStatusFilter || paymentStatusFilter === "all" || reg.payment_status === paymentStatusFilter;

      return matchesSearch && matchesRegion && matchesGender && matchesBacSeries && matchesPaymentStatus;
    });
  }, [registrations, searchTerm, regionFilter, genderFilter, bacSeriesFilter, paymentStatusFilter]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRegistrations.map((reg: any) => ({
      "Numéro d'inscription": reg.registration_number,
      "Prénom": reg.first_name,
      "Nom": reg.last_name,
      "Date de naissance": reg.birth_date,
      "Lieu de naissance": reg.birth_place,
      "Genre": reg.gender === "M" ? "Masculin" : "Féminin",
      "Téléphone": reg.phone,
      "Email": reg.email,
      "Ville": reg.city,
      "Département": reg.department,
      "Région": reg.region,
      "Pays": reg.country,
      "Date BAC": reg.bac_date,
      "Série BAC": reg.bac_series,
      "Mention BAC": reg.bac_mention,
      "Type BAC": reg.bac_type,
      "Centre examen BAC": reg.bac_exam_center || "N/A",
      "Date Probatoire": reg.prob_date,
      "Série Probatoire": reg.prob_series,
      "Mention Probatoire": reg.prob_mention,
      "Type Probatoire": reg.prob_type,
      "Centre examen Probatoire": reg.prob_exam_center || "N/A",
      "Nom du père": reg.father_name,
      "Profession du père": reg.father_profession || "Non renseigné",
      "Téléphone du père": reg.father_phone || "Non renseigné",
      "Nom de la mère": reg.mother_name,
      "Profession de la mère": reg.mother_profession || "Non renseigné",
      "Téléphone de la mère": reg.mother_phone || "Non renseigné",
      "Tuteur légal": reg.legal_guardian_name || "Non applicable",
      "Relation tuteur": reg.legal_guardian_relation || "Non applicable",
      "Téléphone tuteur": reg.legal_guardian_phone || "Non applicable",
      "Statut": reg.status || "soumis",
      "Statut paiement": reg.payment_status,
      "Référence paiement": reg.payment_reference || "Non défini",
      "Montant payé": reg.payment_amount || 25000,
      "Date paiement": reg.payment_date || "Non payé",
      "Méthode paiement": reg.payment_method || "Non défini",
      "Date création": reg.created_at,
      "Date mise à jour": reg.updated_at,
    })));
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 18 }, // Numéro d'inscription
      { wch: 15 }, // Prénom
      { wch: 15 }, // Nom
      { wch: 12 }, // Date de naissance
      { wch: 15 }, // Lieu de naissance
      { wch: 10 }, // Genre
      { wch: 15 }, // Téléphone
      { wch: 25 }, // Email
      { wch: 15 }, // Ville
      { wch: 15 }, // Département
      { wch: 15 }, // Région
      { wch: 12 }, // Pays
      { wch: 12 }, // Date BAC
      { wch: 10 }, // Série BAC
      { wch: 12 }, // Mention BAC
      { wch: 12 }, // Type BAC
      { wch: 18 }, // Centre examen BAC
      { wch: 12 }, // Date Probatoire
      { wch: 12 }, // Série Probatoire
      { wch: 12 }, // Mention Probatoire
      { wch: 15 }, // Type Probatoire
      { wch: 18 }, // Centre examen Probatoire
      { wch: 20 }, // Nom du père
      { wch: 18 }, // Profession du père
      { wch: 15 }, // Téléphone du père
      { wch: 20 }, // Nom de la mère
      { wch: 18 }, // Profession de la mère
      { wch: 15 }, // Téléphone de la mère
      { wch: 20 }, // Tuteur légal
      { wch: 15 }, // Relation tuteur
      { wch: 15 }, // Téléphone tuteur
      { wch: 12 }, // Statut
      { wch: 15 }, // Statut paiement
      { wch: 18 }, // Référence paiement
      { wch: 12 }, // Montant payé
      { wch: 15 }, // Date paiement
      { wch: 15 }, // Méthode paiement
      { wch: 18 }, // Date création
      { wch: 18 }, // Date mise à jour
    ];
    worksheet['!cols'] = colWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscriptions Complètes");
    XLSX.writeFile(workbook, `inscriptions_completes_${new Date().toLocaleDateString()}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape'); // Landscape format
    
    // Colors
    const primaryColor = [41, 128, 185]; // Blue
    const secondaryColor = [52, 152, 219]; // Light blue
    const accentColor = [46, 204, 113]; // Green
    const textColor = [44, 62, 80]; // Dark gray
    const lightGray = [236, 240, 241]; // Light gray
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 297, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LISTE DES INSCRIPTIONS - CONCOURS', 148, 17, { align: 'center' });
    
    // Subheader with statistics
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total: ${filteredRegistrations.length} candidats | Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 148, 22, { align: 'center' });
    
    // Table headers
    const startY = 35;
    const rowHeight = 8;
    const colWidths = [25, 20, 18, 18, 22, 18, 15, 15, 20, 15, 18, 15, 25, 20];
    const headers = [
      'Numéro',
      'Prénom',
      'Nom',
      'Téléphone',
      'Email',
      'Région',
      'Dépt',
      'Série',
      'BAC Date',
      'Mention',
      'Statut',
      'Montant',
      'Paiement',
      'Créé le'
    ];
    
    let currentY = startY;
    
    // Table header background
    doc.setFillColor(...secondaryColor);
    doc.rect(10, currentY - 3, 277, 10, 'F');
    
    // Table header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    let currentX = 12;
    headers.forEach((header, index) => {
      doc.text(header, currentX + colWidths[index]/2, currentY + 3, { align: 'center' });
      currentX += colWidths[index];
    });
    
    currentY += 12;
    
    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.setFontSize(8);
    
    filteredRegistrations.forEach((reg: any, index) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(...lightGray);
        doc.rect(10, currentY - 2, 277, rowHeight, 'F');
      }
      
      let rowX = 12;
      const rowData = [
        reg.registration_number || '',
        reg.first_name || '',
        reg.last_name || '',
        reg.phone || '',
        reg.email || '',
        reg.region || '',
        reg.department || '',
        reg.bac_series || '',
        reg.bac_date ? new Date(reg.bac_date).toLocaleDateString('fr-FR') : '',
        reg.bac_mention || '',
        (reg.payment_status === 'completed' ? 'PAYÉ' : 
         reg.payment_status === 'pending' ? 'ATTENTE' : 
         reg.payment_status === 'failed' ? 'ÉCHOUÉ' : reg.payment_status || ''),
        `${reg.payment_amount || 25000} FCFA`,
        (reg.payment_status === 'completed' ? '✓ ' : '') + 
        (reg.payment_date ? new Date(reg.payment_date).toLocaleDateString('fr-FR') : 'Non payé'),
        reg.created_at ? new Date(reg.created_at).toLocaleDateString('fr-FR') : ''
      ];
      
      // Status color coding
      if (reg.payment_status === 'completed') {
        doc.setTextColor(46, 204, 113); // Green
      } else if (reg.payment_status === 'pending') {
        doc.setTextColor(241, 196, 15); // Yellow
      } else if (reg.payment_status === 'failed') {
        doc.setTextColor(231, 76, 60); // Red
      } else {
        doc.setTextColor(...textColor); // Default
      }
      
      rowData.forEach((cellData, colIndex) => {
        doc.text(String(cellData), rowX + colWidths[colIndex]/2, currentY + 4, { align: 'center' });
        rowX += colWidths[colIndex];
      });
      
      // Reset text color for next row
      doc.setTextColor(...textColor);
      
      currentY += rowHeight;
      
      // Page break
      if (currentY > 180) {
        doc.addPage('landscape');
        
        // Add header to new page
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 297, 15, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('LISTE DES INSCRIPTIONS - CONCOURS (suite)', 148, 10, { align: 'center' });
        
        currentY = 25;
        
        // Repeat header row
        doc.setFillColor(...secondaryColor);
        doc.rect(10, currentY - 3, 277, 10, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        
        let headerX = 12;
        headers.forEach((header, index) => {
          doc.text(header, headerX + colWidths[index]/2, currentY + 3, { align: 'center' });
          headerX += colWidths[index];
        });
        
        currentY += 12;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...textColor);
        doc.setFontSize(8);
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} sur ${pageCount} - Système d'inscription aux concours`, 148, 200, { align: 'center' });
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 148, 205, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`liste_inscriptions_concours_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`);
  };

  const uniqueRegions = useMemo(() => {
    if (!registrations) return [];
    return [...new Set(registrations.map((r: any) => r.region).filter(Boolean))] as string[];
  }, [registrations]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Chargement des données...</p>
      </div>
    </div>
  );

  if (queryError) {
    console.error("Query error:", queryError);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Erreur de chargement</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                Impossible de charger les données d'inscription. Veuillez vérifier la connexion à la base de données.
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Réessayer
              </Button>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Espace Administrateur</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nombre d'inscrits</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_registrations || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Montant collecté</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats?.total_collected || 0).toLocaleString()} FCFA</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending_payments || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats?.total_registrations || 0) > 0
                    ? Math.round(((stats?.completed_payments || 0) / (stats?.total_registrations || 1)) * 100)
                    : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Filtres et Recherche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Rechercher par nom, email ou numéro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    {uniqueRegions.map((region: string) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={bacSeriesFilter} onValueChange={setBacSeriesFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Série BAC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="completed">Complété</SelectItem>
                    <SelectItem value="failed">Échoué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportToExcel} variant="outline" className="bg-green-50 hover:bg-green-100">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter Excel Complet
                </Button>
                <Button onClick={exportToPDF} variant="outline" className="bg-blue-50 hover:bg-blue-100">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter PDF Stylisé
                </Button>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                💡 <strong>Excel:</strong> Informations complètes avec données personnelles, académiques et familiales<br/>
                💡 <strong>PDF:</strong> Format paysage avec tableau stylisé, codes couleurs et en-têtes élégants
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des candidats ({filteredRegistrations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Série BAC</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg: any) => (
                    <TableRow key={reg.id}>
                      <TableCell>{reg.registration_number}</TableCell>
                      <TableCell>{reg.first_name} {reg.last_name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.region}</TableCell>
                      <TableCell>{reg.department}</TableCell>
                      <TableCell>{reg.bac_series}</TableCell>
                      <TableCell>
                        <Badge variant={reg.payment_status === "completed" ? "default" : "secondary"}>
                          {reg.payment_status === "completed" ? "Payé" :
                           reg.payment_status === "pending" ? "En attente" : "Échoué"}
                        </Badge>
                      </TableCell>
                      <TableCell>{reg.payment_amount || 25000} FCFA</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRegistration(reg);
                                setPaymentStatus(reg.payment_status || "pending");
                                setPaymentAmount(reg.payment_amount?.toString() || "");
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier le paiement</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Candidat</Label>
                                <p className="text-sm text-muted-foreground">
                                  {reg.first_name} {reg.last_name} - {reg.registration_number}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="payment-status">Statut du paiement</Label>
                                <Select value={paymentStatus} onValueChange={(value: any) => setPaymentStatus(value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="completed">Complété</SelectItem>
                                    <SelectItem value="failed">Échoué</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="payment-amount">Montant (FCFA)</Label>
                                <Input
                                  id="payment-amount"
                                  type="number"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder="Montant du paiement"
                                />
                              </div>
                              <Button
                                onClick={handleUpdatePaymentStatus}
                                disabled={updatePaymentStatusMutation.isPending}
                                className="w-full"
                              >
                                {updatePaymentStatusMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Paiements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => handleBulkStatusUpdate("completed")}
                  disabled={selectedRegistrations.length === 0}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marquer comme payé ({selectedRegistrations.length})
                </Button>
                <Button
                  onClick={() => handleBulkStatusUpdate("failed")}
                  disabled={selectedRegistrations.length === 0}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Marquer comme échoué ({selectedRegistrations.length})
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Sélectionnez les candidats dans l'onglet Dashboard pour effectuer des opérations groupées.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Concours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contest-date">Date du concours</Label>
                  <Input
                    id="contest-date"
                    type="date"
                    value={contestDate}
                    onChange={(e) => setContestDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contest-location">Lieu du concours</Label>
                  <Input
                    id="contest-location"
                    value={contestLocation}
                    onChange={(e) => setContestLocation(e.target.value)}
                    placeholder="Ex: Université de Yaoundé"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration-fee">Frais d'inscription (FCFA)</Label>
                  <Input
                    id="registration-fee"
                    type="number"
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(e.target.value)}
                    placeholder="Ex: 50000"
                  />
                </div>
              </div>
              <Button
                onClick={handleUpdateContestSettings}
                disabled={updateContestSettingsMutation.isPending}
              >
                {updateContestSettingsMutation.isPending ? "Mise à jour..." : "Mettre à jour les paramètres"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par région</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {uniqueRegions.slice(0, 5).map((region: string) => {
                    const count = registrations?.filter((r: any) => r.region === region).length || 0;
                    return (
                      <div key={region} className="flex justify-between">
                        <span className="text-sm">{region}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par série BAC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["A", "C", "D", "E"].map(series => {
                    const count = registrations?.filter((r: any) => r.bac_series === series).length || 0;
                    return (
                      <div key={series} className="flex justify-between">
                        <span className="text-sm">Série {series}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statut des paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Complétés</span>
                    <span className="text-sm font-medium text-green-600">
                      {stats?.completed_payments || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">En attente</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {stats?.pending_payments || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Échoués</span>
                    <span className="text-sm font-medium text-red-600">
                      {stats?.failed_payments || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;