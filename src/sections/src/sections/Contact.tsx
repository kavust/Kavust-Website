import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Send, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: Mail,
    label: 'E-posta',
    value: 'kavustyeap@gmail.com',
    href: 'mailto:kavustyeap@gmail.com',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+1 (628) 946 5349',
    href: 'tel:+16289465349',
  },
];

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      className="relative w-full py-32 overflow-hidden bg-black-deep"
      ref={sectionRef}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gold/50 to-transparent" />
      <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
        {/* Section header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-gold text-xs tracking-[0.3em] uppercase mb-6">İletişim</span>
          <h2 className="text-5xl sm:text-6xl font-serif text-white mb-6">
            Benimle <span className="text-gradient-gold italic">İletişime Geç</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gold/50" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="w-12 h-px bg-gold/50" />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left side - Contact info */}
          <div className={`lg:col-span-2 space-y-10 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div>
              <h3 className="text-2xl font-serif text-white mb-4">
                Bir İşbirliği mi Düşünüyorsunuz?
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Restoran, otel veya hospitality projeleriniz için profesyonel 
                destek almak istiyorsanız, benimle iletişime geçmekten çekinmeyin. 
                Şarap danışmanlığı, ekip eğitimi ve operasyonel optimizasyon 
                konularında yardımcı olmaktan memnuniyet duyarım.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="group flex items-center gap-4 p-5 border border-gold/10 hover:border-gold/30 transition-all duration-300 bg-black-card/30"
                >
                  <div className="p-3 border border-gold/20 group-hover:border-gold/40 transition-colors">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-white group-hover:text-gold transition-colors text-sm">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Sosyal Medya</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="p-4 border border-gold/20 text-gray-400 hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Contact form */}
          <div className={`lg:col-span-3 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="p-8 lg:p-10 border border-gold/10 bg-black-card/30">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="inline-flex p-5 border border-gold/30 mb-6">
                    <Send className="w-8 h-8 text-gold" />
                  </div>
                  <h4 className="text-3xl font-serif text-white mb-3">Mesajınız Gönderildi!</h4>
                  <p className="text-gray-400">En kısa sürede size dönüş yapacağım.</p>
                </div>
              ) : (
                <form
  action="https://formspree.io/f/xlgwgqwb"
  method="POST" className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Adınız</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-black-deep border-gold/20 text-white placeholder:text-gray-600 focus:border-gold focus:ring-0 rounded-none h-12"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">E-posta</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-black-deep border-gold/20 text-white placeholder:text-gray-600 focus:border-gold focus:ring-0 rounded-none h-12"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Konu</label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-black-deep border-gold/20 text-white placeholder:text-gray-600 focus:border-gold focus:ring-0 rounded-none h-12"
                      placeholder="İşbirliği hakkında..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 text-xs uppercase tracking-wider mb-2">Mesajınız</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-black-deep border-gold/20 text-white placeholder:text-gray-600 focus:border-gold focus:ring-0 rounded-none resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold text-black-deep hover:bg-gold-light font-medium py-6 rounded-none transition-all duration-300 disabled:opacity-50 tracking-wider uppercase text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Gönderiliyor...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Mesaj Gönder
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
