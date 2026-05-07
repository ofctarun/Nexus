import { Globe, Link2, Mail } from 'lucide-react'

const productLinks = ['Overview', 'Features', 'Security', 'Pricing']
const resourceLinks = ['Documentation', 'API Reference', 'Blog', 'Support']
const companyLinks = ['About', 'Careers', 'Contact', 'Privacy Policy']

export default function Footer() {
  return (
    <footer className="bg-black border-t border-nexus-border py-10 sm:py-14 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Col 1: Logo & tagline */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <div className="w-8 h-8 rounded-lg bg-nexus-glow/20 border border-nexus-glow/30 flex items-center justify-center">
                <span className="text-nexus-glow font-bold text-sm">N</span>
              </div>
              <span className="text-nexus-white font-semibold text-lg">Nexus</span>
            </div>
            <p className="text-nexus-soft-gray/40 text-xs sm:text-sm leading-relaxed max-w-xs">
              AI Document Intelligence Platform
            </p>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-nexus-white font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-nexus-soft-gray/60 text-xs sm:text-sm hover:text-nexus-white transition-colors block py-1">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-nexus-white font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-nexus-soft-gray/60 text-xs sm:text-sm hover:text-nexus-white transition-colors block py-1">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-nexus-white font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-nexus-soft-gray/60 text-xs sm:text-sm hover:text-nexus-white transition-colors block py-1">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 sm:pt-8 border-t border-nexus-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-nexus-soft-gray/30 text-xs sm:text-sm">
            © 2025 Nexus. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[
              { Icon: Globe, label: 'Website' },
              { Icon: Link2, label: 'Social' },
              { Icon: Mail, label: 'Email' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-nexus-soft-gray/40 hover:text-nexus-glow transition-colors duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
