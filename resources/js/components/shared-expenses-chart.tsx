import { useCurrency } from '@/lib/currency';

interface SharedExpense {
    id: number;
    description: string;
    amount: number;
    total_amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    other_user: {
        name: string;
        avatar: string | null;
    };
    is_owner: boolean;
    created_at: string;
}

interface SharedExpensesChartProps {
    sharedExpenses: SharedExpense[];
    auth: any;
}

export default function SharedExpensesChart({ sharedExpenses, auth }: SharedExpensesChartProps) {
    const { format } = useCurrency(auth);

    if (sharedExpenses.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                No hay gastos compartidos
            </div>
        );
    }

    // Calcular totales y porcentajes
    const totalAmount = sharedExpenses.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount?.toString() || '0');
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    // Colores para cada segmento
    const colors = [
        { bg: 'bg-gray-800', text: 'text-white' },
        { bg: 'bg-blue-500', text: 'text-white' },
        { bg: 'bg-orange-400', text: 'text-white' },
        { bg: 'bg-gray-600', text: 'text-white' }
    ];

    return (
        <div className="space-y-4">
            {/* Gráfico de barras horizontales - Una sola fila */}
            <div className="flex items-center gap-2 h-20">
                    {sharedExpenses.slice(0, 4).map((expense, index) => {
                        const amount = parseFloat(expense.amount?.toString() || '0');
                        const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100) : 0;
                        const color = colors[index % colors.length];
                        
                        return (
                            <div
                                key={expense.id}
                                className={`${color.bg} rounded-lg flex items-center justify-between px-3 py-2 h-full min-w-0 flex-1`}
                                style={{ width: `${percentage}%` }}
                            >
                                {/* Avatar y información */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                        {expense.other_user.avatar ? (
                                            <img
                                                src={expense.other_user.avatar}
                                                alt={expense.other_user.name}
                                                className="w-full h-full object-cover rounded-full"
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-white">
                                                {expense.other_user.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Información del gasto */}
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-sm font-medium ${color.text} truncate`} title={expense.description}>
                                            {expense.description}
                                        </p>
                                        <p className={`text-xs ${color.text} opacity-80 truncate`}>
                                            {expense.other_user.name}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Valor */}
                                <div className="text-right flex-shrink-0 min-w-0">
                                    <p className={`text-sm font-bold ${color.text} truncate`}>
                                        {format(amount)}
                                    </p>
                                    <p className={`text-xs ${color.text} opacity-80`}>
                                        {isNaN(percentage) ? '0.0%' : percentage.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            
            {/* Información adicional si hay más de 4 gastos */}
            {sharedExpenses.length > 4 && (
                <div className="text-center pt-2">
                    <p className="text-xs text-gray-500">
                        Y {sharedExpenses.length - 4} gastos más...
                    </p>
                </div>
            )}
        </div>
    );
}
