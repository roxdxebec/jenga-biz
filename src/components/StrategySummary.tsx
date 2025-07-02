
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Edit, Share, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StrategySummary = ({ strategy, onBack, onHome }) => {
  const { toast } = useToast();

  const generateAISummary = () => {
    return `
**${strategy.businessName} - Strategic Overview**

**Vision & Mission**
${strategy.businessName} aims to ${strategy.vision.toLowerCase()}. Our mission focuses on ${strategy.mission.toLowerCase()}.

**Market Opportunity**
We target ${strategy.targetMarket.toLowerCase()}, addressing their need for quality and affordable solutions in the local market.

**Business Model**
Our revenue strategy includes ${strategy.revenueModel.toLowerCase()}, leveraging both traditional and digital channels common in African markets.

**Competitive Advantage**
What sets us apart: ${strategy.valueProposition.toLowerCase()}, combined with deep understanding of local customer needs and preferences.

**Partnership Strategy**
Key collaborations with ${strategy.keyPartners.toLowerCase()} will provide essential support for operations and growth.

**Go-to-Market Approach**
Our marketing strategy emphasizes ${strategy.marketingApproach.toLowerCase()}, focusing on community engagement and word-of-mouth referrals.

**Operational Foundation**
Essential requirements include ${strategy.operationalNeeds.toLowerCase()}, ensuring smooth day-to-day operations.

**Growth Roadmap**
Future expansion plans: ${strategy.growthGoals.toLowerCase()}, building on our initial success and market presence.

**Success Factors**
This strategy leverages local market knowledge, community relationships, and practical business approaches proven effective in African entrepreneurship contexts. Focus on building trust, maintaining quality, and adapting to customer feedback will be crucial for long-term success.
    `;
  };

  const handleDownload = () => {
    const summaryContent = generateAISummary();
    const blob = new Blob([summaryContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${strategy.businessName.replace(/\s+/g, '_')}_Strategy.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your strategy summary is being downloaded.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${strategy.businessName} Strategy`,
        text: generateAISummary().substring(0, 200) + '...',
      });
    } else {
      navigator.clipboard.writeText(generateAISummary());
      toast({
        title: "Copied to Clipboard",
        description: "Strategy summary copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Strategy Summary</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={onBack}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* AI Generated Summary */}
          <Card className="mb-6 border-orange-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <span className="mr-2">🤖</span>
                AI-Generated Strategy Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                {generateAISummary().split('\n').map((line, index) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                        {line.replace(/\*\*/g, '')}
                      </h3>
                    );
                  } else if (line.trim()) {
                    return (
                      <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Strategy
            </Button>
            <Button 
              onClick={onBack}
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Strategy
            </Button>
          </div>

          {/* Additional Resources */}
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Next Steps</h3>
              <ul className="list-disc list-inside space-y-2 text-green-700">
                <li>Review and refine your strategy regularly</li>
                <li>Start with small pilot tests to validate assumptions</li>
                <li>Track key metrics and customer feedback</li>
                <li>Connect with local business networks and SACCOs</li>
                <li>Consider joining Kuza Catalyst programs for additional support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StrategySummary;
