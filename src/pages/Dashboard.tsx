"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  DollarSign,
  Users,
  AlertCircle,
  Home,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  MapPin,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthGuard from "../components/AuthGuard";
import { Badge } from "../components/Badge";

import { API_URL } from "../config";

const formatCurrency = (value: number) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

export default function Dashboard() {
  const user = { name: "Administrador" };

  const [clientes, setClientes] = useState<any[]>([]);
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/clientes`).then((res) => res.json()),
      fetch(`${API_URL}/propiedades`).then((res) => res.json()),
      fetch(`${API_URL}/pagos`)
        .then((res) => res.json())
        .then((pagosData) =>
          pagosData.map((p: any) => ({
            ...p,
            monto: Number(p.monto),
          }))
        ),
    ])
      .then(([clientesData, propiedadesData, pagosData]) => {
        setClientes(clientesData);
        setPropiedades(propiedadesData);
        setPagos(pagosData);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalProperties = propiedades.length;
  const rentedProperties = propiedades.filter((p) => !p.disponible).length;
  const availableProperties = propiedades.filter((p) => p.disponible).length;

  const totalIncome = pagos
    .filter((p) => p.estado === "pagado")
    .reduce((sum, p) => sum + (p.monto || 0), 0);

  const pendingPayments = pagos.filter((p) => p.estado === "pendiente").length;
  const totalClients = clientes.length;

  const recentProperties = propiedades.slice(-3).reverse();
  const recentPayments = pagos.slice(-3).reverse();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-slate-600 font-medium">Cargando panel...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Header con gradiente vibrante */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-32">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}></div>
            
            <div className="relative max-w-7xl mx-auto px-6 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
                    Panel de Control
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">
                    Bienvenido, {user.name} 👋
                  </p>
                </div>
                <div className="hidden md:block bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                  <div className="flex items-center gap-3 text-white">
                    <Calendar className="h-5 w-5" />
                    <span className="font-semibold">
                      {new Date().toLocaleDateString("es-AR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 -mt-24 pb-12">
            {/* Stats Cards con efecto glassmorphism */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[
                {
                  title: "Total Propiedades",
                  value: totalProperties,
                  icon: Building2,
                  subtitle: `${rentedProperties} rentadas • ${availableProperties} disponibles`,
                  gradient: "from-blue-500 to-cyan-500",
                  iconBg: "bg-blue-500/10",
                  iconColor: "text-blue-600",
                },
                {
                  title: "Ingresos del Mes",
                  value: formatCurrency(totalIncome),
                  icon: DollarSign,
                  subtitle: "Pagos completados",
                  gradient: "from-emerald-500 to-teal-500",
                  iconBg: "bg-emerald-500/10",
                  iconColor: "text-emerald-600",
                },
                {
                  title: "Clientes Activos",
                  value: totalClients,
                  icon: Users,
                  subtitle: "Registrados en el sistema",
                  gradient: "from-purple-500 to-pink-500",
                  iconBg: "bg-purple-500/10",
                  iconColor: "text-purple-600",
                },
                {
                  title: "Pagos Pendientes",
                  value: pendingPayments,
                  icon: AlertCircle,
                  subtitle: "Requieren seguimiento",
                  gradient: "from-orange-500 to-red-500",
                  iconBg: "bg-orange-500/10",
                  iconColor: "text-orange-600",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/60 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${card.iconBg}`}>
                        <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-sm font-semibold text-slate-600 mb-2">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mb-2">
                      {card.value}
                    </p>
                    <p className="text-xs text-slate-500">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Secciones con diseño moderno */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Propiedades Recientes */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-200/60">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                      <Home className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Propiedades Recientes
                    </h2>
                  </div>
                </div>

                {recentProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No hay propiedades cargadas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentProperties.map((p) => (
                      <div
                        key={p.id}
                        className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                      >
                        <div className="relative h-20 w-24 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {p.foto_url ? (
                            <img
                              src={p.foto_url}
                              alt={p.direccion}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="text-blue-400 h-10 w-10" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {p.direccion}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant={p.disponible ? "secondary" : "default"}>
                              {p.disponible ? "Disponible" : "Rentada"}
                            </Badge>
                            <span className="font-bold text-blue-600 text-lg">
                              {formatCurrency(p.precio)}
                            </span>
                          </div>
                        </div>

                        <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagos Recientes */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-200/60">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Actividad de Pagos
                    </h2>
                  </div>
                </div>

                {recentPayments.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No hay pagos registrados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPayments.map((pago) => (
                      <div
                        key={pago.id}
                        className="group p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 mb-1 truncate">
                              {pago.cliente}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate">{pago.propiedad}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                Vence: {new Date(pago.fechaVencimiento).toLocaleDateString("es-AR")}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-xl text-slate-900 mb-2">
                              {formatCurrency(pago.monto)}
                            </p>
                            <Badge
                              variant={
                                pago.estado === "pagado"
                                  ? "default"
                                  : pago.estado === "pendiente"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}