import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationData } from "@/pages/Registration";
import { Control, useController } from "react-hook-form";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParentalInfoFormProps {
  control: Control<RegistrationData>;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

export const ParentalInfoForm = ({ control }: ParentalInfoFormProps) => {
  const fatherNameController = useController({ name: "fatherName", control });
  const fatherProfessionController = useController({ name: "fatherProfession", control });
  const fatherPhoneController = useController({ name: "fatherPhone", control });
  const motherNameController = useController({ name: "motherName", control });
  const motherProfessionController = useController({ name: "motherProfession", control });
  const motherPhoneController = useController({ name: "motherPhone", control });
  const guardianNameController = useController({ name: "guardianName", control });
  const guardianRelationController = useController({ name: "guardianRelation", control });
  const guardianPhoneController = useController({ name: "guardianPhone", control });

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Parental Information</h2>
        <p className="text-muted-foreground">Step 3 of 3</p>
      </div>

      {/* Father */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Father</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fatherName">Full Name *</Label>
            <div className="relative">
              <Input
                id="fatherName"
                {...fatherNameController.field}
                className={cn(
                  fatherNameController.fieldState.isTouched && fatherNameController.fieldState.error
                    ? "border-red-500"
                    : fatherNameController.fieldState.isTouched && !fatherNameController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {fatherNameController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {fatherNameController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {fatherNameController.fieldState.error && (
              <p className="text-sm text-red-500">{fatherNameController.fieldState.error.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherProfession">Occupation</Label>
            <div className="relative">
              <Input
                id="fatherProfession"
                {...fatherProfessionController.field}
                className={cn(
                  fatherProfessionController.fieldState.isTouched && fatherProfessionController.fieldState.error
                    ? "border-red-500"
                    : fatherProfessionController.fieldState.isTouched && !fatherProfessionController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {fatherProfessionController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {fatherProfessionController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {fatherProfessionController.fieldState.error && (
              <p className="text-sm text-red-500">{fatherProfessionController.fieldState.error.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherPhone">Phone</Label>
            <div className="relative">
              <Input
                id="fatherPhone"
                type="tel"
                {...fatherPhoneController.field}
                placeholder="+237 6XX XXX XXX"
                className={cn(
                  fatherPhoneController.fieldState.isTouched && fatherPhoneController.fieldState.error
                    ? "border-red-500"
                    : fatherPhoneController.fieldState.isTouched && !fatherPhoneController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {fatherPhoneController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {fatherPhoneController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {fatherPhoneController.fieldState.error && (
              <p className="text-sm text-red-500">{fatherPhoneController.fieldState.error.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mother */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Mother</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="motherName">Full Name *</Label>
            <div className="relative">
              <Input
                id="motherName"
                {...motherNameController.field}
                className={cn(
                  motherNameController.fieldState.isTouched && motherNameController.fieldState.error
                    ? "border-red-500"
                    : motherNameController.fieldState.isTouched && !motherNameController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {motherNameController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {motherNameController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {motherNameController.fieldState.error && (
              <p className="text-sm text-red-500">{motherNameController.fieldState.error.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherProfession">Occupation</Label>
            <div className="relative">
              <Input
                id="motherProfession"
                {...motherProfessionController.field}
                className={cn(
                  motherProfessionController.fieldState.isTouched && motherProfessionController.fieldState.error
                    ? "border-red-500"
                    : motherProfessionController.fieldState.isTouched && !motherProfessionController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {motherProfessionController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {motherProfessionController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {motherProfessionController.fieldState.error && (
              <p className="text-sm text-red-500">{motherProfessionController.fieldState.error.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherPhone">Phone</Label>
            <div className="relative">
              <Input
                id="motherPhone"
                type="tel"
                {...motherPhoneController.field}
                placeholder="+237 6XX XXX XXX"
                className={cn(
                  motherPhoneController.fieldState.isTouched && motherPhoneController.fieldState.error
                    ? "border-red-500"
                    : motherPhoneController.fieldState.isTouched && !motherPhoneController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {motherPhoneController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {motherPhoneController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {motherPhoneController.fieldState.error && (
              <p className="text-sm text-red-500">{motherPhoneController.fieldState.error.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Legal Guardian (optional) */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Legal Guardian (if applicable)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="guardianName">Full Name</Label>
            <div className="relative">
              <Input
                id="guardianName"
                {...guardianNameController.field}
                className={cn(
                  guardianNameController.fieldState.isTouched && guardianNameController.fieldState.error
                    ? "border-red-500"
                    : guardianNameController.fieldState.isTouched && !guardianNameController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {guardianNameController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {guardianNameController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {guardianNameController.fieldState.error && (
              <p className="text-sm text-red-500">{guardianNameController.fieldState.error.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianRelation">Relationship</Label>
            <div className="relative">
              <Input
                id="guardianRelation"
                {...guardianRelationController.field}
                className={cn(
                  guardianRelationController.fieldState.isTouched && guardianRelationController.fieldState.error
                    ? "border-red-500"
                    : guardianRelationController.fieldState.isTouched && !guardianRelationController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {guardianRelationController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {guardianRelationController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {guardianRelationController.fieldState.error && (
              <p className="text-sm text-red-500">{guardianRelationController.fieldState.error.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Phone</Label>
            <div className="relative">
              <Input
                id="guardianPhone"
                type="tel"
                {...guardianPhoneController.field}
                placeholder="+237 6XX XXX XXX"
                className={cn(
                  guardianPhoneController.fieldState.isTouched && guardianPhoneController.fieldState.error
                    ? "border-red-500"
                    : guardianPhoneController.fieldState.isTouched && !guardianPhoneController.fieldState.error
                    ? "border-green-500"
                    : ""
                )}
              />
              {guardianPhoneController.fieldState.isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {guardianPhoneController.fieldState.error ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {guardianPhoneController.fieldState.error && (
              <p className="text-sm text-red-500">{guardianPhoneController.fieldState.error.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
