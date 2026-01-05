import { Package, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface AnalyticsProps {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStockCount: number;
}

const Analytics = ({ totalProducts, totalStock, totalValue, lowStockCount }: AnalyticsProps) => {
  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: <Package size={24} />,
      color: 'blue'
    },
    {
      label: 'Total Stock',
      value: totalStock.toLocaleString(),
      icon: <TrendingUp size={24} />,
      color: 'green'
    },
    {
      label: 'Inventory Value',
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign size={24} />,
      color: 'purple'
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount,
      icon: <AlertTriangle size={24} />,
      color: 'orange'
    }
  ];

  return (
    <div className="analytics-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card stat-card-${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <p className="stat-label">{stat.label}</p>
            <h3 className="stat-value">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
