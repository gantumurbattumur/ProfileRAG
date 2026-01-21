import { Mail, Phone, MapPin, Linkedin, Github, Globe, Download } from "lucide-react";
import { contact, resume } from "../data/profile";

const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid var(--border)',
  borderRadius: '1rem',
  padding: '1.5rem',
};

export default function AboutMeCard() {
  return (
    <div className="space-y-4">
      {/* Contact Information - always show */}
      <div style={cardStyle}>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Contact
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <a
              href={`mailto:${contact.email}`}
              className="hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <span>{contact.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
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
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition hover:opacity-80"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <IconComponent className="w-4 h-4" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Resume Download */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Resume
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {resume.lastUpdated}
            </p>
          </div>
          <a
            href={resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:opacity-90"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
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
