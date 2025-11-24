import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "@/components/ui/simple-select";
import { RegistrationData } from "@/pages/Registration";
import { Upload, Check, X } from "lucide-react";
import { useRef, useMemo } from "react";
import { Control, useController, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CAMEROON_REGIONS, CAMEROON_DEPARTMENTS, CAMEROON_ARRONDISSEMENTS } from "@/lib/cameroon-data";

interface PersonalInfoFormProps {
  control: Control<RegistrationData>;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

export const PersonalInfoForm = ({ control, updateFormData }: PersonalInfoFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ photoFile: e.target.files[0] });
    }
  };

  const selectedRegion = useWatch({ control, name: "region" });
  const selectedDepartment = useWatch({ control, name: "department" });
  const photoFile = useWatch({ control, name: "photoFile" });

  const availableDepartments = useMemo(() => {
    return selectedRegion ? CAMEROON_DEPARTMENTS[selectedRegion] || [] : [];
  }, [selectedRegion]);

  const availableArrondissements = useMemo(() => {
    return selectedDepartment ? CAMEROON_ARRONDISSEMENTS[selectedDepartment] || [] : [];
  }, [selectedDepartment]);

  const firstNameController = useController({ name: "firstName", control });
  const lastNameController = useController({ name: "lastName", control });
  const birthDateController = useController({ name: "birthDate", control });
  const birthPlaceController = useController({ name: "birthPlace", control });
  const genderController = useController({ name: "gender", control });
  const phoneController = useController({ name: "phone", control });
  const emailController = useController({ name: "email", control });
  const cityController = useController({ name: "city", control });
  const departmentController = useController({ name: "department", control });
  const regionController = useController({ name: "region", control });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-muted-foreground">Step 1 of 3</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <div className="relative">
            <Input
              id="lastName"
              {...lastNameController.field}
              className={cn(
                lastNameController.fieldState.isTouched && lastNameController.fieldState.error
                  ? "border-red-500"
                  : lastNameController.fieldState.isTouched && !lastNameController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            />
            {lastNameController.fieldState.isTouched && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {lastNameController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {lastNameController.fieldState.error && (
            <p className="text-sm text-red-500">{lastNameController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">First Name(s) *</Label>
          <div className="relative">
            <Input
              id="firstName"
              {...firstNameController.field}
              className={cn(
                firstNameController.fieldState.isTouched && firstNameController.fieldState.error
                  ? "border-red-500"
                  : firstNameController.fieldState.isTouched && !firstNameController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            />
            {firstNameController.fieldState.isTouched && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {firstNameController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {firstNameController.fieldState.error && (
            <p className="text-sm text-red-500">{firstNameController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Date of Birth *</Label>
          <div className="relative">
            <Input
              id="birthDate"
              type="date"
              {...birthDateController.field}
              className={cn(
                birthDateController.fieldState.isTouched && birthDateController.fieldState.error
                  ? "border-red-500"
                  : birthDateController.fieldState.isTouched && !birthDateController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            />
            {birthDateController.fieldState.isTouched && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {birthDateController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {birthDateController.fieldState.error && (
            <p className="text-sm text-red-500">{birthDateController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthPlace">Place of Birth *</Label>
          <div className="relative">
            <Input
              id="birthPlace"
              {...birthPlaceController.field}
              className={cn(
                birthPlaceController.fieldState.isTouched && birthPlaceController.fieldState.error
                  ? "border-red-500"
                  : birthPlaceController.fieldState.isTouched && !birthPlaceController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            />
            {birthPlaceController.fieldState.isTouched && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {birthPlaceController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {birthPlaceController.fieldState.error && (
            <p className="text-sm text-red-500">{birthPlaceController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <div className="relative">
            <SimpleSelect
              {...genderController.field}
              value={genderController.field.value || ""}
              onChange={genderController.field.onChange}
              placeholder="Select gender"
              error={genderController.fieldState.isTouched && !!genderController.fieldState.error}
              touched={genderController.fieldState.isTouched}
              className={cn(
                genderController.fieldState.isTouched && genderController.fieldState.error
                  ? "border-red-500"
                  : genderController.fieldState.isTouched && !genderController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </SimpleSelect>
            {genderController.fieldState.isTouched && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                {genderController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {genderController.fieldState.error && (
            <p className="text-sm text-red-500">{genderController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              {...phoneController.field}
              placeholder="+237 6XX XXX XXX"
              className={cn(
                phoneController.fieldState.isTouched && phoneController.fieldState.error
                  ? "border-red-500"
                  : phoneController.fieldState.isTouched && !phoneController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            />
            {phoneController.fieldState.isTouched && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {phoneController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {phoneController.fieldState.error && (
            <p className="text-sm text-red-500">{phoneController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              {...emailController.field}
              className={cn(
                emailController.fieldState.isTouched && emailController.fieldState.error
                  ? "border-red-500"
                  : emailController.fieldState.isTouched && !emailController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            />
            {emailController.fieldState.isTouched && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {emailController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {emailController.fieldState.error && (
            <p className="text-sm text-red-500">{emailController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <div className="relative">
            <Input
              id="city"
              {...cityController.field}
              className={cn(
                cityController.fieldState.isTouched && cityController.fieldState.error
                  ? "border-red-500"
                  : cityController.fieldState.isTouched && !cityController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            />
            {cityController.fieldState.isTouched && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {cityController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {cityController.fieldState.error && (
            <p className="text-sm text-red-500">{cityController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region *</Label>
          <div className="relative">
            <SimpleSelect
              {...regionController.field}
              value={regionController.field.value || ""}
              onChange={regionController.field.onChange}
              placeholder="Select a region"
              error={regionController.fieldState.isTouched && !!regionController.fieldState.error}
              touched={regionController.fieldState.isTouched}
              className={cn(
                regionController.fieldState.isTouched && regionController.fieldState.error
                  ? "border-red-500"
                  : regionController.fieldState.isTouched && !regionController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            >
              <option value="">Select a region</option>
              {CAMEROON_REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </SimpleSelect>
            {regionController.fieldState.isTouched && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                {regionController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {regionController.fieldState.error && (
            <p className="text-sm text-red-500">{regionController.fieldState.error.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <div className="relative">
            <SimpleSelect
              {...departmentController.field}
              value={departmentController.field.value || ""}
              onChange={departmentController.field.onChange}
              placeholder={selectedRegion ? "Select a department" : "Select a region first"}
              disabled={!selectedRegion}
              error={departmentController.fieldState.isTouched && !!departmentController.fieldState.error}
              touched={departmentController.fieldState.isTouched}
              className={cn(
                departmentController.fieldState.isTouched && departmentController.fieldState.error
                  ? "border-red-500"
                  : departmentController.fieldState.isTouched && !departmentController.fieldState.error
                  ? "border-green-500"
                  : ""
              )}
            >
              <option value="">{selectedRegion ? "Select a department" : "Select a region first"}</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </SimpleSelect>
            {departmentController.fieldState.isTouched && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                {departmentController.fieldState.error ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {departmentController.fieldState.error && (
            <p className="text-sm text-red-500">{departmentController.fieldState.error.message}</p>
          )}
        </div>


        <div className="space-y-2 md:col-span-2">
          <Label>ID Photo *</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              photoFile ? "border-green-500 bg-green-50" : "border-border hover:border-primary"
            )}
          >
            {photoFile ? (
              <>
                <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-green-600 font-medium">
                  Photo added: {(photoFile as File)?.name}
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload your photo
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
