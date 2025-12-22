import React, { useState } from "react";
import { 
  LogOut, 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Menu, 
  X,
  Bell,
  UserCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para saber si un link está activo
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Propiedades", path: "/propiedades", icon: Building2 },
    { name: "Clientes", path: "/clientes", icon: Users },
    { name: "Pagos", path: "/pagos", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* 1. SIDEBAR (Escritorio) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-indigo-600 flex items-center gap-2">
            <Building2 className="w-8 h-8" /> Inmoweb
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-indigo-600" : "text-gray-400"}`} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" /> Salir del Sistema
          </button>
        </div>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL + HEADER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER SUPERIOR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          {/* Botón Móvil */}
          <button 
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Título dinámico según la ruta */}
          <div className="hidden md:block">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">
              Administración / <span className="text-gray-900 font-bold">{location.pathname.substring(1)}</span>
            </h2>
          </div>

          {/* Acciones de Usuario */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-indigo-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">Admin User</p>
                <p className="text-xs text-gray-500 mt-1">Súper Administrador</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <UserCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 3. MENU MÓVIL (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <nav className="fixed top-0 left-0 bottom-0 w-72 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-indigo-600">Inmoweb</h1>
              <button onClick={() => setIsMobileMenuOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-xl font-bold ${
                    isActive(item.path) ? "bg-indigo-50 text-indigo-600" : "text-gray-600"
                  }`}
                >
                  <item.icon /> {item.name}
                </Link>
              ))}
              <button onClick={logout} className="flex items-center gap-3 p-4 text-red-500 font-bold w-full text-left">
                <LogOut /> Salir
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}