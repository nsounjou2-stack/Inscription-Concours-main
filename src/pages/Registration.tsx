import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/registration/PersonalInfoForm";
import { AcademicInfoForm } from "@/components/registration/AcademicInfoForm";
import { ParentalInfoForm } from "@/components/registration/ParentalInfoForm";
import { ConfirmationStep } from "@/components/registration/ConfirmationStep";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { registrationSchema, RegistrationFormData } from "@/lib/validation";
import { RegistrationAPI } from "@/lib/api";
import { ZodError } from "zod";
// Remove mysql2 import from client code
// import { insertRegistration } from "@/lib/mysql";

export interface RegistrationData extends RegistrationFormData {
  photoFile: File | null;
}

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      birthPlace: "",
      gender: "M" as const,
      phone: "",
      email: "",
      city: "",
      department: "",
      region: "",
      country: "Cameroun",
      bacDate: "",
      bacSeries: "",
      bacMention: "Passable" as const,
      bacType: "Général" as const,
      bacDiplomaFile: null,
      probDate: "",
      probSeries: "",
      probMention: "Passable" as const,
      probType: "Général" as const,
      probDiplomaFile: null,
      fatherName: "",
      fatherProfession: "",
      fatherPhone: "",
      motherName: "",
      motherProfession: "",
      motherPhone: "",
    },
  });

  const formData = form.watch();
  const updateFormData = (data: Partial<RegistrationData>) => {
    Object.keys(data).forEach(key => {
      form.setValue(key as keyof RegistrationData, data[key as keyof RegistrationData] as any);
    });
  };

  const handleNext = async () => {
    if (step < 4) {
      const isValid = await form.trigger(getStepFields(step));
      if (isValid) {
        setStep(step + 1);
      } else {
        toast({
          title: "Validation Errors",
          description: "Please correct the errors before continuing",
          variant: "destructive",
        });
      }
    }
  };

  const getStepFields = (step: number): (keyof RegistrationData)[] => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "birthDate", "birthPlace", "gender", "phone", "email", "city", "region", "department"];
      case 2:
        return ["bacDate", "bacSeries", "bacMention", "bacType", "probDate", "probSeries", "probMention", "probType"];
      case 3:
        return ["fatherName", "fatherProfession", "fatherPhone", "motherName", "motherProfession", "motherPhone"];
      case 4:
        return []; // Confirmation step doesn't need validation
      default:
        return [];
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      // Check if photo is uploaded
      if (!formData.photoFile) {
        toast({
          title: "Error",
          description: "Please upload a photo",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // For demo purposes, we'll use a placeholder photo URL
      // In production, you would upload the file to a file storage service
      const photoUrl = `/uploads/photos/${Date.now()}_${formData.photoFile.name}`;

      // Prepare data for API insertion
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        gender: formData.gender,
        photoUrl: photoUrl,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        department: formData.department,
        region: formData.region,
        country: formData.country,
        bacDate: formData.bacDate,
        bacSeries: formData.bacSeries,
        bacMention: formData.bacMention,
        bacType: formData.bacType,
        probDate: formData.probDate,
        probSeries: formData.probSeries,
        probMention: formData.probMention,
        probType: formData.probType,
        fatherName: formData.fatherName,
        fatherProfession: formData.fatherProfession,
        fatherPhone: formData.fatherPhone,
        motherName: formData.motherName,
        motherProfession: formData.motherProfession,
        motherPhone: formData.motherPhone,
        guardianName: formData.guardianName,
        guardianRelation: formData.guardianRelation,
        guardianPhone: formData.guardianPhone,
      };

      // Insert using the Registration API
      const result = await RegistrationAPI.createRegistration(registrationData);

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      toast({
        title: "Success",
        description: "Registration saved successfully",
      });

      navigate(`/receipt/${result.id}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => err.message).join(', ');
        toast({
          title: "Validation Errors",
          description: errorMessages,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "An error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Contest Registration 2025
          </h1>
          <p className="text-muted-foreground">
            Please fill in all required fields
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= i
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i}
              </div>
              {i < 4 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all ${
                    step > i ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="p-8 shadow-lg">
          {step === 1 && (
            <PersonalInfoForm control={form.control as any} updateFormData={updateFormData} />
          )}
          {step === 2 && (
            <AcademicInfoForm control={form.control as any} updateFormData={updateFormData} />
          )}
          {step === 3 && (
            <ParentalInfoForm control={form.control as any} updateFormData={updateFormData} />
          )}
          {step === 4 && (
            <ConfirmationStep formData={formData} />
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 4 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Confirm and Submit"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
