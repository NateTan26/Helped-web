<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Trash2 } from "lucide-react";

interface EnquiryRecord {
  id: number;
  username: string;
  date: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const PAGE_SIZE = 5;

const Enquiry = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadEnquiries = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(`/api/enquiries${params.toString() ? `?${params.toString()}` : ""}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { error?: string; enquiries?: EnquiryRecord[] };

        if (!response.ok || !data.enquiries) {
          throw new Error(data.error || "Failed to load enquiries");
        }

        setEnquiries(data.enquiries);
        setPage(1);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          toast.error(error instanceof Error ? error.message : "Failed to load enquiries");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadEnquiries();
    return () => controller.abort();
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(enquiries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleEnquiries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return enquiries.slice(start, start + PAGE_SIZE);
  }, [currentPage, enquiries]);

  const handleDelete = async (id: number) => {
    try {
      setBusyId(id);
      const response = await fetch(`/api/enquiries/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete enquiry");
      }

      setEnquiries((prev) => prev.filter((enquiry) => enquiry.id !== id));
      toast.success("Enquiry deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete enquiry");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="page-container">
      <h2 className="mb-6 text-xl font-bold">Employer Enquiry</h2>
      <div className="content-card animate-fade-in-up space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Search enquiry" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="outline">Search</Button>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">Loading enquiries...</div>
        ) : (
          <div className="space-y-3">
            {visibleEnquiries.map((enq, i) => (
              <div
                key={enq.id}
                className="space-y-2 rounded-lg border p-4 transition-colors hover:border-primary/20"
                style={{ animation: "fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards", animationDelay: `${i * 0.06}s`, opacity: 0 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 gap-y-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-sm font-semibold">{enq.username}</span>
                    <span className="text-xs text-muted-foreground">{enq.date}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={busyId === enq.id}
                    onClick={() => void handleDelete(enq.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> {busyId === enq.id ? "Deleting..." : "Delete"}
                  </Button>
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{enq.email}</span>
                  <span>{enq.phone}</span>
                </div>
<<<<<<< HEAD
                <p className="text-sm whitespace-pre-line bg-muted/50 rounded p-3 mt-1">{enq.message}</p>
              </div>
            ))
          ) : (
            <p>No enquiries found.</p>
          )}
=======
                <p className="mt-1 whitespace-pre-line rounded bg-muted/50 p-3 text-sm">{enq.message}</p>
              </div>
            ))}

            {!isLoading && visibleEnquiries.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">No enquiries found.</div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-1 pt-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-7 w-7 rounded ${i + 1 === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {i + 1}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
