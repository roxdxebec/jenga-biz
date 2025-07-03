import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Download, Eye, Wand2, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StrategySummary from '@/components/StrategySummary';

const StrategyBuilder = ({ template, onBack, onHome }) => {
  const [strategy, setStrategy] = useState({
    businessName: '',
    vision: '',
    mission: '',
    targetMarket: '',
    revenueModel: '',
    valueProposition: '',
    keyPartners: '',
    marketingApproach: '',
    operationalNeeds: '',
    growthGoals: ''
  });
  
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(isGenerating
  const { toast } = useToast();

  // Comprehensive template data for all business types
  const templateData = {
    'online-retail': {
      businessName: 'My Online Store',
      vision: 'To become the leading online retailer for quality products in my region',
      mission: 'Providing convenient online shopping with reliable delivery and excellent customer service',
      targetMarket: 'Urban professionals, tech-savvy consumers, busy families seeking convenience',
      revenueModel: 'Product sales with markup, delivery fees, affiliate commissions, premium memberships',
      valueProposition: 'Quality products with doorstep delivery, competitive prices, and easy returns',
      keyPartners: 'Suppliers, logistics companies, payment processors, social media influencers',
      marketingApproach: 'Social media marketing, WhatsApp catalogs, Google ads, customer referrals',
      operationalNeeds: 'E-commerce platform, inventory storage, packaging materials, delivery network',
      growthGoals: 'Expand product range, establish physical showroom, build mobile app, enter new cities'
    },
    'agribusiness': {
      businessName: 'My Agribusiness',
      vision: 'To be a leading sustainable agricultural enterprise improving food security',
      mission: 'Producing quality crops using modern farming techniques while empowering local farmers',
      targetMarket: 'Local markets, restaurants, food processors, export companies, retail chains',
      revenueModel: 'Direct crop sales, value-added products, farming consultancy, equipment rental',
      valueProposition: 'Fresh, quality produce with consistent supply and competitive pricing',
      keyPartners: 'Seed suppliers, agricultural extension services, cooperatives, financial institutions',
      marketingApproach: 'Market associations, agricultural shows, direct buyer relationships, digital platforms',
      operationalNeeds: 'Land, farming equipment, irrigation system, storage facilities, transportation',
      growthGoals: 'Expand acreage, add processing unit, develop export markets, establish farmer network'
    },
    'mobile-money': {
      businessName: 'My Mobile Money Service',
      vision: 'To be the most trusted mobile money agent in my community',
      mission: 'Providing reliable financial services that connect people to digital economy',
      targetMarket: 'Unbanked population, small traders, remittance senders, bill payers',
      revenueModel: 'Transaction commissions, float interest, value-added services, bill payment fees',
      valueProposition: 'Convenient, secure money transfers with extended hours and friendly service',
      keyPartners: 'Mobile network operators, banks, microfinance institutions, local businesses',
      marketingApproach: 'Community engagement, referral programs, local advertising, partnership marketing',
      operationalNeeds: 'Shop space, cash float, mobile devices, security measures, network connectivity',
      growthGoals: 'Multiple outlets, additional services, agent network, digital payment integration'
    },
    'cyber-cafe': {
      businessName: 'My Cyber Café',
      vision: 'To be the premier digital services hub in my neighborhood',
      mission: 'Bridging the digital divide by providing affordable internet and computer services',
      targetMarket: 'Students, job seekers, small business owners, digital service seekers',
      revenueModel: 'Internet charges, printing services, typing services, computer training fees',
      valueProposition: 'Affordable internet access with additional services like printing and training',
      keyPartners: 'Internet service providers, equipment suppliers, educational institutions, government offices',
      marketingApproach: 'Student discounts, loyalty programs, community partnerships, local advertising',
      operationalNeeds: 'Computers, internet connection, printer, furniture, software licenses, security',
      growthGoals: 'Upgrade equipment, add gaming section, expand training programs, multiple locations'
    },
    'real-estate': {
      businessName: 'My Real Estate Agency',
      vision: 'To be the most trusted real estate partner in property transactions',
      mission: 'Connecting property owners with buyers and tenants through professional service',
      targetMarket: 'Property investors, homebuyers, tenants, landlords, developers',
      revenueModel: 'Sales commissions, rental commissions, property management fees, consultation charges',
      valueProposition: 'Expert market knowledge with honest advice and smooth transaction processes',
      keyPartners: 'Property developers, banks, lawyers, surveyors, contractors, insurance companies',
      marketingApproach: 'Online listings, referral network, property exhibitions, social media marketing',
      operationalNeeds: 'Office space, vehicle, marketing materials, legal documentation, database system',
      growthGoals: 'Build agent network, develop properties, expand service area, digital platform'
    },
    'cleaning-services': {
      businessName: 'My Cleaning Services',
      vision: 'To provide the highest quality cleaning services with exceptional customer care',
      mission: 'Creating clean, healthy environments for homes and businesses',
      targetMarket: 'Busy professionals, offices, hotels, restaurants, residential complexes',
      revenueModel: 'Service contracts, one-time cleaning fees, specialized cleaning charges, maintenance contracts',
      valueProposition: 'Reliable, thorough cleaning with eco-friendly products and flexible scheduling',
      keyPartners: 'Cleaning supply companies, equipment suppliers, facility managers, property managers',
      marketingApproach: 'Referral programs, online presence, corporate partnerships, door-to-door marketing',
      operationalNeeds: 'Cleaning supplies, equipment, transportation, uniforms, insurance, staff training',
      growthGoals: 'Hire more staff, specialized services, commercial contracts, franchise expansion'
    },
    'event-planning': {
      businessName: 'My Event Planning Service',
      vision: 'To create unforgettable experiences through exceptional event planning',
      mission: 'Turning celebrations into perfect memories with creative planning and flawless execution',
      targetMarket: 'Wedding couples, corporations, families, religious organizations, social groups',
      revenueModel: 'Planning fees, vendor commissions, package deals, coordination charges',
      valueProposition: 'Stress-free event planning with creative themes and reliable vendor network',
      keyPartners: 'Venues, caterers, decorators, photographers, musicians, florists, equipment rentals',
      marketingApproach: 'Portfolio showcasing, social media, vendor referrals, satisfied client testimonials',
      operationalNeeds: 'Planning tools, transportation, communication devices, vendor relationships, portfolio materials',
      growthGoals: 'Expand service offerings, build venue partnerships, hire assistants, establish brand'
    },
    'photography': {
      businessName: 'My Photography Studio',
      vision: 'To capture life\'s precious moments with artistic excellence',
      mission: 'Preserving memories through professional photography and videography services',
      targetMarket: 'Wedding couples, families, businesses, events, social media influencers',
      revenueModel: 'Session fees, package deals, print sales, digital products, commercial shoots',
      valueProposition: 'High-quality images with creative style and professional service',
      keyPartners: 'Equipment suppliers, photo labs, event planners, makeup artists, venue owners',
      marketingApproach: 'Portfolio marketing, social media showcase, referral programs, vendor partnerships',
      operationalNeeds: 'Camera equipment, lighting, editing software, studio space, transportation',
      growthGoals: 'Upgrade equipment, establish studio, expand into videography, build team'
    },
    'food-delivery': {
      businessName: 'My Food Delivery Service',
      vision: 'To be the fastest and most reliable food delivery service in the area',
      mission: 'Connecting hungry customers with their favorite meals through efficient delivery',
      targetMarket: 'Busy professionals, students, families, office workers, event organizers',
      revenueModel: 'Delivery fees, restaurant commissions, surge pricing, subscription plans',
      valueProposition: 'Fast, hot food delivery with real-time tracking and diverse restaurant options',
      keyPartners: 'Restaurants, delivery riders, payment processors, mapping services, food aggregators',
      marketingApproach: 'App-based marketing, restaurant partnerships, promotional offers, social media',
      operationalNeeds: 'Mobile app, delivery fleet, payment system, order management, customer support',
      growthGoals: 'Expand coverage area, increase restaurant partners, improve technology, scale operations'
    },
    'mitumba': {
      businessName: 'My Mitumba Store',
      vision: 'To be the most trusted source of quality second-hand clothing in my community',
      mission: 'Providing affordable, quality clothing while promoting sustainable fashion choices',
      targetMarket: 'Price-conscious families, young professionals, students in urban and peri-urban areas',
      revenueModel: 'Direct sales from physical store and WhatsApp marketing, bulk sales to other retailers',
      valueProposition: 'Quality second-hand clothes at affordable prices with personalized service',
      keyPartners: 'Bale suppliers, local tailors for alterations, WhatsApp groups, chama members',
      marketingApproach: 'Word-of-mouth, WhatsApp business, local community events, referral programs',
      operationalNeeds: 'Store space, storage for inventory, transportation for bale collection, mobile money account',
      growthGoals: 'Expand to online sales, add more product categories, establish multiple outlets'
    },
    'beauty-salon': {
      businessName: 'My Beauty Salon',
      vision: 'To be the premier beauty destination providing exceptional styling services',
      mission: 'Enhancing natural beauty through professional hair care and beauty treatments',
      targetMarket: 'Women of all ages, men seeking grooming, bridal parties, special occasion clients',
      revenueModel: 'Service fees, product sales, treatment packages, bridal packages, membership plans',
      valueProposition: 'Professional styling with quality products in a relaxing environment',
      keyPartners: 'Product suppliers, beauty schools, wedding planners, fashion designers, equipment suppliers',
      marketingApproach: 'Social media showcasing, referral incentives, loyalty programs, community events',
      operationalNeeds: 'Salon equipment, beauty products, furniture, licenses, trained staff, payment systems',
      growthGoals: 'Add more services, hire additional stylists, expand space, franchise opportunities'
    },
    'auto-repair': {
      businessName: 'My Auto Repair Shop',
      vision: 'To be the most trusted automotive service provider in the region',
      mission: 'Keeping vehicles safe and reliable through expert repair and maintenance services',
      targetMarket: 'Vehicle owners, taxi operators, delivery companies, government fleets, private individuals',
      revenueModel: 'Labor charges, parts markup, maintenance contracts, diagnostic fees, emergency services',
      valueProposition: 'Honest repairs with quality parts, experienced mechanics, and fair pricing',
      keyPartners: 'Parts suppliers, insurance companies, towing services, automotive training centers',
      marketingApproach: 'Referral programs, fleet partnerships, local advertising, online presence',
      operationalNeeds: 'Workshop space, tools and equipment, parts inventory, skilled mechanics, licenses',
      growthGoals: 'Expand services, modernize equipment, hire certified mechanics, multiple locations'
    },
    'boda-boda': {
      businessName: 'My Transport Service',
      vision: 'To provide safe, reliable, and affordable transportation in my area',
      mission: 'Connecting people to opportunities through dependable motorcycle transport',
      targetMarket: 'Daily commuters, students, market vendors, emergency transport needs',
      revenueModel: 'Per-trip charges, daily/weekly customer subscriptions, delivery services',
      valueProposition: 'Fast, reliable transport with good customer service and fair pricing',
      keyPartners: 'Boda boda SACCO, fuel stations, spare parts dealers, mobile money agents',
      marketingApproach: 'Customer referrals, SACCO networks, strategic location positioning, mobile app registration',
      operationalNeeds: 'Motorcycle maintenance, insurance, protective gear, mobile phone, SACCO membership',
      growthGoals: 'Own multiple motorcycles, hire other riders, add cargo services, digital platform integration'
    },
    'freelance-writing': {
      businessName: 'My Content Creation Service',
      vision: 'To be the go-to content creator for businesses seeking quality written content',
      mission: 'Helping businesses communicate effectively through compelling written content',
      targetMarket: 'Small businesses, startups, marketing agencies, bloggers, e-commerce sites',
      revenueModel: 'Per-word rates, project fees, retainer contracts, content packages, consulting fees',
      valueProposition: 'High-quality, engaging content that drives results with quick turnaround',
      keyPartners: 'Marketing agencies, web developers, graphic designers, business consultants',
      marketingApproach: 'Portfolio website, LinkedIn networking, content marketing, client referrals',
      operationalNeeds: 'Computer, internet connection, writing software, portfolio samples, payment system',
      growthGoals: 'Expand service offerings, build client base, increase rates, hire sub-contractors'
    },
    'bakery': {
      businessName: 'My Bakery',
      vision: 'To be the neighborhood\'s favorite bakery known for fresh, delicious baked goods',
      mission: 'Bringing joy to the community through freshly baked breads, cakes, and pastries',
      targetMarket: 'Local residents, offices, schools, restaurants, special event customers',
      revenueModel: 'Daily sales, custom orders, wholesale to retailers, catering services, delivery charges',
      valueProposition: 'Fresh, quality baked goods with traditional and modern varieties',
      keyPartners: 'Ingredient suppliers, equipment vendors, delivery services, event planners, local stores',
      marketingApproach: 'Local advertising, social media, loyalty programs, seasonal promotions',
      operationalNeeds: 'Baking equipment, ingredients, display cases, packaging, skilled bakers, permits',
      growthGoals: 'Expand product line, add café seating, wholesale expansion, additional locations'
    },
    'tutoring': {
      businessName: 'My Tutoring Center',
      vision: 'To be the leading educational support center improving student performance',
      mission: 'Empowering students to achieve academic excellence through personalized tutoring',
      targetMarket: 'Struggling students, exam candidates, homeschool families, adult learners',
      revenueModel: 'Hourly tutoring fees, group class rates, exam prep packages, online session charges',
      valueProposition: 'Personalized learning with experienced tutors and proven results',
      keyPartners: 'Schools, teachers, educational publishers, online platforms, parent associations',
      marketingApproach: 'School partnerships, parent referrals, academic performance testimonials, online presence',
      operationalNeeds: 'Teaching space, educational materials, whiteboards, computers, qualified tutors',
      growthGoals: 'Hire more tutors, expand subjects, online tutoring, franchising opportunities'
    },
    'fitness-training': {
      businessName: 'My Fitness Training Service',
      vision: 'To help people achieve their fitness goals through expert guidance and motivation',
      mission: 'Transforming lives through fitness with personalized training and wellness programs',
      targetMarket: 'Fitness enthusiasts, weight loss seekers, athletes, busy professionals, seniors',
      revenueModel: 'Personal training fees, group class rates, fitness packages, nutrition consulting',
      valueProposition: 'Expert fitness guidance with personalized programs and motivational support',
      keyPartners: 'Gyms, nutritionists, sports medicine doctors, equipment suppliers, wellness centers',
      marketingApproach: 'Transformation showcases, referral programs, social media, health seminars',
      operationalNeeds: 'Training space, fitness equipment, certification, insurance, marketing materials',
      growthGoals: 'Expand client base, add group classes, online programs, fitness facility'
    },
    'daycare': {
      businessName: 'My Daycare Center',
      vision: 'To provide the safest, most nurturing environment for children\'s early development',
      mission: 'Supporting working parents by providing quality childcare with educational activities',
      targetMarket: 'Working parents, single parents, families needing flexible childcare, employers',
      revenueModel: 'Daily care fees, monthly packages, extended hours charges, meal plans, activity fees',
      valueProposition: 'Safe, nurturing childcare with educational programs and flexible scheduling',
      keyPartners: 'Educational suppliers, healthcare providers, nutrition specialists, parent organizations',
      marketingApproach: 'Parent referrals, employer partnerships, community events, online reviews',
      operationalNeeds: 'Child-safe facility, toys and materials, qualified staff, licenses, insurance',
      growthGoals: 'Expand capacity, add educational programs, longer hours, additional locations'
    },
    'social-media': {
      businessName: 'My Social Media Agency',
      vision: 'To be the premier social media management service for growing businesses',
      mission: 'Helping businesses build strong online presence and engage with their customers',
      targetMarket: 'Small businesses, startups, restaurants, retail stores, service providers',
      revenueModel: 'Monthly management fees, content creation charges, advertising management, consulting fees',
      valueProposition: 'Professional social media presence with engaging content and measurable results',
      keyPartners: 'Content creators, graphic designers, photographers, marketing agencies, platform reps',
      marketingApproach: 'Portfolio showcasing, case studies, networking events, digital marketing',
      operationalNeeds: 'Design software, scheduling tools, analytics platforms, content creation equipment',
      growthGoals: 'Expand client base, hire team members, add video services, develop proprietary tools'
    },
    'handmade-crafts': {
      businessName: 'My Handmade Crafts Business',
      vision: 'To preserve traditional craftsmanship while creating beautiful, unique products',
      mission: 'Creating high-quality handmade items that celebrate local culture and artistry',
      targetMarket: 'Gift buyers, tourists, interior decorators, cultural enthusiasts, online shoppers',
      revenueModel: 'Direct sales, custom orders, wholesale to retailers, exhibition sales, online sales',
      valueProposition: 'Unique, authentic handmade products with cultural significance and quality craftsmanship',
      keyPartners: 'Material suppliers, retail stores, tourism boards, craft associations, online marketplaces',
      marketingApproach: 'Craft fairs, online marketplaces, social media, cultural events, tourist centers',
      operationalNeeds: 'Craft materials, tools, workspace, packaging supplies, display materials',
      growthGoals: 'Expand product line, teach workshops, export opportunities, artisan cooperative'
    }
  };

  useEffect(() => {
    console.log('StrategyBuilder - Template received:', template);
    
    if (template && template.id) {
      console.log('StrategyBuilder - Loading template data for:', template.id);
      const templateContent = templateData[template.id];
      if (templateContent) {
        console.log('StrategyBuilder - Found template content, loading:', templateContent);
        setStrategy(templateContent);
      } else {
        console.log('StrategyBuilder - No template content found for:', template.id);
      }
    } else if (template === null) {
      console.log('StrategyBuilder - No template - loading blank form');
      setStrategy({
        businessName: '',
        vision: '',
        mission: '',
        targetMarket: '',
        revenueModel: '',
        valueProposition: '',
        keyPartners: '',
        marketingApproach: '',
        operationalNeeds: '',
        growthGoals: ''
      });
    }
  }, [template]);

  const handleInputChange = (field, value) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('current-strategy', JSON.stringify(strategy));
    toast({
      title: "Strategy Saved!",
      description: "Your business strategy has been saved successfully.",
    });
  };

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowSummary(true);
    }, 2000);
  };

  const sections = [
    { key: 'businessName', label: 'Business Name', type: 'input' },
    { key: 'vision', label: 'Vision Statement', type: 'textarea' },
    { key: 'mission', label: 'Mission Statement', type: 'textarea' },
    { key: 'targetMarket', label: 'Target Market', type: 'textarea' },
    { key: 'revenueModel', label: 'Revenue Model', type: 'textarea' },
    { key: 'valueProposition', label: 'Unique Value Proposition', type: 'textarea' },
    { key: 'keyPartners', label: 'Key Partners', type: 'textarea' },
    { key: 'marketingApproach', label: 'Marketing Approach', type: 'textarea' },
    { key: 'operationalNeeds', label: 'Operational Needs', type: 'textarea' },
    { key: 'growthGoals', label: 'Growth Goals', type: 'textarea' }
  ];

  if (showSummary) {
    return (
      <StrategySummary 
        strategy={strategy}
        onBack={() => setShowSummary(false)}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Strategy Builder</h1>
              {template && <p className="text-sm text-gray-600">{template.name} Template</p>}
              {template === null && <p className="text-sm text-gray-600">Custom Strategy</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Strategy Form */}
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.key} className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-800">{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {section.type === 'input' ? (
                    <Input
                      value={strategy[section.key]}
                      onChange={(e) => handleInputChange(section.key, e.target.value)}
                      placeholder={`Enter your ${section.label.toLowerCase()}`}
                      className="w-full"
                    />
                  ) : (
                    <Textarea
                      value={strategy[section.key]}
                      onChange={(e) => handleInputChange(section.key, e.target.value)}
                      placeholder={`Describe your ${section.label.toLowerCase()}`}
                      className="w-full min-h-[100px]"
                      rows={4}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGenerateSummary}
              disabled={isGenerating || !strategy.businessName}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
