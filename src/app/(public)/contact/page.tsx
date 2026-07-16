"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send message");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#0c1d4a] mb-4">Contact Us</h1>
        <p className="text-gray-600">Get in touch with our team for any inquiries or support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#dc2626]/10 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="text-[#dc2626]" size={20} />
              </div>
              <div>
                <h3 className="font-bold">Head Office</h3>
                <p className="text-sm text-gray-600 mt-1">Gulberg 3, Main Boulevard, Eden Tower LGF 6/8 Lahore</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#dc2626]/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="text-[#dc2626]" size={20} />
              </div>
              <div>
                <h3 className="font-bold">Phone</h3>
                <p className="text-sm text-gray-600 mt-1">0333 4390349 / 03390000007</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#dc2626]/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="text-[#dc2626]" size={20} />
              </div>
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="text-sm text-gray-600 mt-1">musatravelagnecy1@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#dc2626]/10 rounded-full flex items-center justify-center shrink-0">
                <Clock className="text-[#dc2626]" size={20} />
              </div>
              <div>
                <h3 className="font-bold">Working Hours</h3>
                <p className="text-sm text-gray-600 mt-1">Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#0c1d4a] mb-2">Message Sent!</h3>
              <p className="text-gray-600">Thank you for contacting us. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Send a Message</h2>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" type="text" required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" type="tel" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input name="subject" type="text" required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" rows={4} required className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#dc2626] outline-none" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
