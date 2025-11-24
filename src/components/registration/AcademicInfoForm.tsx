import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "@/components/ui/simple-select";
import { RegistrationData } from "@/pages/Registration";
import { Control, useController, useWatch } from "react-hook-form";
import { Check, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { BAC_SERIES_BY_TYPE } from "@/lib/cameroon-data";
import { useRef } from "react";

interface AcademicInfoFormProps {
  control: Control<RegistrationData>;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

export const AcademicInfoForm = ({ control, updateFormData }: AcademicInfoFormProps) => {
  const bacDateController = useController({ name: "bacDate", control });
  const bacSeriesController = useController({ name: "bacSeries", control });
  const bacMentionController = useController({ name: "bacMention", control });
  const bacTypeController = useController({ name: "bacType", control });
  const bacDiplomaController = useController({ name: "bacDiplomaFile", control });
  const probDateController = useController({ name: "probDate", control });
  const probSeriesController = useController({ name: "probSeries", control });
  const probMentionController = useController({ name: "probMention", control });
  const probTypeController = useController({ name: "probType", control });
  const probDiplomaController = useController({ name: "probDiplomaFile", control });

  const bacType = useWatch({ control, name: "bacType" });
  const probType = useWatch({ control, name: "probType" });

  const bacFileInputRef = useRef<HTMLInputElement>(null);
  const probFileInputRef = useRef<HTMLInputElement>(null);

  const handleBacFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ bacDiplomaFile: e.target.files[0] });
    }
  };

  const handleProbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ probDiplomaFile: e.target.files[0] });
    }
  };

  const bacSeriesOptions = BAC_SERIES_BY_TYPE[bacType] || [];
  const probSeriesOptions = BAC_SERIES_BY_TYPE[probType] || [];
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Academic Information</h2>
        <p className="text-muted-foreground">Step 2 of 3</p>
      </div>

      {/* Baccalauréat */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Baccalauréat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <Label htmlFor="bacDate">Date Obtained *</Label>
             <div className="relative">
               <Input
                 id="bacDate"
                 type="date"
                 {...bacDateController.field}
                 className={cn(
                   bacDateController.fieldState.isTouched && bacDateController.fieldState.error
                     ? "border-red-500"
                     : bacDateController.fieldState.isTouched && !bacDateController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               />
               {bacDateController.fieldState.isTouched && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                   {bacDateController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {bacDateController.fieldState.error && (
               <p className="text-sm text-red-500">{bacDateController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2">
             <Label htmlFor="bacSeries">Series *</Label>
             <div className="relative">
               <SimpleSelect
                 {...bacSeriesController.field}
                 value={bacSeriesController.field.value || ""}
                 onChange={bacSeriesController.field.onChange}
                 placeholder="Select series"
                 error={bacSeriesController.fieldState.isTouched && !!bacSeriesController.fieldState.error}
                 touched={bacSeriesController.fieldState.isTouched}
                 className={cn(
                   bacSeriesController.fieldState.isTouched && bacSeriesController.fieldState.error
                     ? "border-red-500"
                     : bacSeriesController.fieldState.isTouched && !bacSeriesController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               >
                 <option value="">Select series</option>
                 {bacSeriesOptions.map(series => (
                   <option key={series} value={series}>{series}</option>
                 ))}
               </SimpleSelect>
               {bacSeriesController.fieldState.isTouched && (
                 <div className="absolute right-10 top-1/2 -translate-y-1/2">
                   {bacSeriesController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {bacSeriesController.fieldState.error && (
               <p className="text-sm text-red-500">{bacSeriesController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2">
             <Label htmlFor="bacMention">Grade *</Label>
             <div className="relative">
               <SimpleSelect
                 {...bacMentionController.field}
                 value={bacMentionController.field.value || ""}
                 onChange={bacMentionController.field.onChange}
                 placeholder="Select grade"
                 error={bacMentionController.fieldState.isTouched && !!bacMentionController.fieldState.error}
                 touched={bacMentionController.fieldState.isTouched}
                 className={cn(
                   bacMentionController.fieldState.isTouched && bacMentionController.fieldState.error
                     ? "border-red-500"
                     : bacMentionController.fieldState.isTouched && !bacMentionController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               >
                 <option value="">Select grade</option>
                 <option value="Passable">Passable</option>
                 <option value="Assez Bien">Assez Bien</option>
                 <option value="Bien">Bien</option>
                 <option value="Très Bien">Très Bien</option>
               </SimpleSelect>
               {bacMentionController.fieldState.isTouched && (
                 <div className="absolute right-10 top-1/2 -translate-y-1/2">
                   {bacMentionController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {bacMentionController.fieldState.error && (
               <p className="text-sm text-red-500">{bacMentionController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2">
             <Label htmlFor="bacType">Type *</Label>
             <div className="relative">
               <SimpleSelect
                 {...bacTypeController.field}
                 value={bacTypeController.field.value || ""}
                 onChange={bacTypeController.field.onChange}
                 placeholder="Select type"
                 error={bacTypeController.fieldState.isTouched && !!bacTypeController.fieldState.error}
                 touched={bacTypeController.fieldState.isTouched}
                 className={cn(
                   bacTypeController.fieldState.isTouched && bacTypeController.fieldState.error
                     ? "border-red-500"
                     : bacTypeController.fieldState.isTouched && !bacTypeController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               >
                 <option value="">Select type</option>
                 <option value="Général">Général</option>
                 <option value="Technique">Technique</option>
               </SimpleSelect>
               {bacTypeController.fieldState.isTouched && (
                 <div className="absolute right-10 top-1/2 -translate-y-1/2">
                   {bacTypeController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {bacTypeController.fieldState.error && (
               <p className="text-sm text-red-500">{bacTypeController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2 md:col-span-2">
             <Label>BAC Diploma/Transcript (PDF) *</Label>
             <div
               onClick={() => bacFileInputRef.current?.click()}
               className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
             >
               <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
               <p className="text-sm text-muted-foreground">
                 {bacDiplomaController.field.value ? (bacDiplomaController.field.value as File).name : "Click to upload the BAC diploma PDF"}
               </p>
               <input
                 ref={bacFileInputRef}
                 type="file"
                 accept="application/pdf"
                 onChange={handleBacFileChange}
                 className="hidden"
               />
             </div>
           </div>
         </div>
      </div>

      {/* Probatoire */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Probatoire</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <Label htmlFor="probDate">Date Obtained *</Label>
             <div className="relative">
               <Input
                 id="probDate"
                 type="date"
                 {...probDateController.field}
                 className={cn(
                   probDateController.fieldState.isTouched && probDateController.fieldState.error
                     ? "border-red-500"
                     : probDateController.fieldState.isTouched && !probDateController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               />
               {probDateController.fieldState.isTouched && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                   {probDateController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {probDateController.fieldState.error && (
               <p className="text-sm text-red-500">{probDateController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2">
             <Label htmlFor="probSeries">Series *</Label>
             <div className="relative">
               <SimpleSelect
                 {...probSeriesController.field}
                 value={probSeriesController.field.value || ""}
                 onChange={probSeriesController.field.onChange}
                 placeholder="Select series"
                 error={probSeriesController.fieldState.isTouched && !!probSeriesController.fieldState.error}
                 touched={probSeriesController.fieldState.isTouched}
                 className={cn(
                   probSeriesController.fieldState.isTouched && probSeriesController.fieldState.error
                     ? "border-red-500"
                     : probSeriesController.fieldState.isTouched && !probSeriesController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               >
                 <option value="">Select series</option>
                 {probSeriesOptions.map(series => (
                   <option key={series} value={series}>{series}</option>
                 ))}
               </SimpleSelect>
               {probSeriesController.fieldState.isTouched && (
                 <div className="absolute right-10 top-1/2 -translate-y-1/2">
                   {probSeriesController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {probSeriesController.fieldState.error && (
               <p className="text-sm text-red-500">{probSeriesController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2">
             <Label htmlFor="probMention">Grade *</Label>
             <div className="relative">
               <SimpleSelect
                 {...probMentionController.field}
                 value={probMentionController.field.value || ""}
                 onChange={probMentionController.field.onChange}
                 placeholder="Select grade"
                 error={probMentionController.fieldState.isTouched && !!probMentionController.fieldState.error}
                 touched={probMentionController.fieldState.isTouched}
                 className={cn(
                   probMentionController.fieldState.isTouched && probMentionController.fieldState.error
                     ? "border-red-500"
                     : probMentionController.fieldState.isTouched && !probMentionController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               >
                 <option value="">Select grade</option>
                 <option value="Passable">Passable</option>
                 <option value="Assez Bien">Assez Bien</option>
                 <option value="Bien">Bien</option>
                 <option value="Très Bien">Très Bien</option>
               </SimpleSelect>
               {probMentionController.fieldState.isTouched && (
                 <div className="absolute right-10 top-1/2 -translate-y-1/2">
                   {probMentionController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {probMentionController.fieldState.error && (
               <p className="text-sm text-red-500">{probMentionController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2">
             <Label htmlFor="probType">Type *</Label>
             <div className="relative">
               <SimpleSelect
                 {...probTypeController.field}
                 value={probTypeController.field.value || ""}
                 onChange={probTypeController.field.onChange}
                 placeholder="Select type"
                 error={probTypeController.fieldState.isTouched && !!probTypeController.fieldState.error}
                 touched={probTypeController.fieldState.isTouched}
                 className={cn(
                   probTypeController.fieldState.isTouched && probTypeController.fieldState.error
                     ? "border-red-500"
                     : probTypeController.fieldState.isTouched && !probTypeController.fieldState.error
                     ? "border-green-500"
                     : ""
                 )}
               >
                 <option value="">Select type</option>
                 <option value="Général">Général</option>
                 <option value="Technique">Technique</option>
               </SimpleSelect>
               {probTypeController.fieldState.isTouched && (
                 <div className="absolute right-10 top-1/2 -translate-y-1/2">
                   {probTypeController.fieldState.error ? (
                     <X className="h-4 w-4 text-red-500" />
                   ) : (
                     <Check className="h-4 w-4 text-green-500" />
                   )}
                 </div>
               )}
             </div>
             {probTypeController.fieldState.error && (
               <p className="text-sm text-red-500">{probTypeController.fieldState.error.message}</p>
             )}
           </div>

           <div className="space-y-2 md:col-span-2">
             <Label>Probatoire Diploma/Transcript (PDF) *</Label>
             <div
               onClick={() => probFileInputRef.current?.click()}
               className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
             >
               <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
               <p className="text-sm text-muted-foreground">
                 {probDiplomaController.field.value ? (probDiplomaController.field.value as File).name : "Click to upload the probatoire diploma PDF"}
               </p>
               <input
                 ref={probFileInputRef}
                 type="file"
                 accept="application/pdf"
                 onChange={handleProbFileChange}
                 className="hidden"
               />
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};
