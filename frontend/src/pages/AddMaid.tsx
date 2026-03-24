<<<<<<< HEAD
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface MaidProfile {
  fullName: string;
  referenceCode: string;
  type: string;
  nationality: string;
  dateOfBirth: string;
  placeOfBirth: string;
  height: number;
  weight: number;
  religion: string;
  maritalStatus: string;
  numberOfChildren: number;
  numberOfSiblings: number;
  homeAddress: string;
  airportRepatriation: string;
  educationLevel: string;
  languageSkills: Record<string, string>;
  skillsPreferences: Record<string, any>;
  workAreas: Record<string, any>;
  employmentHistory: Array<Record<string, any>>;
  introduction: Record<string, any>;
  agencyContact: Record<string, any>;
}

const tabs = ["PROFILE", "SKILLS", "EMPLOYMENT HISTORY", "AVAILABILITY/REMARK", "INTRODUCTION", "PUBLIC INTRODUCTION", "PRIVATE INFO"];

const createMaid = async (maidData: MaidProfile) => {
  const response = await fetch(`${API_BASE}/api/maids`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(maidData),
  });
  if (!response.ok) {
    throw new Error("Failed to create maid");
  }
  return response.json();
};

const AddMaid = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [maidData, setMaidData] = useState<MaidProfile>({
    fullName: "",
    referenceCode: "",
    type: "",
    nationality: "",
    dateOfBirth: "",
    placeOfBirth: "",
    height: 0,
    weight: 0,
    religion: "",
    maritalStatus: "",
    numberOfChildren: 0,
    numberOfSiblings: 0,
    homeAddress: "",
    airportRepatriation: "",
    educationLevel: "",
    languageSkills: {},
    skillsPreferences: {},
    workAreas: {},
    employmentHistory: [{ from: "", to: "", country: "", employer: "", duties: "", remarks: "" }],
    introduction: {},
    agencyContact: {},
  });

  const mutation = useMutation({
    mutationFn: createMaid,
    onSuccess: () => {
      toast({ title: "Maid added successfully", description: "The maid profile has been created." });
      // Reset form or navigate
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to add maid" });
    },
  });

  const handleSubmit = () => {
    mutation.mutate(maidData);
  };

  const updateMaidData = (field: keyof MaidProfile, value: any) => {
    setMaidData(prev => ({ ...prev, [field]: value }));
=======
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { MaidProfile } from "@/lib/maids";

const tabs = ["PROFILE", "SKILLS", "EMPLOYMENT HISTORY", "AVAILABILITY/REMARK", "INTRODUCTION", "PUBLIC INTRODUCTION", "PRIVATE INFO"];
const languageOptions = [
  "English",
  "Mandarin/Chinese-Dialect",
  "Indonesian/Malaysian",
  "Hindi",
  "Tamil",
  "Malayalam",
  "Telegu",
  "Karnataka",
];
const skillAreas = [
  "Care of infants/children",
  "Care of elderly",
  "Care of disabled",
  "General housework",
  "Cooking",
  "Language Skill",
  "Other Skill",
];
const yesNoQuestions = [
  "Able to handle pork?",
  "Able to eat pork?",
  "Able to care for dog/cat?",
  "Able to do simple sewing?",
  "Able to do gardening work?",
  "Willing to wash car?",
  "Can work on off-days with compensation?",
];

const AddMaid = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    referenceCode: "",
    type: "New maid",
    nationality: "Filipino maid",
    dateOfBirth: "",
    placeOfBirth: "",
    height: "150",
    weight: "50",
    religion: "Catholic",
    maritalStatus: "Single",
    numberOfChildren: "0",
    numberOfSiblings: "0",
    homeAddress: "",
    airportRepatriation: "",
    educationLevel: "High School (10-12 yrs)",
    offDaysPerMonth: "2",
    passportNo: "",
  });
  const [languageSkills, setLanguageSkills] = useState<Record<string, string>>(
    Object.fromEntries(languageOptions.map((lang) => [lang, lang === "English" ? "Good" : "Poor"]))
  );
  const [workAreas, setWorkAreas] = useState<Record<string, { willing: boolean; experience: boolean; evaluation: string }>>(
    Object.fromEntries(skillAreas.map((skill) => [skill, { willing: false, experience: false, evaluation: "-" }]))
  );
  const [otherInformation, setOtherInformation] = useState<Record<string, boolean>>(
    Object.fromEntries(yesNoQuestions.map((question) => [question, false]))
  );
  const [employmentHistory, setEmploymentHistory] = useState<Array<Record<string, string>>>([
    { from: "", to: "", country: "", employer: "", duties: "", remarks: "" },
  ]);
  const [availabilityRemark, setAvailabilityRemark] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [publicIntroduction, setPublicIntroduction] = useState("");
  const [privateInfo, setPrivateInfo] = useState("");
  const [agencyContact, setAgencyContact] = useState({
    companyName: "At The Agency (formerly Rinzin Agency Pte. Ltd)",
    licenseNo: "2503114",
    contactPerson: "Bala",
    phone: "80730757",
  });

  const nextLabel = useMemo(() => (activeTab < tabs.length - 1 ? "Save and Continue" : "Save Maid"), [activeTab]);

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateWorkArea = (skill: string, field: "willing" | "experience" | "evaluation", value: boolean | string) => {
    setWorkAreas((prev) => ({
      ...prev,
      [skill]: {
        ...prev[skill],
        [field]: value,
      },
    }));
  };

  const updateEmploymentRow = (index: number, field: string, value: string) => {
    setEmploymentHistory((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  };

  const addEmploymentRow = () => {
    setEmploymentHistory((prev) => [...prev, { from: "", to: "", country: "", employer: "", duties: "", remarks: "" }]);
  };

  const removeLastEmploymentRow = () => {
    setEmploymentHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const buildPayload = (): MaidProfile => ({
    fullName: profile.fullName,
    referenceCode: profile.referenceCode,
    type: profile.type,
    nationality: profile.nationality,
    dateOfBirth: profile.dateOfBirth,
    placeOfBirth: profile.placeOfBirth,
    height: Number(profile.height) || 0,
    weight: Number(profile.weight) || 0,
    religion: profile.religion,
    maritalStatus: profile.maritalStatus,
    numberOfChildren: Number(profile.numberOfChildren) || 0,
    numberOfSiblings: Number(profile.numberOfSiblings) || 0,
    homeAddress: profile.homeAddress,
    airportRepatriation: profile.airportRepatriation,
    educationLevel: profile.educationLevel,
    languageSkills,
    skillsPreferences: {
      availabilityRemark,
      privateInfo,
      offDaysPerMonth: profile.offDaysPerMonth,
      otherInformation,
    },
    workAreas,
    employmentHistory,
    introduction: {
      intro: introduction,
      publicIntro: publicIntroduction,
    },
    agencyContact: {
      ...agencyContact,
      passportNo: profile.passportNo,
    },
    isPublic: false,
    hasPhoto: false,
  });

  const handleContinue = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
      return;
    }
    void handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = buildPayload();
      const response = await fetch("/api/maids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; maid?: MaidProfile };
      if (!response.ok || !data.maid) {
        throw new Error(data.error || "Failed to create maid");
      }

      toast.success("Maid created successfully");
      navigate(`/maid/${encodeURIComponent(data.maid.referenceCode)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create maid");
    } finally {
      setIsSubmitting(false);
    }
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
  };

  return (
    <div className="page-container">
<<<<<<< HEAD
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">Add Maid</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
=======
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-bold">Add Maid</h2>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b pb-2">
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
<<<<<<< HEAD
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
              activeTab === i
                ? "bg-primary text-white shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
=======
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === i ? "bg-primary text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/70"
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

<<<<<<< HEAD
      {activeTab === 0 && <ProfileTab maidData={maidData} updateMaidData={updateMaidData} />}
      {activeTab === 1 && <SkillsTab maidData={maidData} updateMaidData={updateMaidData} />}
      {activeTab === 2 && <EmploymentHistoryTab maidData={maidData} updateMaidData={updateMaidData} />}
      {activeTab === 3 && <AvailabilityTab maidData={maidData} updateMaidData={updateMaidData} />}
      {activeTab === 4 && <IntroductionTab maidData={maidData} updateMaidData={updateMaidData} />}
      {activeTab === 5 && <PublicIntroductionTab maidData={maidData} updateMaidData={updateMaidData} />}
      {activeTab === 6 && <PrivateInfoTab maidData={maidData} updateMaidData={updateMaidData} />}

      <div className="flex justify-center mt-6">
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Submit Maid Profile"}
        </Button>
      </div>
    </div>
  );
};

const ProfileTab = ({ maidData, updateMaidData }: { maidData: MaidProfile; updateMaidData: (field: keyof MaidProfile, value: any) => void }) => (
  <div className="content-card animate-fade-in-up space-y-6">
    <h3 className="text-center font-bold text-lg">(A) PROFILE OF FDW</h3>

    <div className="section-header">A1. Personal Information</div>
    <div className="space-y-3 pt-2">
      {[
        ["Maid Name", "Ref Code"],
        ["Type", "Nationality"],
        ["Date of Birth", "Place of Birth"],
        ["Height", "Weight"],
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {row.map((label) => (
            <div key={label} className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
              {label === "Type" ? (
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={maidData.type}
                  onChange={(e) => updateMaidData('type', e.target.value)}
                >
                  <option value="">Select type</option>
                  <option>New maid</option>
                  <option>Transfer maid</option>
                  <option>APS maid</option>
                  <option>Ex-Singapore maid</option>
                  <option>Ex-Hong Kong maid</option>
                  <option>Ex-Taiwan maid</option>
                  <option>Ex-Malaysia maid</option>
                  <option>Ex-Middle East maid</option>
                  <option>Applying to work in Hong Kong</option>
                  <option>Applying to work in Canada</option>
                  <option>Applying to work in Taiwan</option>
                </select>
              ) : label === "Date of Birth" ? (
                <Input
                  type="date"
                  value={maidData.dateOfBirth}
                  onChange={(e) => updateMaidData('dateOfBirth', e.target.value)}
                />
              ) : label === "Height" ? (
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={maidData.height || ""}
                  onChange={(e) => updateMaidData('height', parseInt(e.target.value))}
                >
                  <option value="">Select height</option>
                  {Array.from({length:41},(_,i)=>150+i).map(cm=>(
                  <option key={cm} value={cm}>{cm}cm</option>
                ))}
                </select>
              ) : label === "Weight" ? (
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={maidData.weight || ""}
                  onChange={(e) => updateMaidData('weight', parseInt(e.target.value))}
                >
                  <option value="">Select weight</option>
                  {Array.from({length:51},(_,i)=>40+i).map(kg=>(
                  <option key={kg} value={kg}>{kg}kg</option>
                ))}
                </select>
              ) : label === "Nationality" ? (
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={maidData.nationality}
                  onChange={(e) => updateMaidData('nationality', e.target.value)}
                >
                  <option value="">Select nationality</option>
                  <option>Filipino maid</option><option>Indonesian maid</option><option>Indian maid</option><option>Myanmar maid</option>
                </select>
              ) : label === "Maid Name" ? (
                <Input
                  value={maidData.fullName}
                  onChange={(e) => updateMaidData('fullName', e.target.value)}
                />
              ) : label === "Ref Code" ? (
                <Input
                  value={maidData.referenceCode}
                  onChange={(e) => updateMaidData('referenceCode', e.target.value)}
                />
              ) : label === "Place of Birth" ? (
                <Input
                  value={maidData.placeOfBirth}
                  onChange={(e) => updateMaidData('placeOfBirth', e.target.value)}
                />
              ) : (
                <Input />
              )}
            </div>
          ))}
        </div>
      ))}

      {["Residential Address in Home Country", "Name of Port/Airport to be Repatriated", "Contact Number in Home Country"].map((label) => (
        <div key={label} className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
          {label === "Residential Address in Home Country" ? (
            <Input
              value={maidData.homeAddress}
              onChange={(e) => updateMaidData('homeAddress', e.target.value)}
            />
          ) : label === "Name of Port/Airport to be Repatriated" ? (
            <Input
              value={maidData.airportRepatriation}
              onChange={(e) => updateMaidData('airportRepatriation', e.target.value)}
            />
          ) : (
            <Input />
          )}
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">Education</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={maidData.educationLevel}
            onChange={(e) => updateMaidData('educationLevel', e.target.value)}
          >
            <option value="">Select education</option>
            <option>College/Degree (≥13 yrs)</option><option>High School (10-12 yrs)</option><option>Primary (≤6 yrs)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">Religion</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={maidData.religion}
            onChange={(e) => updateMaidData('religion', e.target.value)}
          >
            <option value="">Select religion</option>
            <option>Catholic</option><option>Christian</option><option>Muslim</option><option>Hindu</option><option>Buddhist</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">Marital Status</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={maidData.maritalStatus}
            onChange={(e) => updateMaidData('maritalStatus', e.target.value)}
          >
            <option value="">Select status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">Number of Children</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={maidData.numberOfChildren}
            onChange={(e) => updateMaidData('numberOfChildren', parseInt(e.target.value) || 0)}
          >
            {Array.from({length:11},(_,i)=>i).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">Number of Siblings</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={maidData.numberOfSiblings}
            onChange={(e) => updateMaidData('numberOfSiblings', parseInt(e.target.value) || 0)}
          >
            {Array.from({length:11},(_,i)=>i).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
    </div>

    <div className="section-header">Language Skills</div>
    <div className="space-y-3 pt-2">
      {["English", "Mandarin/Chinese-Dialect", "Bahasa Indonesia/Malaysia", "Hindi", "Tamil"].map((lang) => (
        <div key={lang} className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Label className="text-sm w-48">{lang}:</Label>
          <div className="flex gap-4">
            {["Zero", "Poor", "Little", "Fair", "Good"].map((level) => (
              <label key={level} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={lang}
                  value={level}
                  checked={maidData.languageSkills[lang] === level}
                  onChange={(e) => updateMaidData('languageSkills', { ...maidData.languageSkills, [lang]: e.target.value })}
                />
                {level}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="section-header">Other Information</div>
    <div className="space-y-2 pt-2">
      {[
        "Able to handle pork?",
        "Able to eat pork?",
        "Able to care for dog/cat?",
        "Able to do simple sewing?",
        "Able to do gardening work?",
        "Willing to wash car?",
        "Willing to work on off-days with compensation?",
      ].map((q) => (
        <div key={q} className="flex items-center gap-4">
          <span className="text-sm flex-1">{q}</span>
          <div className="flex gap-3">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name={q}
                value="true"
                checked={maidData.skillsPreferences[q] === true}
                onChange={(e) => updateMaidData('skillsPreferences', { ...maidData.skillsPreferences, [q]: true })}
              /> Yes
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name={q}
                value="false"
                checked={maidData.skillsPreferences[q] === false}
                onChange={(e) => updateMaidData('skillsPreferences', { ...maidData.skillsPreferences, [q]: false })}
              /> No
            </label>
          </div>
        </div>
      ))}
    </div>

    <div className="section-header">A2. Medical History/Dietary Restrictions</div>
    <div className="space-y-3 pt-2">
      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Allergies (if any)</Label>
        <Input
          value={maidData.introduction.allergies || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, allergies: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Physical disabilities</Label>
        <Input
          value={maidData.introduction.physicalDisabilities || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, physicalDisabilities: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Dietary restrictions</Label>
        <Input
          value={maidData.introduction.dietaryRestrictions || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, dietaryRestrictions: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground">Food handling preferences</Label>
        <Input
          value={maidData.introduction.foodHandlingPreferences || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, foodHandlingPreferences: e.target.value })}
        />
      </div>

      <p className="text-sm font-medium">Past and existing illnesses:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {["Mental illness", "Epilepsy", "Asthma", "Diabetes", "Hypertension", "Tuberculosis", "Heart disease", "Malaria", "Operations"].map((illness) => (
          <div key={illness} className="flex items-center gap-3">
            <span className="text-sm flex-1">{illness}</span>
            <div className="flex gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name={illness}
                  value="true"
                  checked={maidData.introduction.pastIllnesses?.[illness] === true}
                  onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, pastIllnesses: { ...maidData.introduction.pastIllnesses, [illness]: true } })}
                /> Yes
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name={illness}
                  value="false"
                  checked={maidData.introduction.pastIllnesses?.[illness] === false}
                  onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, pastIllnesses: { ...maidData.introduction.pastIllnesses, [illness]: false } })}
                /> No
              </label>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Others (please specify)</Label>
          <Input
            value={maidData.introduction.otherIllnesses || ""}
            onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, otherIllnesses: e.target.value })}
          />
        </div>
      </div>
    </div>

    <div className="section-header">A3. Others</div>
    <div className="pt-2">
      <Label className="text-xs text-muted-foreground">Any other remarks</Label>
      <Input
        value={maidData.introduction.otherRemarks || ""}
        onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, otherRemarks: e.target.value })}
      />
    </div>

    <div className="flex justify-center pt-4">
      <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">Save and Continue</Button>
    </div>
  </div>
);

const SkillsTab = ({ maidData, updateMaidData }: { maidData: MaidProfile; updateMaidData: (field: keyof MaidProfile, value: any) => void }) => (
  <div className="content-card animate-fade-in-up space-y-4">
    <h3 className="font-bold text-center">Maid Skills</h3>
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-muted">
          <th className="border px-3 py-2 text-left">Areas of Work</th>
          <th className="border px-3 py-2">Willingness</th>
          <th className="border px-3 py-2">Experience</th>
          <th className="border px-3 py-2">Evaluation</th>
        </tr>
      </thead>
      <tbody>
        {["Care of infants/children", "Care of elderly", "Care of disabled", "General housework", "Cooking", "Language Skill", "Other Skill"].map((skill) => (
          <tr key={skill}>
            <td className="border px-3 py-2">{skill}</td>
            <td className="border px-3 py-2 text-center">
              <input
                type="checkbox"
                checked={maidData.workAreas[skill]?.willingness || false}
                onChange={(e) => updateMaidData('workAreas', { ...maidData.workAreas, [skill]: { ...maidData.workAreas[skill], willingness: e.target.checked } })}
              />
            </td>
            <td className="border px-3 py-2 text-center">
              <input
                type="checkbox"
                checked={maidData.workAreas[skill]?.experience || false}
                onChange={(e) => updateMaidData('workAreas', { ...maidData.workAreas, [skill]: { ...maidData.workAreas[skill], experience: e.target.checked } })}
              />
            </td>
            <td className="border px-3 py-2 text-center">
              <select
                className="border rounded px-2 py-1 text-xs bg-background"
                value={maidData.workAreas[skill]?.evaluation || ""}
                onChange={(e) => updateMaidData('workAreas', { ...maidData.workAreas, [skill]: { ...maidData.workAreas[skill], evaluation: e.target.value } })}
              >
                <option value="">-</option><option>★</option><option>★★</option><option>★★★</option><option>★★★★</option><option>★★★★★</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="flex justify-center pt-4">
      <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">Save and Continue</Button>
    </div>
  </div>
);

const EmploymentHistoryTab = ({ maidData, updateMaidData }: { maidData: MaidProfile; updateMaidData: (field: keyof MaidProfile, value: any) => void }) => {
  const addRow = () => {
    const newHistory = [...maidData.employmentHistory, { from: "", to: "", country: "", employer: "", duties: "", remarks: "" }];
    updateMaidData('employmentHistory', newHistory);
  };

  const removeLastRow = () => {
    if (maidData.employmentHistory.length > 0) {
      updateMaidData('employmentHistory', maidData.employmentHistory.slice(0, -1));
    }
  };

  const updateHistory = (index: number, field: string, value: string) => {
    const newHistory = [...maidData.employmentHistory];
    newHistory[index] = { ...newHistory[index], [field]: value };
    updateMaidData('employmentHistory', newHistory);
  };

  return (
    <div className="content-card animate-fade-in-up space-y-4">
      <h3 className="font-bold text-center">Employment History</h3>

      <table className="w-full text-sm border border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="border px-3 py-2">From</th>
            <th className="border px-3 py-2">To</th>
            <th className="border px-3 py-2">Country</th>
            <th className="border px-3 py-2">Employer</th>
            <th className="border px-3 py-2">Maid Duties</th>
            <th className="border px-3 py-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {maidData.employmentHistory.map((row, index) => (
            <tr key={index}>
              <td className="border px-3 py-2">
                <Input
                  value={row.from}
                  onChange={(e) => updateHistory(index, 'from', e.target.value)}
                  placeholder="YYYY"
                />
              </td>
              <td className="border px-3 py-2">
                <Input
                  value={row.to}
                  onChange={(e) => updateHistory(index, 'to', e.target.value)}
                  placeholder="YYYY"
                />
              </td>
              <td className="border px-3 py-2">
                <Input
                  value={row.country}
                  onChange={(e) => updateHistory(index, 'country', e.target.value)}
                />
              </td>
              <td className="border px-3 py-2">
                <Input
                  value={row.employer}
                  onChange={(e) => updateHistory(index, 'employer', e.target.value)}
                />
              </td>
              <td className="border px-3 py-2">
                <Input
                  value={row.duties}
                  onChange={(e) => updateHistory(index, 'duties', e.target.value)}
                />
              </td>
              <td className="border px-3 py-2">
                <Input
                  value={row.remarks}
                  onChange={(e) => updateHistory(index, 'remarks', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={addRow} variant="outline">Add Row</Button>
        <Button onClick={removeLastRow} variant="outline" disabled={maidData.employmentHistory.length === 0}>Remove Last Row</Button>
      </div>
    </div>
  );
};
                <td key={i} className="border px-2 py-1">
                  <Input className="h-8 text-xs" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          className="px-4 bg-green-600 text-white hover:bg-green-700"
          onClick={addRow}
        >
          Add Row
        </Button>
        <Button
          className="px-4 bg-red-500 text-white hover:bg-red-600"
          onClick={removeLastRow}
        >
          Remove Last Row
        </Button>
        <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">
          Save and Continue
        </Button>
      </div>
    </div>
  );
};

const AvailabilityTab = ({ maidData, updateMaidData }: { maidData: MaidProfile; updateMaidData: (field: keyof MaidProfile, value: any) => void }) => (
  <div className="content-card animate-fade-in-up">
    <h3 className="font-bold text-center mb-4">Availability / Remark</h3>
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">When will this maid be Available?</Label>
        <Input
          value={maidData.introduction.availability || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, availability: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Contract Ends</Label>
        <Input
          value={maidData.introduction.contractEnds || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, contractEnds: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Present Salary (S$)</Label>
        <Input
          value={maidData.introduction.presentSalary || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, presentSalary: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Expected Salary</Label>
        <Input
          value={maidData.introduction.expectedSalary || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, expectedSalary: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Offday Compensation (S$/day)</Label>
        <Input
          value={maidData.introduction.offdayCompensation || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, offdayCompensation: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Number of off-days per month</Label>
        <Input
          value={maidData.introduction.offDaysPerMonth || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, offDaysPerMonth: e.target.value })}
        />
      </div>
    </div>
    <div className="flex justify-center pt-4">
      <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">Save and Continue</Button>
    </div>
  </div>
);

const IntroductionTab = ({ maidData, updateMaidData }: { maidData: MaidProfile; updateMaidData: (field: keyof MaidProfile, value: any) => void }) => (
  <div className="content-card animate-fade-in-up">
    <h3 className="font-bold text-center mb-4">Introduction</h3>
    <textarea
      className="w-full min-h-[200px] rounded-md border bg-background px-3 py-2 text-sm"
      value={maidData.introduction.generalIntroduction || ""}
      onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, generalIntroduction: e.target.value })}
      placeholder="Enter introduction here..."
    />
    <div className="flex justify-center pt-4">
      <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">Save and Continue</Button>
    </div>
  </div>
);

const PublicIntroductionTab = ({ maidData, updateMaidData }: { maidData: MaidProfile; updateMaidData: (field: keyof MaidProfile, value: any) => void }) => (
  <div className="content-card animate-fade-in-up">
    <h3 className="font-bold text-center mb-4">Public Introduction</h3>
    <textarea
      className="w-full min-h-[200px] rounded-md border bg-background px-3 py-2 text-sm"
      value={maidData.introduction.publicIntroduction || ""}
      onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, publicIntroduction: e.target.value })}
      placeholder="Enter public introduction here..."
    />
    <div className="flex justify-center pt-4">
      <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">Save and Continue</Button>
    </div>
  </div>
);

const PrivateInfoTab = ({ maidData, updateMaidData }: { maidData: MaidProfile; updateMaidData: (field: keyof MaidProfile, value: any) => void }) => (
  <div className="content-card animate-fade-in-up">
    <h3 className="font-bold text-center mb-4">Private Info</h3>
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Ages of Children</Label>
        <Input
          value={maidData.introduction.agesOfChildren || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, agesOfChildren: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Maid Loan (S$)</Label>
        <Input
          value={maidData.introduction.maidLoan || ""}
          onChange={(e) => updateMaidData('introduction', { ...maidData.introduction, maidLoan: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Agency Contact Person</Label>
        <Input
          value={maidData.agencyContact.contactPerson || ""}
          onChange={(e) => updateMaidData('agencyContact', { ...maidData.agencyContact, contactPerson: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Agency Contact Number</Label>
        <Input
          value={maidData.agencyContact.contactNumber || ""}
          onChange={(e) => updateMaidData('agencyContact', { ...maidData.agencyContact, contactNumber: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium">Agency License Number</Label>
        <Input
          value={maidData.agencyContact.licenseNumber || ""}
          onChange={(e) => updateMaidData('agencyContact', { ...maidData.agencyContact, licenseNumber: e.target.value })}
        />
      </div>
    </div>
    <div className="flex justify-center pt-4">
      <Button className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">Save and Continue</Button>
    </div>
  </div>
);
=======
      {activeTab === 0 && (
        <div className="content-card animate-fade-in-up space-y-6">
          <h3 className="text-center text-lg font-bold">(A) PROFILE OF FDW</h3>

          <div className="section-header">A1. Personal Information</div>
          <div className="space-y-3 pt-2">
            {[
              ["Maid Name", "Ref Code"],
              ["Type", "Nationality"],
              ["Date of Birth", "Place of Birth"],
              ["Height", "Weight"],
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {row.map((label) => (
                  <div key={label} className="flex flex-col gap-1">
                    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
                    {label === "Maid Name" && <Input value={profile.fullName} onChange={(e) => handleProfileChange("fullName", e.target.value)} />}
                    {label === "Ref Code" && <Input value={profile.referenceCode} onChange={(e) => handleProfileChange("referenceCode", e.target.value)} />}
                    {label === "Type" && (
                      <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={profile.type} onChange={(e) => handleProfileChange("type", e.target.value)}>
                        <option>New maid</option>
                        <option>Transfer maid</option>
                        <option>APS maid</option>
                        <option>Ex-Singapore maid</option>
                        <option>Ex-Hong Kong maid</option>
                        <option>Ex-Taiwan maid</option>
                        <option>Ex-Malaysia maid</option>
                        <option>Ex-Middle East maid</option>
                      </select>
                    )}
                    {label === "Nationality" && (
                      <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={profile.nationality} onChange={(e) => handleProfileChange("nationality", e.target.value)}>
                        <option>Filipino maid</option>
                        <option>Indonesian maid</option>
                        <option>Indian maid</option>
                        <option>Myanmar maid</option>
                      </select>
                    )}
                    {label === "Date of Birth" && <Input type="date" value={profile.dateOfBirth} onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)} />}
                    {label === "Place of Birth" && <Input value={profile.placeOfBirth} onChange={(e) => handleProfileChange("placeOfBirth", e.target.value)} />}
                    {label === "Height" && <Input type="number" value={profile.height} onChange={(e) => handleProfileChange("height", e.target.value)} />}
                    {label === "Weight" && <Input type="number" value={profile.weight} onChange={(e) => handleProfileChange("weight", e.target.value)} />}
                  </div>
                ))}
              </div>
            ))}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-muted-foreground">Number of Children</Label>
                <Input type="number" value={profile.numberOfChildren} onChange={(e) => handleProfileChange("numberOfChildren", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-muted-foreground">Number of Siblings</Label>
                <Input type="number" value={profile.numberOfSiblings} onChange={(e) => handleProfileChange("numberOfSiblings", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-muted-foreground">Marital Status</Label>
                <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={profile.maritalStatus} onChange={(e) => handleProfileChange("maritalStatus", e.target.value)}>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-muted-foreground">Religion</Label>
                <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={profile.religion} onChange={(e) => handleProfileChange("religion", e.target.value)}>
                  <option>Catholic</option>
                  <option>Christian</option>
                  <option>Muslim</option>
                  <option>Hindu</option>
                  <option>Buddhist</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">Address in Home Country</Label>
              <Input value={profile.homeAddress} onChange={(e) => handleProfileChange("homeAddress", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-muted-foreground">Airport To Be Repatriated</Label>
                <Input value={profile.airportRepatriation} onChange={(e) => handleProfileChange("airportRepatriation", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-muted-foreground">Education</Label>
                <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={profile.educationLevel} onChange={(e) => handleProfileChange("educationLevel", e.target.value)}>
                  <option>College/Degree (&gt;=13 yrs)</option>
                  <option>High School (10-12 yrs)</option>
                  <option>Primary (&lt;=6 yrs)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section-header">Language Skills</div>
          <div className="space-y-3 pt-2">
            {languageOptions.map((lang) => (
              <div key={lang} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Label className="w-56 text-sm">{lang}:</Label>
                <div className="flex flex-wrap gap-4">
                  {["Zero", "Poor", "Little", "Fair", "Good"].map((level) => (
                    <label key={level} className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name={lang}
                        checked={languageSkills[lang] === level}
                        onChange={() => setLanguageSkills((prev) => ({ ...prev, [lang]: level }))}
                        className="accent-primary"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="section-header">Other Information</div>
          <div className="space-y-2 pt-2">
            {yesNoQuestions.map((question) => (
              <div key={question} className="flex items-center gap-4">
                <span className="flex-1 text-sm">{question}</span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name={question} checked={otherInformation[question] === true} onChange={() => setOtherInformation((prev) => ({ ...prev, [question]: true }))} /> Yes</label>
                  <label className="flex items-center gap-1 text-sm"><input type="radio" name={question} checked={otherInformation[question] === false} onChange={() => setOtherInformation((prev) => ({ ...prev, [question]: false }))} /> No</label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90" disabled={isSubmitting} onClick={handleContinue}>
              {isSubmitting ? "Saving..." : nextLabel}
            </Button>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="content-card animate-fade-in-up space-y-4">
          <h3 className="text-center font-bold">Maid Skills</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="border px-3 py-2 text-left">Areas of Work</th>
                <th className="border px-3 py-2">Willingness</th>
                <th className="border px-3 py-2">Experience</th>
                <th className="border px-3 py-2">Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {skillAreas.map((skill) => (
                <tr key={skill}>
                  <td className="border px-3 py-2">{skill}</td>
                  <td className="border px-3 py-2 text-center"><input type="checkbox" checked={workAreas[skill]?.willing ?? false} onChange={(e) => updateWorkArea(skill, "willing", e.target.checked)} /></td>
                  <td className="border px-3 py-2 text-center"><input type="checkbox" checked={workAreas[skill]?.experience ?? false} onChange={(e) => updateWorkArea(skill, "experience", e.target.checked)} /></td>
                  <td className="border px-3 py-2 text-center">
                    <select className="rounded border bg-background px-2 py-1 text-xs" value={workAreas[skill]?.evaluation ?? "-"} onChange={(e) => updateWorkArea(skill, "evaluation", e.target.value)}>
                      <option>-</option>
                      <option>*</option>
                      <option>**</option>
                      <option>***</option>
                      <option>****</option>
                      <option>*****</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center pt-4">
            <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90" disabled={isSubmitting} onClick={handleContinue}>
              {nextLabel}
            </Button>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="content-card animate-fade-in-up space-y-4">
          <h3 className="text-center font-bold">Employment History</h3>
          <table className="w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="border px-3 py-2">From</th>
                <th className="border px-3 py-2">To</th>
                <th className="border px-3 py-2">Country</th>
                <th className="border px-3 py-2">Employer</th>
                <th className="border px-3 py-2">Maid Duties</th>
                <th className="border px-3 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {employmentHistory.map((row, index) => (
                <tr key={`${index}-${row.from}-${row.to}`}>
                  {(["from", "to", "country", "employer", "duties", "remarks"] as const).map((field) => (
                    <td key={field} className="border px-2 py-1">
                      <Input className="h-8 text-xs" value={row[field]} onChange={(e) => updateEmploymentRow(index, field, e.target.value)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center gap-4 pt-4">
            <Button className="bg-green-600 px-4 text-white hover:bg-green-700" onClick={addEmploymentRow}>Add Row</Button>
            <Button className="bg-red-500 px-4 text-white hover:bg-red-600" onClick={removeLastEmploymentRow}>Remove Last Row</Button>
            <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90" disabled={isSubmitting} onClick={handleContinue}>
              {nextLabel}
            </Button>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="content-card animate-fade-in-up space-y-4">
          <h3 className="mb-4 text-center font-bold">Availability / Remark</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">Number of off-days per month</Label>
              <Input value={profile.offDaysPerMonth} onChange={(e) => handleProfileChange("offDaysPerMonth", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">Passport No.</Label>
              <Input value={profile.passportNo} onChange={(e) => handleProfileChange("passportNo", e.target.value)} />
            </div>
          </div>
          <textarea className="min-h-[200px] w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Enter availability / remark here..." value={availabilityRemark} onChange={(e) => setAvailabilityRemark(e.target.value)} />
          <div className="flex justify-center pt-4">
            <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90" disabled={isSubmitting} onClick={handleContinue}>{nextLabel}</Button>
          </div>
        </div>
      )}

      {activeTab === 4 && (
        <div className="content-card animate-fade-in-up space-y-4">
          <h3 className="mb-4 text-center font-bold">Introduction</h3>
          <textarea className="min-h-[260px] w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Enter employer-login introduction here..." value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
          <div className="flex justify-center pt-4">
            <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90" disabled={isSubmitting} onClick={handleContinue}>{nextLabel}</Button>
          </div>
        </div>
      )}

      {activeTab === 5 && (
        <div className="content-card animate-fade-in-up space-y-4">
          <h3 className="mb-4 text-center font-bold">Public Introduction</h3>
          <textarea className="min-h-[260px] w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Enter public introduction here..." value={publicIntroduction} onChange={(e) => setPublicIntroduction(e.target.value)} />
          <div className="flex justify-center pt-4">
            <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90" disabled={isSubmitting} onClick={handleContinue}>{nextLabel}</Button>
          </div>
        </div>
      )}

      {activeTab === 6 && (
        <div className="content-card animate-fade-in-up space-y-4">
          <h3 className="mb-4 text-center font-bold">Private Info</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">Agency Name</Label>
              <Input value={agencyContact.companyName} onChange={(e) => setAgencyContact((prev) => ({ ...prev, companyName: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">License No.</Label>
              <Input value={agencyContact.licenseNo} onChange={(e) => setAgencyContact((prev) => ({ ...prev, licenseNo: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">Contact Person</Label>
              <Input value={agencyContact.contactPerson} onChange={(e) => setAgencyContact((prev) => ({ ...prev, contactPerson: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
              <Input value={agencyContact.phone} onChange={(e) => setAgencyContact((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>
          </div>
          <textarea className="min-h-[200px] w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Enter private information here..." value={privateInfo} onChange={(e) => setPrivateInfo(e.target.value)} />
          <div className="flex justify-center pt-4">
            <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90" disabled={isSubmitting} onClick={handleContinue}>
              {isSubmitting ? "Saving..." : nextLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
>>>>>>> 8e097706cde33f2043776e2bfb8f770544b0d87d

export default AddMaid;
