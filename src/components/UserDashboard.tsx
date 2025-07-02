
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Trash, ArrowLeft } from 'lucide-react';

const UserDashboard = ({ onBackToHome, onNewStrategy }) => {
  // Mock user strategies data
  const [strategies] = useState([
    {
      id: 1,
      name: 'My Mitumba Store',
      type: 'Mitumba Seller',
      lastModified: '2 days ago',
      status: 'Complete'
    },
    {
      id: 2,
      name: 'Urban Food Corner',
      type: 'Food Vendor', 
      lastModified: '1 week ago',
      status: 'Draft'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBackToHome} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            <h1 className="text-xl font-bold text-gray-800">My Strategies</h1>
          </div>
          
          <Button onClick={onNewStrategy} className="bg-gradient-to-r from-orange-500 to-yellow-500">
            <Plus className="w-4 h-4 mr-2" />
            New Strategy
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{strategies.length}</div>
                <div className="text-gray-600">Total Strategies</div>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {strategies.filter(s => s.status === 'Complete').length}
                </div>
                <div className="text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                <div className="text-gray-600">Available Slots</div>
              </CardContent>
            </Card>
          </div>

          {/* Strategies List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Business Strategies</h2>
            
            {strategies.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Plus className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Strategies Yet</h3>
                  <p className="text-gray-500 mb-6">Create your first business strategy to get started</p>
                  <Button onClick={onNewStrategy} className="bg-gradient-to-r from-orange-500 to-yellow-500">
                    Create First Strategy
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strategy) => (
                  <Card key={strategy.id} className="border-orange-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <div className="text-sm text-gray-600">{strategy.type}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-500">Last modified: {strategy.lastModified}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          strategy.status === 'Complete' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {strategy.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add New Strategy Card */}
                {strategies.length < 3 && (
                  <Card 
                    className="border-2 border-dashed border-orange-300 hover:border-orange-400 cursor-pointer transition-colors"
                    onClick={onNewStrategy}
                  >
                    <CardContent className="p-6 text-center flex flex-col justify-center h-full">
                      <Plus className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-700 mb-2">Add New Strategy</h3>
                      <p className="text-sm text-gray-500">
                        {3 - strategies.length} slot{3 - strategies.length !== 1 ? 's' : ''} remaining
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
