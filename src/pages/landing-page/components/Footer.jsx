import React from 'react';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '#api' },
      { label: 'Integrations', href: '#integrations' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press', href: '#press' }
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'Status', href: '#status' },
      { label: 'Community', href: '#community' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#twitter' },
    { name: 'Facebook', icon: 'Facebook', href: '#facebook' },
    { name: 'Instagram', icon: 'Instagram', href: '#instagram' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#linkedin' },
    { name: 'YouTube', icon: 'Youtube', href: '#youtube' }
  ];

  const certifications = [
    { name: 'HIPAA Compliant', icon: 'Shield' },
    { name: 'SOC 2 Type II', icon: 'Award' },
    { name: 'ISO 27001', icon: 'CheckCircle' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Icon name="Dumbbell" size={20} color="white" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Denny's Fitness Track
                </span>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                Transform your fitness journey with intelligent goal tracking, daily check-ins, 
                and AI-powered coaching recommendations. Your personal fitness companion for lasting results.
              </p>

              {/* Newsletter Signup */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Stay Updated</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150">
                    <Icon name="Send" size={16} />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks?.map((social) => (
                  <a
                    key={social?.name}
                    href={social?.href}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
                    aria-label={social?.name}
                  >
                    <Icon name={social?.icon} size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks?.product?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks?.company?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-3 mb-6">
                {footerLinks?.support?.map((link) => (
                  <li key={link?.label}>
                    <a
                      href={link?.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Mail" size={14} />
                  <span>support@fitnesstrack.com</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Phone" size={14} />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications & Trust Signals */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-foreground">Trusted & Certified:</span>
              {certifications?.map((cert) => (
                <div key={cert?.name} className="flex items-center space-x-2">
                  <Icon name={cert?.icon} size={16} className="text-success" />
                  <span className="text-sm text-muted-foreground">{cert?.name}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} className="text-success" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={14} className="text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Server" size={14} className="text-secondary" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© {currentYear} Denny's Fitness Track. All rights reserved.</span>
              <div className="hidden lg:flex items-center space-x-4">
                {footerLinks?.legal?.map((link) => (
                  <a
                    key={link?.label}
                    href={link?.href}
                    className="hover:text-foreground transition-colors duration-150"
                  >
                    {link?.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Made with</span>
              <Icon name="Heart" size={14} className="text-error fill-current" />
              <span>for fitness enthusiasts</span>
            </div>
          </div>

          {/* Mobile Legal Links */}
          <div className="lg:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {footerLinks?.legal?.map((link) => (
                <a
                  key={link?.label}
                  href={link?.href}
                  className="hover:text-foreground transition-colors duration-150"
                >
                  {link?.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;