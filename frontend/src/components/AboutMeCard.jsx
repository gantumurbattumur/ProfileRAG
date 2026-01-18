import { Mail, Phone, MapPin, Linkedin, Github, Globe, Download } from "lucide-react";
import { contact, resume } from "../data/profile";
import { cardBase } from "../styles/cardStyles";

export default function AboutMeCard() {
  return (
    <div className="space-y-4">
      {/* Contact Information - always show */}
      <div className={cardBase}>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Contact
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            <span>{contact.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
          {contact.links.map((link, idx) => {
            const getIcon = (label) => {
              if (label.toLowerCase().includes("linkedin")) return Linkedin;
              if (label.toLowerCase().includes("github")) return Github;
              if (label.toLowerCase().includes("portfolio") || label.toLowerCase().includes("website")) return Globe;
              return Mail;
            };
            const IconComponent = getIcon(link.label);
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:shadow-sm transition"
              >
                <IconComponent className="w-4 h-4" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Resume Download */}
      <div className={cardBase}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Resume</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Last updated: {resume.lastUpdated}</p>
          </div>
          <a
            href={resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            aria-label="Download Resume"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
          </a>
        </div>
      </div>
    </div>
  );
}
