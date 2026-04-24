import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

export default function DashboardCards() {
  const cards = [
    {
      id: 1,
      title: 'Total Usuarios',
      value: '1,234',
      icon: Users,
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      title: 'Ventas',
      value: '342',
      icon: ShoppingCart,
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 3,
      title: 'Ingresos',
      value: '$12,456',
      icon: DollarSign,
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 4,
      title: 'Crecimiento',
      value: '+23.5%',
      icon: TrendingUp,
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Este mes
            </p>
          </div>
        );
      })}
    </div>
  );
}
