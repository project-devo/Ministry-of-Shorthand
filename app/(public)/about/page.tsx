
import { ContactForm } from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, BookOpen, Clock, Award, Shield } from "lucide-react";

export const metadata = {
  title: "About Us | Ministry of Shorthand",
  description: "Learn about our mission to modernize stenography education and meet our team.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero / Mission */}
      <section className="bg-muted py-20 md:py-28 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/5 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="container relative z-10 text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">Our Mission</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Modernizing Stenography Education for the Digital Age
          </h1>
          <p className="text-xl text-muted-foreground">
            We are dedicated to providing the most advanced, accurate, and accessible platform for shorthand aspirants to practice and perfect their skills for competitive exams.
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why Choose Ministry of Shorthand?</h2>
            <p className="text-muted-foreground">We combine traditional shorthand pedagogy with modern technology to deliver a superior learning experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-muted/30 border-none shadow-sm">
              <CardContent className="p-6">
                <Target className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold text-xl mb-2">Precision Scoring</h3>
                <p className="text-muted-foreground">Our proprietary character-level evaluation engine identifies the exact nature of your mistakes, going beyond simple word counts.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm">
              <CardContent className="p-6">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold text-xl mb-2">Real Exam Environment</h3>
                <p className="text-muted-foreground">Practice interface designed to mirror actual SSC and Court skill tests, helping you manage time and reduce exam anxiety.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm">
              <CardContent className="p-6">
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold text-xl mb-2">Structured Curriculum</h3>
                <p className="text-muted-foreground">Comprehensive video courses taking you from foundational strokes to 120+ WPM mastery.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold text-xl mb-2">Expert Instructors</h3>
                <p className="text-muted-foreground">Learn from professionals who have successfully cleared the exams and worked in top government departments.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm">
              <CardContent className="p-6">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold text-xl mb-2">Proven Results</h3>
                <p className="text-muted-foreground">Hundreds of our students have secured prestigious positions as stenographers in various ministries and courts.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm">
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold text-xl mb-2">Ad-Free Experience</h3>
                <p className="text-muted-foreground">Focus entirely on your practice without distracting advertisements or pop-ups.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground">The dedicated educators and technologists behind Ministry of Shorthand.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {/* Placeholder Team Members */}
            {[
              { name: "Sanjay Kumar", role: "Founder & Lead Instructor", bio: "Former Grade-C Stenographer with 15+ years of teaching experience." },
              { name: "Priya Sharma", role: "Content Head", bio: "Expert in dictation recording and curriculum development." },
              { name: "Rahul Verma", role: "Technical Lead", bio: "Built the precision scoring engine and platform architecture." }
            ].map((member, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="h-40 w-40 rounded-full bg-secondary mb-4 relative overflow-hidden border-4 border-background shadow-md flex items-center justify-center">
                  <Users className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <h3 className="font-bold text-xl">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about our courses, need technical support, or want to discuss a partnership? Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Phone Support</h4>
                    <p className="text-muted-foreground text-sm">Mon-Fri from 9am to 6pm</p>
                    <p className="font-medium mt-1">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Email Support</h4>
                    <p className="text-muted-foreground text-sm">Our team typically replies within 24 hours.</p>
                    <p className="font-medium mt-1">support@ministryofshorthand.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
