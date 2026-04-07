import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { APP_NAME } from '../../constants/Home/config';

const footerLinks = {
  Platform: [
    { label: 'Browse Courses', path: '/courses' },
    { label: 'For Instructors', path: '/about' },
    { label: 'For Business', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ],
  Resources: [
    { label: 'Help Center', path: '/about' },
    { label: 'Blog', path: '/about' },
    { label: 'Community', path: '/about' },
    { label: 'Documentation', path: '/about' }
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/about' },
    { label: 'Privacy Policy', path: '/about' },
    { label: 'Terms of Service', path: '/about' }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="px-6 lg:px-10 py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="size-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                <BookOpen className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs text-pretty">
              Empowering learners worldwide with premium courses from industry experts. Transform your career with hands-on education.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="size-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-3">Get the latest courses and updates.</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="px-3 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-6 lg:px-10 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1600px] mx-auto">
          <p className="text-xs text-slate-500">
            © 2026 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
