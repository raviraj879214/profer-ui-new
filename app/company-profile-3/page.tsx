"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  companyStreetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  ein: string;
  servicesOffered: string[];
  qualificationLevel: string[];
  serviceArea: string;
  yearEstablished: string;
  companyLogo: File | null;
  driversLicense: File | null;
  toggleCheck: boolean;
}

export default function BackgroundCheckForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    ownerEmail: "",
    ownerFirstName: "",
    ownerLastName: "",
    companyStreetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    ein: "",
    servicesOffered: [],
    qualificationLevel: [],
    serviceArea: "",
    yearEstablished: "",
    companyLogo: null,
    driversLicense: null,
    toggleCheck: false,
  });

  const servicesOptions = ["Plumbing", "Electrical", "HVAC", "Landscaping"];
  const qualificationOptions = ["Certified", "Licensed", "Bonded", "Insured"];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files && files.length > 0 ? files[0] : null,
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (
    e: ChangeEvent<HTMLSelectElement>,
    field: "servicesOffered" | "qualificationLevel"
  ) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, [field]: selected }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form submitted! Check console for data.");
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl text-xs text-gray-700">
      <h1 className="text-center text-base font-semibold mb-8">
        Background & I.D. Check Plugin
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Company Name</label>
          <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Company Phone</label>
          <input name="companyPhone" value={formData.companyPhone} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Company Email</label>
          <input name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Owner Email</label>
          <input name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Owner First Name</label>
          <input name="ownerFirstName" value={formData.ownerFirstName} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Owner Last Name</label>
          <input name="ownerLastName" value={formData.ownerLastName} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Street Address</label>
          <input name="companyStreetAddress" value={formData.companyStreetAddress} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>City</label>
          <input name="city" value={formData.city} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>State</label>
          <input name="state" value={formData.state} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Zip Code</label>
          <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Federal Tax ID (EIN)</label>
          <input name="ein" value={formData.ein} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label>Year Established</label>
          <input name="yearEstablished" value={formData.yearEstablished} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        {/* Multi-select: Services Offered */}
        <div>
          <label>Services Offered</label>
          <select multiple value={formData.servicesOffered} onChange={(e) => handleMultiSelectChange(e, "servicesOffered")} className="w-full border px-2 py-1 rounded h-24">
            {servicesOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Multi-select: Qualification Levels */}
        <div>
          <label>Qualification Level</label>
          <select multiple value={formData.qualificationLevel} onChange={(e) => handleMultiSelectChange(e, "qualificationLevel")} className="w-full border px-2 py-1 rounded h-24">
            {qualificationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label>Service Area</label>
          <input name="serviceArea" value={formData.serviceArea} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
        </div>

        {/* Uploads */}
        <div>
          <label className="block mb-1">Company Logo</label>
          <input type="file" name="companyLogo" onChange={handleInputChange} />
        </div>

        <div>
          <label className="block mb-1">Owner's Driver's License</label>
          <input type="file" name="driversLicense" onChange={handleInputChange} />
        </div>

        {/* Toggle */}
        <div className="md:col-span-2 flex items-center space-x-2">
          <input type="checkbox" name="toggleCheck" checked={formData.toggleCheck} onChange={handleInputChange} />
          <label>Agree to Terms</label>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button type="submit" className="bg-red-600 text-white px-8 py-2 rounded-full shadow hover:bg-red-700">
            Save
          </button>
        </div>
      </form>
    </main>
  );
}
