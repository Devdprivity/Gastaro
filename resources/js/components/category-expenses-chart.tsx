import { useCurrency } from '@/lib/currency';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CategoryExpense {
    category: string;
    total: number;
    count: number;
}

interface CategoryExpensesChartProps {
    categoryStats: CategoryExpense[];
}

export default function CategoryExpensesChart({ categoryStats }: CategoryExpensesChartProps) {
    const { format } = useCurrency();
    
    // Calcular el total para porcentajes
    const totalAmount = categoryStats.reduce((sum, category) => sum + category.total, 0);
    
    // Colores naranjas para las categorías
    const colors = [
        { bg: 'bg-orange-500', text: 'text-white', light: 'bg-orange-100' },
        { bg: 'bg-orange-400', text: 'text-white', light: 'bg-orange-50' },
        { bg: 'bg-orange-600', text: 'text-white', light: 'bg-orange-200' },
        { bg: 'bg-orange-300', text: 'text-gray-800', light: 'bg-orange-50' },
        { bg: 'bg-orange-700', text: 'text-white', light: 'bg-orange-300' }
    ];

    // Datos para el gráfico de líneas (simulando tendencia por categoría)
    const chartData = categoryStats.map((category, index) => ({
        category: category.category,
        amount: category.total,
        percentage: totalAmount > 0 ? ((category.total / totalAmount) * 100) : 0,
        color: colors[index % colors.length]
    }));

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Gastos por Categoría</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-200 rounded-full"></div>
                        <span className="text-sm text-gray-600">Promedio</span>
                    </div>
                </div>
            </div>

            {/* Gráfico de líneas */}
            <div className="mb-6">
                <div className="h-48 relative">
                    {/* Eje Y */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                    </div>
                    
                    {/* Área del gráfico */}
                    <div className="ml-8 h-full relative">
                        {/* Líneas de referencia */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[0, 25, 50, 75, 100].map((percent) => (
                                <div key={percent} className="border-t border-gray-100"></div>
                            ))}
                        </div>
                        
                        {/* Línea principal (Total) */}
                        <svg className="absolute inset-0 w-full h-full">
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
                                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                                </linearGradient>
                            </defs>
                            
                            {/* Área sombreada */}
                            <path
                                d={`M 0,${100 - chartData[0]?.percentage || 0}% ${chartData.map((_, i) => 
                                    `L ${(i / (chartData.length - 1)) * 100}%,${100 - chartData[i]?.percentage || 0}%`
                                ).join(' ')} L ${100}%,100% L 0,100% Z`}
                                fill="url(#gradient)"
                            />
                            
                            {/* Línea principal */}
                            <path
                                d={`M 0,${100 - chartData[0]?.percentage || 0}% ${chartData.map((_, i) => 
                                    `L ${(i / (chartData.length - 1)) * 100}%,${100 - chartData[i]?.percentage || 0}%`
                                ).join(' ')}`}
                                stroke="#f97316"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            
                            {/* Puntos */}
                            {chartData.map((item, i) => (
                                <circle
                                    key={i}
                                    cx={`${(i / (chartData.length - 1)) * 100}%`}
                                    cy={`${100 - item.percentage}%`}
                                    r="4"
                                    fill="#f97316"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            ))}
                        </svg>
                    </div>
                    
                    {/* Eje X - Categorías */}
                    <div className="mt-4 ml-8 flex justify-between text-xs text-gray-500">
                        {chartData.map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 truncate">{item.category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lista de categorías */}
            <div className="space-y-3">
                {categoryStats.map((category, index) => {
                    const percentage = totalAmount > 0 ? ((category.total / totalAmount) * 100) : 0;
                    const color = colors[index % colors.length];
                    
                    return (
                        <div key={category.category} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${color.bg}`}></div>
                                <span className="text-sm font-medium text-gray-900">{category.category}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {format(category.total)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
