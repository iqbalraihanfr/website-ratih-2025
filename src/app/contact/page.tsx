'use client'
import React from 'react';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would handle form submission here
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-ratih-dark relative">
        <div className="absolute inset-0 pattern-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-sans">
              <span className="text-white">Contact</span>
              <span className="text-ratih-gold italic font-playfair"> Us</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans">
              Reach out to us for your next creative project or any inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-ratih-dark relative">
        <div className="absolute inset-0 pattern-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="animate-fade-in-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white font-sans">Get In Touch</h2>
              <p className="text-gray-300 mb-8 font-sans">
                Wed love to hear from you! Reach out to us with any questions, project ideas, or collaboration opportunities.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-black p-3 rounded-full text-ratih-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 font-sans">Our Locations</h3>
                    <p className="text-gray-400 font-sans">Surabaya, Malang, and Madiun, Indonesia</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-black p-3 rounded-full text-ratih-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 font-sans">Phone</h3>
                    <p className="text-gray-400 font-sans">+62 812 3456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-black p-3 rounded-full text-ratih-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 font-sans">Email</h3>
                    <p className="text-gray-400 font-sans">info@ratihcreative.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-right">
              <form onSubmit={handleSubmit} className="bg-black p-8 rounded-lg shadow-lg">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2 font-sans">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 bg-ratih-dark border border-gray-700 rounded-lg focus:outline-none focus:border-ratih-gold text-white font-sans"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2 font-sans">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 bg-ratih-dark border border-gray-700 rounded-lg focus:outline-none focus:border-ratih-gold text-white font-sans"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2 font-sans">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 bg-ratih-dark border border-gray-700 rounded-lg focus:outline-none focus:border-ratih-gold text-white font-sans"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-ratih-gold hover:bg-yellow-500 text-ratih-dark font-bold py-3 px-6 rounded-lg transition-colors duration-300 font-sans"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-ratih-darker relative">
        <div className="absolute inset-0 pattern-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-white font-sans">Find Us On The Map</h2>
          <div className="h-96 bg-black rounded-lg overflow-hidden">
            {/* In a real implementation, you would embed a Google Maps component here */}
            <div className="h-full flex items-center justify-center bg-black">
              <p className="text-gray-400 font-sans">Map placeholder - In a real implementation, a Google Map would be embedded here</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
