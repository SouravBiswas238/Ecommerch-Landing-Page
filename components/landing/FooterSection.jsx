import React from "react";
import { Building2, MapPin, Phone } from "lucide-react";

const FooterSection = ({ companyData }) => {
  const brandName = companyData?.name || "Good Day Cafeteria";
  const brandLogo = companyData?.logo || ""; 
  
  const address = "Anglin Global Building, 30-34 Market St, Montego Bay, Jamaica";
  const phone = "+18768190186";

  const lat = companyData?.restaurant_location?.lat || 18.4738007572826;
  const lng = companyData?.restaurant_location?.lng || -77.92093123690684;

  const instagramUrl = "https://www.instagram.com/gooddaycafeteria/?hl=en";
  const tiktokUrl = "https://www.tiktok.com/@gooddaycafeteriajamaica";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <footer className="w-full mt-10 bg-white border-t-[1px] border-[#3F9C9F] font-sans">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 md:px-6 lg:px-8">
        
        {/* Main Content Row */}
        <div className="grid gap-8 md:grid-cols-12 items-start pb-6">
          
          {/* Brand Info Block - Parallel Logo and Text arrangement */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white border border-[#3F9C9F] shadow-sm overflow-hidden">
                {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={24} className="text-[#3F9C9F]" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-800">{brandName}</h3>
                <p className="mt-1 max-w-xs text-xs text-slate-400 leading-relaxed">
                  Authentic Jamaican flavors, warm service, and a vibrant cafeteria experience.
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-3 sm:pl-20 md:pl-0">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F9C9F] text-white hover:bg-[#99C256] transition-colors">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>
              </a>
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F9C9F] text-white hover:bg-[#99C256] transition-colors">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.03 1.6 4.17 1.12 1.25 2.72 1.93 4.38 2.1v3.82c-1.88-.04-3.71-.69-5.18-1.85-.02 2.75-.01 5.5-.02 8.25-.09 2.5-1.18 4.93-3.07 6.57-2.34 2.1-5.78 2.64-8.64 1.35C2.45 23.1 1 19.83 1.4 16.53c.36-3.4 3.12-6.26 6.53-6.72.93-.14 1.88-.04 2.79.22V14c-.95-.42-2.07-.46-3.04.04-1.22.58-1.99 1.92-1.91 3.27.09 1.68 1.49 3.09 3.18 3.08 1.79.05 3.32-1.34 3.42-3.12.06-3.8.03-7.6.04-11.4 1.09-.01 2.17-.02 3.26-.04-.15-.94-.53-1.83-1.11-2.58-.75-.89-1.8-1.48-2.94-1.66V.02z" /></svg>
              </a>
            </div>
          </div>

          {/* Clean Info & Map Layout (No Cards) */}
          <div className="md:col-span-7 flex flex-col gap-4 w-full">
            
            {/* Contact Details row with layout freedom */}
            <div className="grid gap-4 sm:grid-cols-2 border-b border-slate-100 pb-4">
              
              {/* Location Block */}
              <div className="flex gap-2.5">
                <MapPin size={16} className="text-[#3F9C9F] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#3F9C9F]">Our Location</h4>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{address}</p>
                </div>
              </div>

              {/* Call Us Block - Headline & Phone on one line */}
              <a href={`tel:${phone}`} className="flex gap-2.5 group h-fit">
                <Phone size={16} className="text-[#3F9C9F] mt-0.5 shrink-0 group-hover:text-[#99C256] transition-colors" />
                <div className="flex flex-row items-baseline gap-2 flex-wrap">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#3F9C9F] group-hover:text-[#99C256] transition-colors">Hotline:</h4>
                  <p className="text-sm font-bold text-slate-700 tracking-wide group-hover:text-[#3F9C9F] transition-colors">{phone}</p>
                </div>
              </a>

            </div>

            {/* Completely Frameless Map View */}
            <div className="w-full h-36 rounded-xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
              <iframe
                title="Good Day Cafeteria Map"
                src={mapEmbedUrl}
                className="w-full h-full border-0 grayscale-[10%] contrast-[105%]"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400">
          <div>
            © {new Date().getFullYear()} <span className="font-medium text-slate-600">{brandName}</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-6 rounded-full bg-[#99C256]" />
            <div className="h-1 w-10 rounded-full bg-[#3F9C9F]" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;