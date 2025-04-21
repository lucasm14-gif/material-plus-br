import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  AlertCircle,
  ArrowRight,
  ArrowUp,
  BarChart2,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Facebook,
  Instagram,
  Lock,
  Loader2,
  LucideProps,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Youtube,
} from "lucide-react";

// Form schema
const leadFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  whatsapp: z.string().min(10, { message: "WhatsApp inválido" }),
  storeName: z.string().min(2, { message: "Nome da loja é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

// Section component
interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  bgColor?: string;
}

const Section = ({ id, className = "", children, bgColor = "bg-white" }: SectionProps) => (
  <section id={id} className={`py-20 ${bgColor} ${className}`}>
    <div className="container">
      {children}
    </div>
  </section>
);

// Section title component
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const SectionTitle = ({ title, subtitle, center = true }: SectionTitleProps) => (
  <div className={`mb-12 ${center ? "text-center" : ""}`}>
    <h2 className="font-sora font-bold text-2xl md:text-3xl text-[#0C0910] mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className={`text-lg ${center ? "md:w-2/3 mx-auto" : ""}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// Icon item component
interface IconItemProps {
  icon: React.FC<LucideProps>;
  title: string;
  description: string;
}

const IconItem = ({ icon: Icon, title, description }: IconItemProps) => (
  <motion.div 
    className="flex flex-col md:flex-row md:items-start p-4 rounded-lg cursor-pointer"
    initial={{ backgroundColor: "transparent" }}
    whileHover={{ 
      backgroundColor: "rgba(30, 101, 222, 0.05)", 
      y: -5,
      transition: { duration: 0.2 }
    }}
    transition={{ duration: 0.3 }}
  >
    <motion.div 
      className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Icon className="h-8 w-8 text-white" />
    </motion.div>
    <div>
      <h3 className="font-sora font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  </motion.div>
);

// Problem card component
interface ProblemCardProps {
  icon: React.FC<LucideProps>;
  title: string;
  description: string;
}

const ProblemCard = ({ icon: Icon, title, description }: ProblemCardProps) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
    whileHover={{ 
      y: -8,
      boxShadow: "0 12px 25px rgba(0, 0, 0, 0.07)",
    }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    <motion.div 
      className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"
      whileHover={{ 
        scale: 1.1,
        backgroundColor: "rgba(30, 101, 222, 0.2)"
      }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {Icon && <Icon strokeWidth={2} className="h-6 w-6 text-primary" />}
    </motion.div>
    <h3 className="font-sora font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </motion.div>
);

// Stat card component
interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="text-primary font-montserrat font-bold text-5xl mb-2">{value}</div>
    <p className="text-lg font-medium">{label}</p>
  </div>
);

// Testimonial component
interface TestimonialProps {
  name: string;
  company: string;
  image: string;
  text: string;
  since: string;
  result: string;
}

const Testimonial = ({ name, company, image, text, since, result }: TestimonialProps) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      backgroundColor: "rgba(255, 255, 255, 0.95)"
    }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <div className="flex items-center mb-4">
    <motion.div 
  className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4"
  whileHover={{ scale: 1.1 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  <img 
    src={image}
    alt={name}
    className="w-full h-full object-cover"
  />
</motion.div>

      <div>
        <h4 className="font-montserrat font-bold text-lg">{name}</h4>
        <p className="text-gray-600">{company}</p>
      </div>
    </div>
    <motion.div 
      className="flex mb-4"
      whileHover={{ 
        x: 5,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
      }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.3, rotate: 10 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
        </motion.div>
      ))}
    </motion.div>
    <p className="text-gray-700 mb-4">{text}</p>
    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>{since}</span>
      <motion.span 
        whileHover={{ 
          scale: 1.1,
          color: "#1E65DE",
          fontWeight: "bold"
        }}
      >
        {result}
      </motion.span>
    </div>
  </motion.div>
);

// Process step component
interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
}

const ProcessStep = ({ number, title, description }: ProcessStepProps) => (
  <motion.div 
    className="relative bg-white p-6 rounded-lg shadow-md z-10 cursor-pointer"
    whileHover={{ 
      scale: 1.03,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <motion.div 
      className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto"
      whileHover={{ 
        scale: 1.1,
        rotate: [0, -10, 10, -10, 0],
        transition: { 
          rotate: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }
      }}
    >
      <span className="text-white font-bold text-xl">{number}</span>
    </motion.div>
    <h3 className="font-sora font-bold text-lg text-center mb-2">{title}</h3>
    <p className="text-gray-700 text-center">{description}</p>
  </motion.div>
);

// FAQ item component
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        className="flex justify-between items-center w-full px-6 py-4 text-left font-sora font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-6 w-6 text-primary transition-transform ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <p className="text-gray-700">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Feature item component
interface FeatureItemProps {
  text: string;
}

const FeatureItem = ({ text }: FeatureItemProps) => (
  <div className="flex items-center">
    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
      <CheckCircle className="h-4 w-4 text-white" />
    </div>
    <p className="text-white">{text}</p>
  </div>
);

// Main Home component
export default function Home() {
  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teamMembers] = useState([
    'https://brindideias.com.br/wp/wp-content/uploads/2025/04/1.jpg',
    'https://brindideias.com.br/wp/wp-content/uploads/2025/04/2.jpg',
    'https://brindideias.com.br/wp/wp-content/uploads/2025/04/3.jpg',
    'https://brindideias.com.br/wp/wp-content/uploads/2025/04/4.jpg',
    'https://brindideias.com.br/wp/wp-content/uploads/2025/04/time-material-plus.jpg'
  ]);
  const slideRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Apenas para controle do carrossel com botões
  
  
  // Lead Form (Hero)
  const heroForm = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      storeName: "",
      email: "",
      city: "",
      message: "",
    },
  });

  // Contact Form (Final CTA)
  const contactForm = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      storeName: "",
      email: "",
      city: "",
      message: "",
    },
  });

  // Form submission mutation
  const submitLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Entraremos em contato em breve.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar formulário",
        description: "Por favor, tente novamente mais tarde.",
      });
    },
  });

  // Form submission handlers
  const onHeroFormSubmit = (data: LeadFormData) => {
    submitLeadMutation.mutate(data);
    heroForm.reset();
  };

  const onContactFormSubmit = (data: LeadFormData) => {
    submitLeadMutation.mutate(data);
    contactForm.reset();
  };

  // Scroll to section handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  // Back to top button handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Carrossel navigation
  const totalSlides = 6; // Total de casos/imagens no carrossel
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  // Navegar para um slide específico através dos dots
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Carrossel apenas com navegação por botões
  
  // Efeito para mover o carrossel quando o currentSlide mudar
  useEffect(() => {
    if (slideRef.current) {
      const slideElement = slideRef.current;
      slideElement.scrollTo({
        left: slideElement.clientWidth * currentSlide,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-[#F6F8FF] font-inter text-[#0C0910]">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container py-3 flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex space-x-4 items-center">
            <button 
              onClick={() => scrollToSection("solucao")} 
              className="text-[#0C0910] hover:text-primary transition"
            >
              Soluções
            </button>
            <button 
              onClick={() => scrollToSection("resultados")} 
              className="text-[#0C0910] hover:text-primary transition"
            >
              Resultados
            </button>
            <Button 
              onClick={() => scrollToSection("contato")}
            >
              Fale Conosco
            </Button>
          </div>
          <button 
            className="md:hidden text-[#0C0910]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white pb-4 container">
            <button 
              onClick={() => scrollToSection("solucao")}
              className="block py-2 text-[#0C0910] hover:text-primary w-full text-left"
            >
              Soluções
            </button>
            <button 
              onClick={() => scrollToSection("resultados")}
              className="block py-2 text-[#0C0910] hover:text-primary w-full text-left"
            >
              Resultados
            </button>
            <button 
              onClick={() => scrollToSection("contato")}
              className="block py-2 text-primary font-semibold w-full text-left"
            >
              Fale Conosco
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-28 md:pb-24 bg-gradient-to-br from-[#0a2463] via-[#1E65DE] to-[#4989F5] text-white">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 50 + 10}px`,
                  height: `${Math.random() * 50 + 10}px`,
                  opacity: Math.random() * 0.2 + 0.1
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 md:pr-6 mb-8 md:mb-0">
              <div className="inline-block bg-white py-1 px-3 rounded-full text-primary font-semibold text-sm mb-6" role="text" aria-label="Slogan">
                MARKETING QUE VENDE, PRA QUEM VENDE MATERIAL
              </div>
              <h1 className="font-sora font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight mb-4" itemProp="headline">
                <span className="text-[#F7CB15]">Transforme</span> sua loja de materiais em um{" "}
                <span className="bg-gradient-to-r from-[#F7CB15] to-[#F7CB15] bg-no-repeat bg-bottom bg-[length:100%_8px]">
                  ímã de clientes
                </span>
              </h1>
              <h2 className="font-inter text-xl md:text-2xl text-white/90 mb-6">
                Marketing digital especializado para lojas de materiais de construção, elétricos e hidráulicos que <span className="font-bold">realmente traz resultados</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <div className="mr-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#F7CB15]" />
                  </div>
                  <span>Aumente suas vendas em +147%</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-[#F7CB15]" />
                  </div>
                  <span>Clientes qualificados</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#F7CB15]" />
                  </div>
                  <span>Especialistas no seu mercado</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-[#F7CB15]" />
                  </div>
                  <span>Resultados garantidos</span>
                </div>
              </div>
              
              <Button 
                variant="accent" 
                size="lg"
                onClick={() => scrollToSection("contato")}
                className="shadow-lg mb-2 md:mb-0 text-[#0C0910] bg-[#F7CB15] hover:bg-[#e8bc0c] font-bold border-b-4 border-[#d9ae08]"
              >
                Quero aumentar minhas vendas agora!
              </Button>
            </div>
            
            <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-black">
              <h3 className="font-sora font-bold text-2xl text-[#0C0910] mb-2">
                <span className="text-primary">Análise gratuita</span> da sua loja
              </h3>
              <p className="mb-6 text-gray-600">
                Preencha o formulário abaixo e descubra como podemos transformar sua loja:
              </p>
              
              <Form {...heroForm}>
                <form onSubmit={heroForm.handleSubmit(onHeroFormSubmit)} className="space-y-4">
                  <FormField
                    control={heroForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">Seu nome</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary" 
                            placeholder="João Silva"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={heroForm.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">WhatsApp</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="tel" 
                            className="border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary" 
                            placeholder="(XX) XXXXX-XXXX"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={heroForm.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">Nome da sua loja</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary" 
                            placeholder="Materiais Silva"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full shadow-lg font-bold py-3 text-[#0C0910] bg-[#F7CB15] hover:bg-[#e8bc0c] border-b-4 border-[#d9ae08]"
                    disabled={submitLeadMutation.isPending}
                  >
                    {submitLeadMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ENVIANDO...
                      </div>
                    ) : (
                      "QUERO AUMENTAR MINHAS VENDAS"
                    )}
                  </Button>
                  
                  <div className="flex justify-center items-center text-xs text-gray-500 mt-2">
                    <Lock className="h-3 w-3 mr-1" />
                    <span>Seus dados estão seguros e não serão compartilhados</span>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/5 mb-10 md:mb-0">
              <h2 className="font-sora font-bold text-3xl md:text-4xl text-[#0C0910] mb-4">
                Um desses<br />especialistas vai<br />atender você
              </h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
              <p className="text-gray-700 mb-8">
                Nossa equipe é especializada no mercado de materiais de construção 
                e entende os desafios específicos do seu negócio. Conte com profissionais 
                que falam a linguagem do seu cliente e conhecem o seu setor.
              </p>
              <Button 
                variant="accent" 
                size="lg"
                onClick={() => scrollToSection("contato")}
                className="shadow-lg text-[#0C0910] bg-[#F7CB15] hover:bg-[#e8bc0c] font-bold border-b-4 border-[#d9ae08] px-8"
              >
                Quero receber atendimento
              </Button>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="flex justify-center items-center">
                {teamMembers.map((url, index) => (
                  <div 
                    key={index}
                    className={`w-24 h-24 md:w-36 md:h-36 rounded-full ${
                      index !== teamMembers.length - 1 ? '-mr-6 md:-mr-10' : ''
                    } relative z-${index + 1}0 border-4 border-white overflow-hidden shadow-lg`}
                  >
                    <img 
                      src={url || 'https://via.placeholder.com/150'} 
                      alt={`Membro da equipe ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <Section id="problema" bgColor="bg-[#F6F8FF]">
        <SectionTitle
          title="Problemas que todo lojista de materiais enfrenta"
          subtitle="Se você já passou por alguma dessas situações, você não está sozinho..."
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProblemCard
            icon={AlertCircle}
            title="Investimento sem retorno"
            description="Você já investiu em agências de marketing que prometeram muito, entregaram pouco e não entendiam nada do seu segmento."
          />
          
          <ProblemCard
            icon={Users}
            title="Redes sociais sem estratégia"
            description="Sua loja está nas redes sociais, mas as publicações não geram engajamento, leads ou vendas reais para o seu negócio."
          />
          
          <ProblemCard
            icon={DollarSign}
            title="Campanhas caras e ineficientes"
            description="Anúncios no Google e Facebook que drenam seu orçamento mas não trazem os clientes certos para o seu estabelecimento."
          />
          
          <ProblemCard
            icon={Target}
            title="Concorrência digital crescente"
            description="Lojas concorrentes estão dominando as buscas no Google, enquanto sua empresa é pouco encontrada por clientes em potencial."
          />
          
          <ProblemCard
            icon={AlertCircle}
            title="Falta de controle e métricas"
            description="Você não consegue medir com precisão o retorno do seu investimento em marketing e não sabe o que está funcionando."
          />
          
          <ProblemCard
            icon={MessageSquare}
            title="Dificuldade em acompanhar leads"
            description="Mensagens de clientes se perdem, orçamentos demoram para ser enviados e vendas potenciais escapam por falta de organização."
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="font-semibold text-lg mb-4">
            Não deixe esses problemas continuarem afetando seu negócio
          </p>
          <Button 
            onClick={() => scrollToSection("contato")}
            size="lg"
            className="shadow-md text-white"
          >
            Quero resolver esses problemas
          </Button>
        </div>
      </Section>

      {/* Solution Section */}
      <Section id="solucao" bgColor="bg-white">
        <SectionTitle
          title="A solução ideal para lojistas de materiais"
          subtitle="Marketing digital especializado que realmente entende o seu mercado e gera resultados mensuráveis"
        />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <IconItem
            icon={Target}
            title="Estratégia personalizada para materiais"
            description="Desenvolvemos um plano de marketing exclusivo que considera as peculiaridades do mercado de materiais de construção, elétricos e hidráulicos. Entendemos seu cliente e suas necessidades."
          />
          
          <IconItem
            icon={ArrowUp}
            title="Tráfego pago que converte"
            description="Criamos campanhas no Google e Meta que trazem clientes realmente interessados em comprar. Focamos nas palavras-chave certas e no público que realmente importa para o seu negócio."
          />
          
          <IconItem
            icon={UserCheck}
            title="Automação com CRM especializado"
            description="Implementamos sistemas que automatizam o acompanhamento de leads, facilita a emissão de orçamentos e garante que nenhuma oportunidade de venda se perca. Integramos com seus sistemas atuais."
          />
          
          <IconItem
            icon={ArrowRight}
            title="Social Media com estratégia"
            description="Não apenas publicamos conteúdo; criamos estratégias que transformam suas redes sociais em canais de vendas. Produzimos conteúdo técnico, confiável e que reforça a autoridade da sua loja."
          />
          
          <IconItem
            icon={CheckCircle}
            title="Relatórios de desempenho reais"
            description="Acompanhe o resultado do seu investimento com relatórios claros e objetivos. Métricas que realmente importam: vendas, leads, ROI e crescimento do seu negócio."
          />
          
          <IconItem
            icon={Users}
            title="Acompanhamento consultivo"
            description="Reuniões periódicas com nossa equipe para analisar resultados e ajustar estratégias. Uma parceria real focada no crescimento contínuo do seu negócio."
          />
        </div>
        
        <div className="bg-[#F6F8FF] p-8 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="font-sora font-bold text-2xl mb-4">
                Marketing que vende, pra quem vende material
              </h3>
              <p className="mb-4">
                Na Material Plus, nosso compromisso não é apenas com tráfego ou visualizações, mas com vendas reais para sua loja. Somos a única agência que entende profundamente o mercado de materiais.
              </p>
              <Button 
                variant="accent"
                size="lg"
                onClick={() => scrollToSection("contato")}
                className="shadow-md text-black"
              >
                Quero conhecer mais
              </Button>
            </div>
            <div className="md:w-1/3">
            <img
  src="https://th.bing.com/th/id/R.f080eacfad0b81bc5f1a49810dd072d5?rik=FOODo1xKKpkO1A&riu=http%3a%2f%2fbrasildesentupimento.com.br%2fimages%2fservicos%2fdesentupimento_img01.jpg&ehk=mRPupvtRA%2bCQsUq%2bL7V8PSyGY%2bco3ElVYLecYq4volw%3d&risl=&pid=ImgRaw&r=0"
  alt="Imagem Material Plus"
  className="rounded-lg shadow-md w-full h-48 md:h-64 object-cover"
/>

            </div>
          </div>
        </div>
      </Section>

      {/* Results Section */}
      <Section id="resultados" bgColor="bg-[#F6F8FF]">
        <SectionTitle
          title="Resultados reais para lojistas como você"
          subtitle="Veja como temos transformado o marketing digital de lojas de materiais por todo o Brasil"
        />
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <StatCard value="+147%" label="Aumento médio no faturamento das lojas" />
          <StatCard value="+283%" label="Mais leads qualificados a cada mês" />
          <StatCard value="68%" label="Redução no custo de aquisição por cliente" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Testimonial
            name="Carlos Silva"
            company="Constrular Materiais, São Paulo"
            image="https://brindideias.com.br/wp/wp-content/uploads/2025/04/cliente-plus-m.png"
            text="Depois de trabalhar com várias agências de marketing sem resultado, encontramos a Material Plus. Em 6 meses, aumentamos nosso faturamento em 63% e o Instagram passou a gerar vendas reais. A diferença é que eles realmente entendem o mercado de materiais."
            since="Cliente desde: Março/2022"
            result="+63% em vendas"
          />
          
          <Testimonial
            name="Ana Oliveira"
            company="Eletrotec, Belo Horizonte"
            image="https://brindideias.com.br/wp/wp-content/uploads/2025/04/material-plus-cliente.png"
            text="A implementação do sistema de CRM e a automação dos orçamentos transformou nossa operação. Conseguimos atender mais clientes com a mesma equipe e o Google Ads finalmente começou a dar resultado. Nosso ROI triplicou em 4 meses."
            since="Cliente desde: Janeiro/2023"
            result="+215% em leads"
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="font-semibold text-lg mb-4">
            Quer resultados como estes para sua loja?
          </p>
          <Button 
            variant="accent"
            size="lg"
            onClick={() => scrollToSection("contato")}
            className="shadow-md text-black" 
          >
            Quero aumentar minhas vendas
          </Button>
        </div>
      </Section>

      {/* Inspirado Section */}
      <Section bgColor="bg-[#F6F8FF]">
        <SectionTitle
          title="Inspirado nas melhores práticas do mercado"
          subtitle="Marketing digital exclusivo para lojas de materiais de construção e elétricos"
        />
        
        <div className="mt-8 max-w-6xl mx-auto">
          {/* Carrossel de imagens - versão clean sem sombras */}
          <div className="relative overflow-hidden max-w-4xl mx-auto">
            {/* Botões de navegação */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white hover:shadow-md rounded-full p-2 z-10 ml-2 transition border border-primary/20 hover:border-primary/50"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white hover:shadow-md rounded-full p-2 z-10 mr-2 transition border border-primary/20 hover:border-primary/50"
              aria-label="Próximo"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
            
            {/* Imagens em slide - apenas navegação com botões */}
            <div 
              ref={slideRef}
              className="flex overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide relative"
              style={{ scrollSnapType: 'x mandatory', position: 'relative' }}
            >
              <div className="flex-shrink-0 w-full snap-center px-1">
                <div className="carousel-item">
                  <img 
                    src={Component8} 
                    alt="Case Tigre" 
                    className="w-auto h-auto max-h-[400px] mx-auto object-contain"
                  />
                </div>
              </div>
              
              <div className="flex-shrink-0 w-full snap-center px-1">
                <div className="carousel-item">
                  <img 
                    src={Component9} 
                    alt="Case Amanco" 
                    className="w-auto h-auto max-h-[400px] mx-auto object-contain"
                  />
                </div>
              </div>
              
              <div className="flex-shrink-0 w-full snap-center px-1">
                <div className="carousel-item">
                  <img 
                    src="/src/assets/Component 10.png" 
                    alt="Case Vedacit" 
                    className="w-auto h-auto max-h-[400px] mx-auto object-contain"
                  />
                </div>
              </div>
              
              <div className="flex-shrink-0 w-full snap-center px-1">
                <img 
                  src="/src/assets/Component 11.png" 
                  alt="Case Gerdau" 
                  className="w-auto h-auto max-h-[400px] mx-auto object-contain"
                />
              </div>
              
              <div className="flex-shrink-0 w-full snap-center px-1">
                <img 
                  src="/src/assets/Component 12.png" 
                  alt="Case Eternit" 
                  className="w-auto h-auto max-h-[400px] mx-auto object-contain"
                />
              </div>
              
              <div className="flex-shrink-0 w-full snap-center px-1">
                <img 
                  src="/src/assets/Component 13.png" 
                  alt="Case Votorantim" 
                  className="w-auto h-auto max-h-[400px] mx-auto object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Indicator dots */}
          <div className="flex justify-center space-x-3 mt-6">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentSlide === index ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Process Section */}
      <Section bgColor="bg-white">
        <SectionTitle
          title="Como trabalhamos"
          subtitle="Um processo simples para transformar sua presença digital e aumentar suas vendas"
        />
        
        <div className="relative">
          {/* Progress line */}
          <div className="hidden md:block absolute top-32 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <ProcessStep
              number={1}
              title="Diagnóstico"
              description="Analisamos sua loja, mercado e concorrência para identificar oportunidades de crescimento."
            />
            
            <ProcessStep
              number={2}
              title="Estratégia"
              description="Criamos um plano personalizado baseado nos objetivos e nas peculiaridades do seu negócio."
            />
            
            <ProcessStep
              number={3}
              title="Implementação"
              description="Colocamos o plano em prática, com campanhas, conteúdo e automações que geram resultado."
            />
            
            <ProcessStep
              number={4}
              title="Crescimento"
              description="Acompanhamos, medimos e ajustamos constantemente para garantir resultados cada vez melhores."
            />
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <section id="contato" className="py-20 bg-primary">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-white font-montserrat font-extrabold text-3xl md:text-4xl mb-6">
                Vamos conversar sobre como vender mais na sua loja?
              </h2>
              <p className="text-white opacity-90 mb-6 text-lg">
                Preencha o formulário ao lado para uma consultoria gratuita e descubra como podemos transformar o marketing digital da sua loja de materiais.
              </p>
              <div className="space-y-4">
                <FeatureItem text="Atendimento exclusivo para lojistas de materiais" />
                <FeatureItem text="Planos personalizados de acordo com seu orçamento" />
                <FeatureItem text="Resultados mensuráveis com foco em vendas reais" />
                <FeatureItem text="Equipe especializada no mercado de materiais" />
              </div>
            </div>
            
            <div className="md:w-5/12 bg-white p-8 rounded-lg shadow-lg">
              <h3 className="font-sora font-bold text-xl text-primary mb-4">
                Solicite uma análise gratuita
              </h3>
              
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactFormSubmit)} className="space-y-4">
                  <FormField
                    control={contactForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">Nome completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">WhatsApp</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">E-mail</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">Nome da loja</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#0C0910]">O que você espera do marketing digital?</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    variant="accent"
                    className="w-full shadow-md font-semibold py-3 text-black"
                    disabled={submitLeadMutation.isPending}
                  >
                    {submitLeadMutation.isPending ? "ENVIANDO..." : "SOLICITAR ANÁLISE GRATUITA"}
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Ao enviar, você concorda em receber contato da nossa equipe
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Section bgColor="bg-[#F6F8FF]">
        <SectionTitle
          title="Perguntas Frequentes"
          subtitle="Tire suas dúvidas sobre nossos serviços"
        />
        
        <div className="max-w-3xl mx-auto space-y-4">
          <FAQItem
            question="Quanto tempo leva para ver resultados?"
            answer="Nossos clientes costumam ver melhorias significativas em 30 a 60 dias. Tráfego e leads começam a aumentar já no primeiro mês, e o impacto nas vendas geralmente se torna evidente a partir do segundo mês, dependendo do ciclo de compra do seu cliente."
          />
          
          <FAQItem
            question="Como vocês se diferenciam de outras agências?"
            answer="Somos especializados exclusivamente no mercado de materiais de construção, elétricos e hidráulicos. Nossa equipe entende as peculiaridades do setor, o comportamento do cliente e as melhores estratégias para esse mercado específico. Além disso, nosso foco é em resultados mensuráveis, não apenas em métricas de vaidade."
          />
          
          <FAQItem
            question="Qual o investimento necessário?"
            answer="Trabalhamos com planos personalizados que se adequam ao tamanho da sua loja e aos seus objetivos. Nossos investimentos iniciam em R$1.997/mês para lojas de pequeno porte e podem chegar a R$7.997/mês para redes com múltiplas unidades. Cada plano é customizado após uma análise detalhada das necessidades do cliente."
          />
          
          <FAQItem
            question="Como funcionam os relatórios e métricas?"
            answer="Disponibilizamos um dashboard personalizado onde você pode acompanhar em tempo real os principais KPIs: tráfego, leads, conversões, custo por aquisição e ROI. Além disso, realizamos reuniões mensais para análise aprofundada dos resultados e ajustes de estratégia."
          />
          
          <FAQItem
            question="Vocês trabalham com contratos de fidelidade?"
            answer="Trabalhamos com contratos iniciais de 3 meses, pois este é o tempo mínimo para implementar a estratégia e começar a ver resultados consistentes. Após este período, o contrato se renova automaticamente mensal, mas pode ser cancelado com 30 dias de antecedência. Acreditamos que nossos resultados serão o melhor motivo para você continuar conosco."
          />
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-[#0C0910] text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <Logo size="md" textColor="text-white" className="mb-4" />
              <p className="text-gray-300 mb-5 max-w-md">
                Marketing especializado para lojistas de material de construção, elétrico e hidráulico. Transformamos sua presença digital em vendas reais.
              </p>
              <div className="flex space-x-5 mt-4">
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <h3 className="text-xl font-sora font-bold mb-5">Links</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => scrollToTop()} className="text-gray-300 hover:text-white transition flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                    Página Inicial
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("solucao")} className="text-gray-300 hover:text-white transition flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                    Soluções
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("resultados")} className="text-gray-300 hover:text-white transition flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                    Resultados
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contato")} className="text-gray-300 hover:text-white transition flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                    Entre em contato
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h3 className="text-xl font-sora font-bold mb-5">Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3" />
                  <span className="text-gray-300">contato@materialplus.com.br</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-3" />
                  <span className="text-gray-300">(51) 91088-005</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <h3 className="text-xl font-sora font-bold mb-4">Newsletter</h3>
                <p className="text-gray-300 mb-4">
                  Inscreva-se para receber dicas e novidades sobre marketing para lojas de materiais
                </p>
                <div className="flex">
                  <Input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    className="rounded-r-none border-gray-700 bg-gray-800 text-white"
                  />
                  <Button className="rounded-l-none bg-primary hover:bg-primary-dark">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="bg-gray-700 my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Material Plus. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/555191088005"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-white" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </motion.a>
    </div>
  );
}

import Component8 from '../assets/Component 8.png';
import Component9 from '../assets/Component 9.png';
