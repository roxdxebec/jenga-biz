import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  change?: number;
  changeLabel?: string;
}

export const MetricsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  change, 
  changeLabel 
}: MetricsCardProps) => {
  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-xl sm:text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>
        {change !== undefined && (
          <div className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}% {changeLabel}
          </div>
        )}
      </CardContent>
    </Card>
  );
};