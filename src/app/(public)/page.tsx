import Link from "next/link";
import { getUmrahPackages, getHotels } from "@/lib/data";
import PackageCard from "@/components/shared/package-card";
import { UmrahPackage, Hotel } from "@/lib/package-types";

export const dynamic = "force-dynamic";

import {
  Plane,
  Shield,
  Headphones,
  Users,
  MapPin,
  Star,
  ArrowRight,
  Building2,
  Compass,
  Award,
  Heart,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";

const fallbackImages: Record<string, string> = {
  Saudia: "https://images.unsplash.com/photo-1565058688641-6776481d1b84?w=800&auto=format&fit=crop",
  PIA: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop",
  Airblue: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop",
  SereneAir: "https://images.unsplash.com/photo-1527612820672-5b56351f7346?w=800&auto=format&fit=crop",
};

export default async function HomePage() {
  const stats = [
    { value: "25+", label: "Years of Service" },
    { value: "18,000+", label: "Pilgrims Served" },
    { value: "350+", label: "Partner Hotels" },
    { value: "120+", label: "Travel Agents" },
  ];

  const packages = await getUmrahPackages() as any[];
  const hotels = (await getHotels()) as unknown as Hotel[];

  const destinations = [
    {
      name: "Makkah",
      desc: "The Holy Kaaba & Masjid al-Haram",
      image:
        "https://images.unsplash.com/photo-1627728734379-a5f8c099763e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Madinah",
      desc: "Masjid an-Nabawi & Roza Rasool (SAW)",
      image:
        "https://images.unsplash.com/photo-1692977579997-948328cdb7d2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jeddah",
      desc: "Gateway city & Corniche",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqQENiTmMeNxF63HhW0abaxA6xbpQM3WbyJ2_rkp2FvofhUYANcFgxmLw&s=10",
    },
  ];

  const features = [
    {
      icon: Plane,
      title: "Premium Airlines",
      desc: "Partnerships with Saudia, PIA, Airblue & Serene Air for comfortable journeys.",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80",
    },
    {
      icon: Shield,
      title: "Guarantee",
      desc: "Transparent pricing with no hidden charges. IATA-approved travel provider.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKWB0TrlYNWUW1DG4w8WBVnj70ZQPtOxt2fyyPkmp6Evnnj84IH68tV7wt&s=10",
    },
    {
      icon: Building2,
      title: "Verified Hotels",
      desc: "Hand-picked hotels within walking distance of Haram in Makkah & Madinah.",
      image:
        "https://images.pexels.com/photos/2771935/pexels-photo-2771935.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      desc: "Personalized assistance throughout your journey, 24/7 in Saudi Arabia.",
      image:
        "https://images.pexels.com/photos/7658192/pexels-photo-7658192.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: Compass,
      title: "Guided Ziyarat",
      desc: "Comprehensive religious tours of historical sites in Makkah & Madinah.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTksS8nCrP2cXInz3njHPmmtKXES9Xg8i-MVKmiimgB9d3JXvINz_HXoA&s=10",
    },
    {
      icon: Award,
      title: "Licensed Operator",
      desc: "Ministry of Hajj & Umrah approved. Fully bonded & insured travel agency.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const testimonials = [
    {
      name: "Muhammad Asif Khan",
      role: "Travel Agent, Lahore",
      text: "Musa Travel Service has been our trusted partner for 6 years. Their rates beat every other operator and the support is exceptional.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Hafiza Ayesha Siddiqui",
      role: "Pilgrim, Karachi",
      text: "Alhamdulillah, our Umrah was perfectly organized. Hotel was 2 minutes from Haram. Will definitely book again.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Imran Mehmood",
      role: "Agency Owner, Islamabad",
      text: "The agent portal makes managing bookings effortless. Commissions are paid on time, every time. Highly recommended.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#1e3a8a]">
        {/* Background video with gradient overlay */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1565058688641-6776481d1b84?w=1920&auto=format&fit=crop&q=85"
            className="w-full h-full object-cover"
          >
            <source
              src="/hero.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/50 via-[#1e3a8a]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/40 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563eb]/20 border border-[#2563eb]/40 text-[#2563eb] text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles size={14} /> Ministry of Hajj Approved Operator
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Your Sacred Journey,
              <br />
              <span className="text-white">
                Seamlessly Organized
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Premium Hajj & Umrah travel services from Pakistan. Trusted by 18,000+
              pilgrims and 120+ travel agents for flights, hotels, and guided ziyarat
              across Makkah, Madinah & beyond.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/umrah-packages"
                className="group inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1e3a8a] text-white px-7 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-[#2563eb]/30 hover:shadow-xl hover:shadow-[#2563eb]/40 hover:-translate-y-0.5"
              >
                Explore Packages
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/agent/login"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-7 py-3.5 rounded-lg font-semibold transition-all backdrop-blur-sm"
              >
                Agent Portal Login
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { icon: Shield, label: "IATA Approved" },
                { icon: Award, label: "Ministry Licensed" },
                { icon: Users, label: "18,000+ Pilgrims" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/80">
                  <item.icon size={20} className="text-[#2563eb]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#0c1d4a] text-white border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-[#2563eb] font-semibold text-sm uppercase tracking-wider">
              Popular Packages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c1d4a] mt-2 mb-4">
              Curated Umrah Packages
            </h2>
            <p className="text-gray-600">
              All-inclusive packages with flights, hotels, visas, transfers, and
              guided ziyarat. Prices tailored for agents and individual pilgrims.
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No packages available at the moment. Please check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.slice(0, 6).map((pkg: UmrahPackage) => (
                <Link
                  key={pkg.id}
                  href="/umrah-packages"
                  className="block focus:outline-none"
                >
                  <PackageCard pkg={pkg} hotels={hotels} variant="featured" className="h-full" />
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/umrah-packages"
              className="inline-flex items-center gap-2 text-[#2563eb] hover:text-[#1e3a8a] font-semibold"
            >
              View All Packages <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-[#2563eb] font-semibold text-sm uppercase tracking-wider">
              Why Choose Musa Travel Service
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c1d4a] mt-2 mb-4">
              Your Journey, Our Commitment
            </h2>
            <p className="text-gray-600">
              For over 25 years, we have been the trusted name in Hajj & Umrah
              travel services across Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-[#2563eb]/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1d4a]/70 via-[#0c1d4a]/10 to-transparent" />
                  <div className="absolute -bottom-6 left-5 w-14 h-14 bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white">
                    <item.icon className="text-white" size={26} />
                  </div>
                </div>
                <div className="p-7 pt-9">
                  <h3 className="text-lg font-bold text-[#0c1d4a] mb-2 group-hover:text-[#2563eb] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#1e3a8a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/5620451/pexels-photo-5620451.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-[#2563eb] font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Trusted by Pilgrims & Agents
            </h2>
            <p className="text-gray-300">
              Real stories from the people who journeyed with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-[#2563eb] text-[#2563eb]" />
                  ))}
                </div>
                <p className="text-gray-200 leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      {/* <section className="py-16 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Heart className="shrink-0" size={40} />
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">
                Become a Registered Travel Agent
              </h3>
              <p className="text-white/90">
                Get exclusive B2B rates, commissions, and a powerful booking portal.
              </p>
            </div>
          </div>
          <Link
            href="/agent/login"
            className="inline-flex items-center gap-2 bg-white text-[#2563eb] px-7 py-3.5 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Register Now <ArrowRight size={18} />
          </Link>
        </div>
      </section> */}

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-[#2563eb] font-semibold text-sm uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c1d4a] mt-2 mb-6">
              Contact Musa Travel Service
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Have questions about our packages or need a custom quote? Reach out
              to our team &mdash; we respond within 24 hours, In sha Allah.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#2563eb]/30 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-[#2563eb]/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-[#2563eb]" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0c1d4a] mb-1">Head Office</h4>
                  <p className="text-sm text-gray-600">
                    Gulberg 3, Main Boulevard, Eden Tower LGF 6/8 Lahore
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#2563eb]/30 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-[#2563eb]/10 flex items-center justify-center shrink-0">
                  <Phone className="text-[#2563eb]" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0c1d4a] mb-1">Call / WhatsApp</h4>
                  <p className="text-sm text-gray-600">
                    0333 4390349 / 03390000007 (24/7 support)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#2563eb]/30 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-[#2563eb]/10 flex items-center justify-center shrink-0">
                  <Mail className="text-[#2563eb]" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0c1d4a] mb-1">Email</h4>
                  <p className="text-sm text-gray-600">musatravelagnecy1@gmail.com</p>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-8 bg-[#1e3a8a] hover:bg-[#0c1d4a] text-white px-7 py-3.5 rounded-lg font-semibold transition-colors"
            >
              Send a Message <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg h-[450px] border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.0!2d74.3483!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMjAnNTQuMCJF!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}