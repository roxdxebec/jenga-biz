import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Building2, Users, Filter, Download, X } from 'lucide-react';

interface FilterOption {
  type: 'region' | 'stage' | 'demographics' | 'project';
  label: string;
  value: string;
}

interface FilteredReportData {
  id: string;
  businessName: string;
  region: string;
  stage: string;
  monthsActive: number;
  revenue: number;
  employees: number;
  loanStatus: string;
  demographics: string;
}

export function FilteredReportsView() {
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('businessName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Mock data - in real app this would come from an API
  const mockData: FilteredReportData[] = [
    {
      id: '1',
      businessName: 'Agri Solutions Ltd',
      region: 'Kenya',
      stage: 'Growth',
      monthsActive: 18,
      revenue: 150000,
      employees: 12,
      loanStatus: 'Approved',
      demographics: 'Rural, Female-led'
    },
    {
      id: '2',
      businessName: 'Tech Innovations',
      region: 'Nigeria',
      stage: 'Scaling',
      monthsActive: 24,
      revenue: 280000,
      employees: 25,
      loanStatus: 'Pending',
      demographics: 'Urban, Youth-led'
    },
    {
      id: '3',
      businessName: 'Eco Crafts',
      region: 'Ghana',
      stage: 'Startup',
      monthsActive: 6,
      revenue: 45000,
      employees: 5,
      loanStatus: 'Rejected',
      demographics: 'Rural, Women group'
    },
    // Add more mock data as needed
  ];

  const regionOptions = ['Kenya', 'Nigeria', 'Ghana', 'Tanzania', 'Uganda', 'Rwanda'];
  const stageOptions = ['Idea', 'Startup', 'Growth', 'Scaling', 'Mature'];
  const demographicOptions = ['Youth-led', 'Female-led', 'Women group', 'Rural', 'Urban', 'Refugee-led'];
  const projectOptions = ['Agriculture', 'Technology', 'Manufacturing', 'Services', 'Retail', 'Healthcare'];

  const addFilter = (type: FilterOption['type'], value: string) => {
    const label = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`;
    const newFilter: FilterOption = { type, label, value };
    
    // Remove existing filter of same type and value, or add if not exists
    setActiveFilters(prev => {
      const exists = prev.find(f => f.type === type && f.value === value);
      if (exists) {
        return prev.filter(f => !(f.type === type && f.value === value));
      }
      return [...prev, newFilter];
    });
  };

  const removeFilter = (filterToRemove: FilterOption) => {
    setActiveFilters(prev => prev.filter(f => f !== filterToRemove));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  // Filter and sort data based on current filters and search
  const filteredData = mockData.filter(item => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!item.businessName.toLowerCase().includes(searchLower) &&
          !item.region.toLowerCase().includes(searchLower) &&
          !item.stage.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Apply active filters
    for (const filter of activeFilters) {
      switch (filter.type) {
        case 'region':
          if (item.region !== filter.value) return false;
          break;
        case 'stage':
          if (item.stage !== filter.value) return false;
          break;
        case 'demographics':
          if (!item.demographics.includes(filter.value)) return false;
          break;
        // Add more filter types as needed
      }
    }

    return true;
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof FilteredReportData];
    const bValue = b[sortBy as keyof FilteredReportData];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const exportFilteredData = (format: 'pdf' | 'excel') => {
    if (filteredData.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please adjust your filters to include some data before exporting.",
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Exporting ${filteredData.length} records as ${format}`);
    toast({
      title: "Export Started",
      description: `Exporting ${filteredData.length} records as ${format.toUpperCase()}. Check your downloads folder.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters & Views
          </CardTitle>
          <CardDescription>
            Filter businesses by region, stage, demographics, and project type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Businesses</Label>
            <Input
              id="search"
              placeholder="Search by business name, region, or stage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Region Filter */}
            <div className="space-y-2">
              <Label>Region</Label>
              <Select onValueChange={(value) => addFilter('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {region}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stage Filter */}
            <div className="space-y-2">
              <Label>Business Stage</Label>
              <Select onValueChange={(value) => addFilter('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {stage}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Demographics Filter */}
            <div className="space-y-2">
              <Label>Demographics</Label>
              <Select onValueChange={(value) => addFilter('demographics', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select demographic" />
                </SelectTrigger>
                <SelectContent>
                  {demographicOptions.map((demo) => (
                    <SelectItem key={demo} value={demo}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {demo}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Type Filter */}
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select onValueChange={(value) => addFilter('project', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Active Filters ({activeFilters.length})</Label>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter.label}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeFilter(filter)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filtered Results</CardTitle>
              <CardDescription>
                Showing {filteredData.length} of {mockData.length} businesses
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="businessName">Name</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="employees">Employees</SelectItem>
                  <SelectItem value="monthsActive">Months Active</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportFilteredData('pdf')} className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportFilteredData('excel')} className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportFilteredData('pdf')} className="sm:hidden">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportFilteredData('excel')} className="sm:hidden">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                No businesses match your current filters
              </div>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Business Name</TableHead>
                    <TableHead className="min-w-[100px]">Region</TableHead>
                    <TableHead className="min-w-[100px]">Stage</TableHead>
                    <TableHead className="min-w-[120px]">Months Active</TableHead>
                    <TableHead className="min-w-[120px]">Revenue</TableHead>
                    <TableHead className="min-w-[100px]">Employees</TableHead>
                    <TableHead className="min-w-[120px]">Loan Status</TableHead>
                    <TableHead className="min-w-[150px]">Demographics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">{business.businessName}</TableCell>
                      <TableCell>{business.region}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{business.stage}</Badge>
                      </TableCell>
                      <TableCell>{business.monthsActive}</TableCell>
                      <TableCell>${business.revenue.toLocaleString()}</TableCell>
                      <TableCell>{business.employees}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            business.loanStatus === 'Approved' ? 'default' :
                            business.loanStatus === 'Pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {business.loanStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {business.demographics}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}