import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, KeyRound } from "lucide-react"; 
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../components/Card";

// ==========================================================
// 1. IMAGENES PARA EL CARUSEL
// ==========================================================
const IMAGE_URLS = [
  "https://media.admagazine.com/photos/618a6451a8ad6c5249a74f2f/16:9/w_2560%2Cc_limit/73990.jpg",
  "https://cdn-3.expansion.mx/dims4/default/0fa6a34/2147483647/strip/true/crop/1254x836+0+0/resize/1800x1200!/format/webp/quality/80/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F6e%2F11%2F637687f94bbeb55715f3baf030cb%2Fregreso-oficina.jpg",
  "https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2019/07/03201757/Ciudades-mas-caras-de-America-Latina-Buenos-Aires.jpg",
  "https://statics.eleconomista.com.ar/2021/01/614e50c905cf8.jpg",
];

// Duración en milisegundos para el cambio de imagen
const INTERVAL_TIME = 6000; 

// ==========================================================
// 2. COMPONENTE SLIDER (Implementación clave del slide)
// ==========================================================
const ImageSlider = React.memo(({ imageUrls, currentIndex }: { imageUrls: string[]; currentIndex: number }) => {
  const slideStyle = useMemo(() => ({
    width: `${imageUrls.length * 100}%`, 
    transform: `translateX(-${currentIndex * (100 / imageUrls.length)}%)`
  }), [currentIndex, imageUrls.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={slideStyle}
      >
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-full bg-cover bg-center"
            style={{ 
                backgroundImage: `url('${url}')`, 
                width: `${100 / imageUrls.length}%` 
            }}
          />
        ))}
      </div>
      
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-primary/20 backdrop-brightness-50 backdrop-blur-sm"></div>
    </div>
  );
});

// ==========================================================
// 3. PÁGINA DE LOGIN
// ==========================================================
export default function Login() {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lógica del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % IMAGE_URLS.length
      );
    }, INTERVAL_TIME);

    return () => clearInterval(timer);
  }, []); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "admin@demo.com" && password === "123456") {
        login(); 
        navigate("/dashboard"); 
      } else {
        setError("Credenciales incorrectas");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      
      {/* Columna de Branding/Carrusel (Izquierda) */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative">
        {/* Renderiza el Slider y el Overlay */}
        <ImageSlider imageUrls={IMAGE_URLS} currentIndex={currentImageIndex} />
        
        {/* Contenido (Encima del Slider y el Overlay) */}
        <div className="relative z-10 flex flex-col justify-between h-full text-white">
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray rounded-xl shadow-xl">
                <Building2 className="h-8 w-8 text-primary" /> {/* Logo en color primario */}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Inmoweb
              </h1>
            </div>
            
            <div className="space-y-4 mb-20">
              <h2 className="text-5xl font-extrabold leading-tight text-shadow-lg">
                El futuro de la gestión inmobiliaria.
              </h2>
              <p className="text-lg font-light opacity-90">
                Centraliza operaciones, optimiza el rendimiento y maximiza la rentabilidad
              </p>
            </div>

            {/* Indicadores de Posición */}
            <div className="flex space-x-2 justify-center absolute bottom-12 left-1/2 transform -translate-x-1/2">
                {IMAGE_URLS.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                                ? 'w-8 bg-white shadow-md' 
                                : 'w-2 bg-white/40 hover:bg-white/80'
                        }`}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* Columna del Formulario de Login (Derecha) - Más Profesional */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-sm border shadow-xl bg-white dark:bg-gray-800 rounded-2xl">
          <CardHeader className="space-y-2 text-center">
            
            {/* Logo solo en móvil o para centrar */}
            <div className="flex justify-center mb-4 lg:hidden">
              <div className="p-3 bg-primary rounded-xl">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Acceso al Sistema</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Ingresa tus credenciales para empezar a gestionar tus activos.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@propt.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-10 border-gray-300 focus:ring-primary focus:border-primary"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                    <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
                <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-10 border-gray-300 focus:ring-primary focus:border-primary"
                    />
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                </div>
              </div>
              
              {error && (
                <p className="text-sm font-medium text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">
                  {error}
                </p>
              )}
              
              <Button 
                type="submit" 
                className="w-full py-2.5 text-lg font-semibold bg-primary hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validando...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}