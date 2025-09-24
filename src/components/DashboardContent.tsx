import React from 'react';

interface DashboardContentProps {
  user: any;
  currentStrategy: any;
  strategies: any[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ user, currentStrategy, strategies }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user?.email}</h1>
      <div className="grid gap-4">
        <div className="p-4 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Current Strategy</h2>
          <p>{currentStrategy ? currentStrategy.business_name || 'Untitled Strategy' : 'No strategy selected'}</p>
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Your Strategies ({strategies.length})</h2>
          {strategies.length > 0 ? (
            <ul className="space-y-2">
              {strategies.map((strategy) => (
                <li key={strategy.id} className="text-muted-foreground">
                  {strategy.business_name || 'Untitled Strategy'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No strategies yet. Create your first strategy!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;