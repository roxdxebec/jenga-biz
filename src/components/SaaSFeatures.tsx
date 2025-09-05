import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, FileText, Download, Calendar, Users } from 'lucide-react';

interface SaaSFeaturesProps {
  onSignOut: () => void;
}

const SaaSFeatures = ({ onSignOut }: SaaSFeaturesProps) => {
  const [reports, setReports] = useState([
    { id: 1, name: 'Q4 Business Report', date: '2024-12-15', status: 'completed' },
    { id: 2, name: 'Market Analysis', date: '2024-11-28', status: 'in-progress' },
    { id: 3, name: 'Financial Overview', date: '2024-11-20', status: 'completed' }
  ]);

  const handleGenerateReport = () => {
    const newReport = {
      id: reports.length + 1,
      name: `Business Report ${new Date().toISOString().split('T')[0]}`,
      date: new Date().toISOString().split('T')[0],
      status: 'in-progress'
    };
    setReports([newReport, ...reports]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-blue-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => {
              onSignOut();
              window.location.href = '/auth';
            }}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create comprehensive business reports with AI analysis.</p>
              <Button 
                onClick={handleGenerateReport}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Generate New Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View detailed analytics and performance metrics.</p>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your team and collaboration settings.</p>
              <Button variant="outline" className="w-full">
                Manage Team
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Report History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-600">Generated on {report.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                    {report.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaaSFeatures;