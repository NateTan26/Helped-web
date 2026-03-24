import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const fetchEnquiries = async () => {
  const response = await fetch(`${API_BASE}/api/enquiries`);
  if (!response.ok) {
    throw new Error("Failed to fetch enquiries");
  }
  return response.json();
};

const createEnquiry = async (enquiryData: { username: string; email: string; phone: string; message: string }) => {
  const response = await fetch(`${API_BASE}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiryData),
  });
  if (!response.ok) {
    throw new Error("Failed to create enquiry");
  }
  return response.json();
};

const Enquiry = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    message: "",
  });

  const queryClient = useQueryClient();
  const { data: enquiries, isLoading, isError } = useQuery({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiries,
  });

  const mutation = useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      toast({ title: "Enquiry submitted successfully", description: "Your enquiry has been sent." });
      setFormData({ username: "", email: "", phone: "", message: "" });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to submit enquiry" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.message) {
      toast({ title: "Error", description: "Please fill in all required fields" });
      return;
    }
    mutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <h2 className="text-xl font-bold mb-6">Employer Enquiry</h2>
        <div className="content-card animate-fade-in-up">
          <p>Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-container">
        <h2 className="text-xl font-bold mb-6">Employer Enquiry</h2>
        <div className="content-card animate-fade-in-up">
          <p className="text-destructive">Failed to load enquiries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Employer Enquiry</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Enquiry"}
        </Button>
      </div>

      {showForm && (
        <div className="content-card animate-fade-in-up mb-6">
          <h3 className="text-lg font-semibold mb-4">Submit New Enquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="username">Name *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+65 1234 5678"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Describe your requirements for a maid..."
                rows={6}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Enquiry"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card animate-fade-in-up space-y-4">
        <div className="space-y-3">
          {enquiries && enquiries.length > 0 ? (
            enquiries.map((enq: any, i: number) => (
              <div
                key={enq.id}
                className="border rounded-lg p-4 space-y-2 hover:border-primary/20 transition-colors"
                style={{ animation: "fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards", animationDelay: `${i * 0.06}s`, opacity: 0 }}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-semibold text-sm">{enq.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(enq.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{enq.email}</span>
                  <span>{enq.phone}</span>
                </div>
                <p className="text-sm whitespace-pre-line bg-muted/50 rounded p-3 mt-1">{enq.message}</p>
              </div>
            ))
          ) : (
            <p>No enquiries found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
