import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type AgencyFormData = {
  companyName: string;
  shopName: string;
  address1: string;
  address2: string;
  postalCode: string;
  country: string;
  hpNumber: string;
  email: string;
  telephone: string;
  fax: string;
  contactPerson: string;
  contactPersonHp: string;
  officeHour: string;
};

type CompanyAPIResponse = {
  companyProfile: {
    company_name: string;
    short_name: string;
    license_no?: string;
    address_line1: string;
    address_line2?: string;
    postal_code: string;
    country: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    contact_fax?: string;
    office_hours_regular?: string;
    social_whatsapp_number?: string;
  };
  momPersonnel: Array<unknown>;
  testimonials: Array<unknown>;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const fetchCompanyProfile = async (): Promise<CompanyAPIResponse> => {
  const response = await fetch(`${API_BASE}/api/company`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to load agency profile from backend");
  }

  return response.json();
};

const updateCompanyProfile = async (payload: Partial<AgencyFormData>) => {
  const mappedPayload = {
    company_name: payload.companyName,
    short_name: payload.shopName,
    address_line1: payload.address1,
    address_line2: payload.address2,
    postal_code: payload.postalCode,
    country: payload.country,
    contact_phone: payload.hpNumber,
    contact_email: payload.email,
    contact_fax: payload.fax,
    contact_person: payload.contactPerson,
    office_hours_regular: payload.officeHour,
  };

  const response = await fetch(`${API_BASE}/api/company`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mappedPayload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error || "Failed to update agency profile";
    throw new Error(message);
  }

  return response.json();
};

const AgencyProfile = () => {
  const [formData, setFormData] = useState<AgencyFormData>({
    companyName: "",
    shopName: "",
    address1: "",
    address2: "",
    postalCode: "",
    country: "",
    hpNumber: "",
    email: "",
    telephone: "",
    fax: "",
    contactPerson: "",
    contactPersonHp: "",
    officeHour: "",
  });

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: fetchCompanyProfile,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: () => {
      toast({ title: "Company profile updated", description: "Your changes were saved." });
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Unable to save profile";
      toast({ title: "Error", description: message });
    },
  });

  useEffect(() => {
    if (data?.companyProfile) {
      setFormData({
        companyName: data.companyProfile.company_name || "",
        shopName: data.companyProfile.short_name || "",
        address1: data.companyProfile.address_line1 || "",
        address2: data.companyProfile.address_line2 || "",
        postalCode: data.companyProfile.postal_code || "",
        country: data.companyProfile.country || "",
        hpNumber: data.companyProfile.contact_phone || "",
        email: data.companyProfile.contact_email || "",
        telephone: "",
        fax: data.companyProfile.contact_fax || "",
        contactPerson: data.companyProfile.contact_person || "",
        contactPersonHp: data.companyProfile.social_whatsapp_number || "",
        officeHour: data.companyProfile.office_hours_regular || "",
      });
    }
  }, [data]);

  const handleChange = (field: keyof AgencyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">Agency Profile</h2>
      </div>

      <div className="content-card animate-fade-in-up">
        {isLoading ? (
          <p>Loading company profile...</p>
        ) : isError ? (
          <p className="text-destructive">Failed to load company profile.</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-4">
              {[
                { label: "Company Name", field: "companyName" as const },
                { label: "Shop Name", field: "shopName" as const },
                { label: "Address Line 1", field: "address1" as const },
                { label: "Address Line 2", field: "address2" as const },
                { label: "Postal Code", field: "postalCode" as const },
                { label: "Country", field: "country" as const },
                { label: "HP Number", field: "hpNumber" as const },
                { label: "Email", field: "email" as const },
                { label: "Telephone", field: "telephone" as const },
                { label: "Fax", field: "fax" as const },
                { label: "Contact Person", field: "contactPerson" as const },
                { label: "Contact Person WhatsApp", field: "contactPersonHp" as const },
              ].map(({ label, field }) => (
                <div key={field} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 items-center">
                  <Label className="form-label sm:text-right">{label}:</Label>
                  <Input
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 items-start">
                <Label className="form-label sm:text-right pt-2">Office Hour:</Label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  value={formData.officeHour}
                  onChange={(e) => handleChange("officeHour", e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 flex justify-center">
              <Button type="submit" className="px-8" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AgencyProfile;
