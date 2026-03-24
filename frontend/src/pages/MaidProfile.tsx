<<<<<<< HEAD
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, Edit, Image, Trash2, Youtube, FileDown, Check } from "lucide-react";

const maidData: Record<string, any> = {
  "FIL-PHK-WIL-9646": {
    name: "Dela Cruz Novelyn", ref: "FIL-PHK-WIL-9646", type: "Transfer maid", nationality: "Filipino maid",
    dob: "29-Nov-1982", placeOfBirth: "Nueva Ecija", height: "150cm", weight: "53Kg",
    religion: "Catholic", marital: "Single", address: "Cuyapo Nueva Ecija",
    airport: "Clark/Manila Airport", education: "College/Degree (>=13 yrs)", availability: "11 April",
    languages: [
      { lang: "English", level: "Good" }, { lang: "Mandarin/Chinese-Dialect", level: "Poor" },
      { lang: "Bahasa Indonesia/Malaysia", level: "Poor" }, { lang: "Hindi", level: "Poor" },
      { lang: "Tamil", level: "Poor" }, { lang: "Malayalam", level: "Poor" },
      { lang: "Telegu", level: "Poor" }, { lang: "Karnataka", level: "Poor" },
    ],
    otherInfo: [
      { q: "Able to handle pork?", a: true }, { q: "Able to eat pork?", a: true },
      { q: "Able to care for dog/cat?", a: true }, { q: "Able to do simple sewing?", a: true },
      { q: "Able to do gardening work?", a: true }, { q: "Willing to wash car?", a: true },
      { q: "Can work on off-days with compensation?", a: true },
    ],
    offDays: "0 days(s)/month",
    employment: [
      { from: "2023", to: "2024", country: "Singapore", employer: "", duties: "", remarks: "" },
      { from: "2024", to: "2026", country: "Singapore", employer: "", duties: "", remarks: "" },
    ],
    agencyName: "At The Agency (formerly Rinzin Agency Pte. Ltd)",
    licenseNo: "25C3114",
    contactPerson: "Bala",
    contactNo: "80730757",
    lastUpdated: "23-03-2026", hits: 1,
    historicalRecord: {
      wpNo: "0 28538065", workerName: "DELA CRUZ NOVELYN DEL ROSARIO",
      dob: "29/11/1982", sex: "FEMALE", fin: "M3271606N",
      passport: "P7094831A", nationality: "FILIPINO",
    },
    resultsFound: 2,
    employers: [
      "Employer 2 14/05/2024 General Household",
      "Employer 1 22/04/2023 14/05/2024 General Household",
    ],
  },
};

// Fallback data for any maid ref not explicitly listed
const getDefaultMaid = (ref: string) => ({
  name: ref.split("-").pop() || "Maid",
  ref,
  type: "Transfer maid", nationality: "Filipino maid",
  dob: "01-Jan-1990", placeOfBirth: "Manila", height: "155cm", weight: "50Kg",
  religion: "Catholic", marital: "Single", address: "Manila",
  airport: "Manila Airport", education: "High School", availability: "Immediately",
  languages: [{ lang: "English", level: "Good" }],
  otherInfo: [], offDays: "4 days(s)/month",
  employment: [],
  agencyName: "The Agency", licenseNo: "N/A", contactPerson: "Admin", contactNo: "N/A",
  lastUpdated: "23-03-2026", hits: 0,
  historicalRecord: null, resultsFound: 0, employers: [],
});

const MaidProfile = () => {
  const { refCode } = useParams();
  const navigate = useNavigate();
  const maid = maidData[refCode || ""] || getDefaultMaid(refCode || "");

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
=======
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, Edit, Image, Trash2, Youtube, FileDown, Check } from "lucide-react";
import { MaidProfile } from "@/lib/maids";
import { toast } from "@/components/ui/sonner";

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const MaidProfilePage = () => {
  const { refCode } = useParams();
  const navigate = useNavigate();
  const [maid, setMaid] = useState<MaidProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadMaid = async () => {
      if (!refCode) return;
      try {
        const response = await fetch(`/api/maids/${encodeURIComponent(refCode)}`);
        const data = (await response.json()) as { error?: string; maid?: MaidProfile };
        if (!response.ok || !data.maid) throw new Error(data.error || "Failed to load maid");
        setMaid(data.maid);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load maid");
        navigate("/edit-maids");
      }
    };

    void loadMaid();
  }, [navigate, refCode]);

  const handleDelete = async () => {
    if (!maid) return;
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/maids/${encodeURIComponent(maid.referenceCode)}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to delete maid");
      toast.success("Maid deleted");
      navigate("/edit-maids");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete maid");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!maid) {
    return (
      <div className="page-container">
        <div className="content-card py-10 text-center text-muted-foreground">Loading maid profile...</div>
      </div>
    );
  }

  const agencyContact = maid.agencyContact as Record<string, unknown>;
  const introduction = maid.introduction as Record<string, unknown>;
  const skillsPreferences = maid.skillsPreferences as Record<string, unknown>;
  const otherInformation = (skillsPreferences.otherInformation as Record<string, boolean>) || {};
  const workAreas = Object.entries(maid.workAreas || {}) as Array<[string, { willing?: boolean; experience?: boolean; evaluation?: string }]>;
  const employment = Array.isArray(maid.employmentHistory) ? maid.employmentHistory : [];
  const languages = Object.entries(maid.languageSkills || {});

  return (
    <div className="page-container">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
        </button>
        <h2 className="text-xl font-bold">Edit/Delete Maid</h2>
      </div>

      <div className="content-card animate-fade-in-up space-y-6">
<<<<<<< HEAD
        {/* Action links */}
        <div className="flex flex-wrap gap-3 text-sm border-b pb-3">
          <button className="text-primary hover:underline flex items-center gap-1"><ArrowUp className="w-3 h-3" /> Bring to Top</button>
          <button className="text-primary hover:underline">View All Maids</button>
          <button className="text-primary hover:underline flex items-center gap-1"><Edit className="w-3 h-3" /> Edit This Maid</button>
          <button className="text-primary hover:underline flex items-center gap-1"><Image className="w-3 h-3" /> Manage Photos</button>
          <button className="text-primary hover:underline flex items-center gap-1"><Youtube className="w-3 h-3" /> YouTube Video</button>
          <button className="text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
        </div>

        {/* Top section: video + agency info + photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Video area */}
          <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center gap-3 bg-muted/30 min-h-[200px]">
            <p className="text-sm text-muted-foreground">It appears you do not have a video on-line for this maid. You can upload a video file to accompany this maid.</p>
            <button className="text-primary text-sm hover:underline">Click here to upload the video file for this maid.</button>
          </div>

          {/* Agency contact */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">To contact her agency,</p>
            <p className="text-sm font-bold">{maid.agencyName}</p>
            <p className="text-sm">(License No.: {maid.licenseNo}),</p>
            <p className="text-sm">Please call <span className="font-bold">{maid.contactPerson}</span></p>
            <p className="text-sm">at <span className="font-bold text-primary">{maid.contactNo}</span></p>
          </div>

          {/* Photos + PDF */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              <div className="w-24 h-28 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">Photo 1</div>
              <div className="w-24 h-28 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">Photo 2</div>
            </div>
            <button className="flex items-center gap-2 text-primary text-sm hover:underline">
              <FileDown className="w-4 h-4" /> Download Maid Bio-data in PDF
=======
        <div className="flex flex-wrap gap-3 border-b pb-3 text-sm">
          <button className="flex items-center gap-1 text-primary hover:underline"><ArrowUp className="h-3 w-3" /> Bring to Top</button>
          <button className="text-primary hover:underline" onClick={() => navigate("/edit-maids")}>View All Maids</button>
          <button className="flex items-center gap-1 text-primary hover:underline" onClick={() => navigate(`/maid/${encodeURIComponent(maid.referenceCode)}/edit`)}><Edit className="h-3 w-3" /> Edit This Maid</button>
          <button className="flex items-center gap-1 text-primary hover:underline"><Image className="h-3 w-3" /> Manage Photos</button>
          <button className="flex items-center gap-1 text-primary hover:underline"><Youtube className="h-3 w-3" /> YouTube Video</button>
          <button className="flex items-center gap-1 text-destructive hover:underline" onClick={() => void handleDelete()}><Trash2 className="h-3 w-3" /> {isDeleting ? "Deleting..." : "Delete"}</button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">It appears that you do not have a video on-line for this maid. You can upload a video file to accompany this maid.</p>
            <button className="text-sm text-primary hover:underline">Click here to upload the video file for this maid.</button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">To contact her agency,</p>
            <p className="text-sm font-bold">{String(agencyContact.companyName || "At The Agency (formerly Rinzin Agency Pte. Ltd)")}</p>
            <p className="text-sm">(License No.: {String(agencyContact.licenseNo || "2503114")}),</p>
            <p className="text-sm">Please call <span className="font-bold">{String(agencyContact.contactPerson || "Bala")}</span></p>
            <p className="text-sm">at <span className="font-bold text-primary">{String(agencyContact.phone || "80730757")}</span></p>
            <p className="pt-2 text-sm font-semibold">{String(agencyContact.passportNo || "")}</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              <div className="flex h-28 w-24 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">{maid.hasPhoto ? "Photo 1" : "No Photo"}</div>
              <div className="flex h-28 w-24 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">Photo 2</div>
            </div>
            <button className="flex items-center gap-2 text-sm text-primary hover:underline">
              <FileDown className="h-4 w-4" /> Download Maid Bio-data in PDF
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {/* Bio details */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-6 gap-y-1 text-sm">
          {[
            ["Maid Name", maid.name],
            ["Ref. Code", maid.ref],
            ["Type", maid.type],
            ["Nationality", maid.nationality],
            ["Date of Birth", maid.dob],
            ["Place of Birth", maid.placeOfBirth],
            ["Height/Weight", `${maid.height} / ${maid.weight}`],
            ["Religion", maid.religion],
            ["Marital Status", maid.marital],
            ["Address in Home Country", maid.address],
            ["Airport To Be Repatriated", maid.airport],
            ["Education", maid.education],
            ["Availability", maid.availability],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <p className="font-semibold text-right text-muted-foreground py-1">{label}</p>
=======
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm md:grid-cols-[220px_1fr]">
          {[
            ["Maid Name", maid.fullName],
            ["Ref. Code", maid.referenceCode],
            ["Type", maid.type],
            ["Nationality", maid.nationality],
            ["Date of Birth", formatDate(maid.dateOfBirth)],
            ["Place of Birth", maid.placeOfBirth],
            ["Height/Weight", `${maid.height}cm/${maid.weight}Kg`],
            ["Religion", maid.religion],
            ["Marital Status", maid.maritalStatus],
            ["Number of Children", String(maid.numberOfChildren)],
            ["Number Of Siblings", String(maid.numberOfSiblings)],
            ["Address in Home Country", maid.homeAddress],
            ["Airport To Be Repatriated", maid.airportRepatriation],
            ["Education", maid.educationLevel],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <p className="py-1 font-semibold text-muted-foreground md:text-right">{label}</p>
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
              <p className="py-1">{value}</p>
            </div>
          ))}

<<<<<<< HEAD
          {/* Languages */}
          <p className="font-semibold text-right text-muted-foreground py-1">Language Skill</p>
          <div className="py-1">
            {maid.languages.map((l: any, i: number) => (
              <p key={i}>{l.lang} ({l.level})</p>
=======
          <p className="py-1 font-semibold text-muted-foreground md:text-right">Language Skill</p>
          <div className="py-1 space-y-1">
            {languages.map(([lang, level]) => (
              <p key={lang}>{lang} ({String(level)})</p>
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* Other Information */}
        {maid.otherInfo.length > 0 && (
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Other Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_40px] gap-y-1 text-sm max-w-lg">
              {maid.otherInfo.map((item: any, i: number) => (
                <div key={i} className="contents">
                  <p>{item.q}</p>
                  <p className="text-center">{item.a ? <Check className="w-4 h-4 text-primary inline" /> : "—"}</p>
                </div>
              ))}
            </div>
            <p className="text-sm mt-2">Number of off-days per month: {maid.offDays}</p>
          </div>
        )}

        {/* Employment History */}
        {maid.employment.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Employment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
=======
        <div className="space-y-1">
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Other Information</h3>
          <div className="grid max-w-2xl grid-cols-1 gap-y-1 text-sm md:grid-cols-[1fr_40px]">
            {Object.entries(otherInformation).map(([question, value]) => (
              <div key={question} className="contents">
                <p>{question}</p>
                <p className="text-center">{value ? <Check className="inline h-4 w-4 text-primary" /> : "-"}</p>
              </div>
            ))}
          </div>
          <p className="pt-2 text-sm">Number of off-days per month: {String(skillsPreferences.offDaysPerMonth || "0")} day(s)/month</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Maid Skills</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border px-3 py-2 text-left">Areas of Work</th>
                <th className="border px-3 py-2 text-center">Willingness</th>
                <th className="border px-3 py-2 text-center">Experience</th>
                <th className="border px-3 py-2 text-center">Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {workAreas.map(([area, config]) => (
                <tr key={area}>
                  <td className="border px-3 py-2">{area}</td>
                  <td className="border px-3 py-2 text-center">{config.willing ? "Yes" : "No"}</td>
                  <td className="border px-3 py-2 text-center">{config.experience ? "Yes" : "No"}</td>
                  <td className="border px-3 py-2 text-center">{config.evaluation || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employment.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Employment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
                <thead>
                  <tr className="bg-muted/50">
                    {["From", "To", "Country", "Employer", "Maid Duties", "Remarks"].map((h) => (
                      <th key={h} className="border px-3 py-1.5 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                  {maid.employment.map((e: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="border px-3 py-1.5">{e.from}</td>
                      <td className="border px-3 py-1.5">{e.to}</td>
                      <td className="border px-3 py-1.5">{e.country}</td>
                      <td className="border px-3 py-1.5">{e.employer}</td>
                      <td className="border px-3 py-1.5">{e.duties}</td>
                      <td className="border px-3 py-1.5">{e.remarks}</td>
                    </tr>
                  ))}
=======
                  {employment.map((e, i) => {
                    const row = e as Record<string, string>;
                    return (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="border px-3 py-1.5">{row.from || ""}</td>
                        <td className="border px-3 py-1.5">{row.to || ""}</td>
                        <td className="border px-3 py-1.5">{row.country || ""}</td>
                        <td className="border px-3 py-1.5">{row.employer || ""}</td>
                        <td className="border px-3 py-1.5">{row.duties || ""}</td>
                        <td className="border px-3 py-1.5">{row.remarks || ""}</td>
                      </tr>
                    );
                  })}
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
                </tbody>
              </table>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* Public Introduction */}
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-muted-foreground">Public Introduction</h3>
          <p className="text-amber-600 italic text-xs">Maid Introduction in Public is empty, please add to have more employers view this bio-data.</p>
        </div>

        {/* Introduction (login required) */}
        <div className="space-y-1 text-sm">
          <h3 className="font-semibold text-muted-foreground">Introduction</h3>
          <p className="text-xs text-muted-foreground">(Employer login is required to view this Introduction)</p>
        </div>

        {/* Footer info */}
        <div className="border-t pt-4 space-y-1 text-sm">
          <p><span className="font-semibold text-muted-foreground">Last updated On</span> {maid.lastUpdated}</p>
          <p><span className="font-semibold text-muted-foreground">Hits</span> {maid.hits}</p>
        </div>

        {/* Historical Record */}
        {maid.historicalRecord && (
          <div className="space-y-1 text-sm border-t pt-4">
            <h3 className="font-semibold text-muted-foreground mb-2">Historical Record</h3>
            <p>WP No. : {maid.historicalRecord.wpNo}</p>
            <p>Name of Worker : {maid.historicalRecord.workerName}</p>
            <p>DOB of Worker : {maid.historicalRecord.dob}</p>
            <p>Sex : {maid.historicalRecord.sex}</p>
            <p>Worker's FIN : {maid.historicalRecord.fin}</p>
            <p>Passport No. : {maid.historicalRecord.passport}</p>
            <p>Nationality/Citizenship : {maid.historicalRecord.nationality}</p>
            <p className="mt-2 font-semibold">Results Found : {maid.resultsFound}</p>
            {maid.employers.map((e: string, i: number) => (
              <p key={i} className="text-primary">{e}</p>
            ))}
          </div>
        )}
=======
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-muted-foreground">Public Introduction (Employer Login is not required)</h3>
          <p className="whitespace-pre-wrap">{String(introduction.publicIntro || "Maid Introduction in Public is empty, please add to have more employers view this bio-data.")}</p>
        </div>

        <div className="space-y-1 text-sm">
          <h3 className="font-semibold text-muted-foreground">Introduction (Employer login is required to view this Introduction)</h3>
          <p className="whitespace-pre-wrap">{String(introduction.intro || "(Employer login is required to view this Introduction)")}</p>
        </div>

        <div className="space-y-1 border-t pt-4 text-sm">
          <p><span className="font-semibold text-muted-foreground">Last updated On</span> {formatDate(maid.updatedAt)}</p>
          <p><span className="font-semibold text-muted-foreground">Hits</span> 1</p>
        </div>
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MaidProfile;
=======
export default MaidProfilePage;
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
