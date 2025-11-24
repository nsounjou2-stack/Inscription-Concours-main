import { RegistrationData } from "@/pages/Registration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, GraduationCap, Heart, MapPin, Calendar, Phone, Mail, Briefcase } from "lucide-react";

interface ConfirmationStepProps {
  formData: RegistrationData;
}

export const ConfirmationStep = ({ formData }: ConfirmationStepProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const formatGender = (gender: string) => {
    return gender === 'M' ? 'Male' : 'Female';
  };

  const renderField = (label: string, value: string | null | undefined, icon?: React.ReactNode) => (
    <div className="flex items-center gap-3">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "Not specified"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Information Confirmation</h2>
        <p className="text-muted-foreground">Step 4 of 4 - Verify your data before submission</p>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Last Name", formData.lastName)}
              {renderField("First Name(s)", formData.firstName)}
              {renderField("Date of Birth", formatDate(formData.birthDate), <Calendar className="w-4 h-4" />)}
              {renderField("Place of Birth", formData.birthPlace, <MapPin className="w-4 h-4" />)}
              {renderField("Gender", formatGender(formData.gender))}
              {renderField("Phone", formData.phone, <Phone className="w-4 h-4" />)}
              {renderField("Email", formData.email, <Mail className="w-4 h-4" />)}
              {renderField("City", formData.city)}
              {renderField("Region", formData.region)}
              {renderField("Department", formData.department)}
            </div>
            
            {/* Photo Preview */}
            {formData.photoFile && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">ID Photo</p>
                <Badge variant="outline" className="text-green-600">
                  ✓ Photo uploaded: {(formData.photoFile as File)?.name}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Information - Baccalauréat */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Baccalauréat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Date Obtained", formatDate(formData.bacDate))}
              {renderField("Series", formData.bacSeries)}
              {renderField("Grade", formData.bacMention)}
              {renderField("Type", formData.bacType)}
            </div>
            
            {formData.bacDiplomaFile && (
              <div className="pt-2">
                <Badge variant="outline" className="text-green-600">
                  ✓ Diploma/Transcript uploaded: {(formData.bacDiplomaFile as File)?.name}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Information - Probatoire */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Probatoire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Date Obtained", formatDate(formData.probDate))}
              {renderField("Series", formData.probSeries)}
              {renderField("Grade", formData.probMention)}
              {renderField("Type", formData.probType)}
            </div>
            
            {formData.probDiplomaFile && (
              <div className="pt-2">
                <Badge variant="outline" className="text-green-600">
                  ✓ Diploma/Transcript uploaded: {(formData.probDiplomaFile as File)?.name}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parental Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Parental Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Father */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Father</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField("Full Name", formData.fatherName)}
                {renderField("Occupation", formData.fatherProfession, <Briefcase className="w-4 h-4" />)}
                {renderField("Phone", formData.fatherPhone, <Phone className="w-4 h-4" />)}
              </div>
            </div>

            <Separator />

            {/* Mother */}
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Mother</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField("Full Name", formData.motherName)}
                {renderField("Occupation", formData.motherProfession, <Briefcase className="w-4 h-4" />)}
                {renderField("Phone", formData.motherPhone, <Phone className="w-4 h-4" />)}
              </div>
            </div>

            {/* Legal Guardian */}
            {formData.guardianName && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Legal Guardian</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField("Full Name", formData.guardianName)}
                    {renderField("Relationship", formData.guardianRelation)}
                    {renderField("Phone", formData.guardianPhone, <Phone className="w-4 h-4" />)}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Carefully verify all the information above. 
          Once the registration is submitted, you will receive an electronic receipt at your email address.
        </p>
      </div>
    </div>
  );
};