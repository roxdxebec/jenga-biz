# Edge-First Architecture Migration Guide

This document provides a comprehensive guide for migrating from the current frontend-heavy architecture to a secure edge-first architecture using Supabase Edge Functions.

## 🎯 Migration Overview

### Current Issues
- **Security Risks**: Business logic and database operations exposed in the frontend
- **Performance Problems**: Multiple database roundtrips, client-side calculations  
- **Maintenance Burden**: Business logic scattered across React components
- **Scalability Limitations**: Frontend bottlenecks for data processing

### Target Architecture
- **Frontend**: Pure presentation layer, no business logic
- **Edge Functions**: All business logic, validation, and database operations
- **Database**: Row Level Security (RLS) enforcement, server-side calculations
- **Security**: Authentication, authorization, input validation, audit logging

## 📋 Migration Checklist

### Phase 1: Infrastructure Setup ✅
- [x] Create shared libraries for edge functions
- [x] Set up authentication and authorization helpers
- [x] Create validation schemas with Zod
- [x] Implement standardized response handling
- [x] Database migration for new tables and RLS policies

### Phase 2: Core Edge Functions ✅
- [x] User management edge function
- [x] Financial management edge function
- [x] Frontend API client with TypeScript types
- [x] Updated React hooks for edge function integration

### Phase 3: Component Migration (Next Steps)
- [ ] Migrate UserManagement.tsx component
- [ ] Migrate FinancialTracker.tsx component  
- [ ] Update useAuth.tsx to use edge functions
- [ ] Migrate other components with direct DB access

### Phase 4: Testing & Deployment
- [ ] Deploy edge functions to staging
- [ ] Run integration tests
- [ ] Gradual rollout with feature flags
- [ ] Performance monitoring and optimization

## 🔧 Getting Started

### 1. Apply Database Migration

```bash
# Apply the new migration
supabase db push

# Or apply specific migration
supabase migration up --include-all
```

### 2. Deploy Edge Functions

```bash
# Deploy all edge functions
supabase functions deploy --no-verify-jwt

# Or deploy specific functions
supabase functions deploy user-management --no-verify-jwt
supabase functions deploy financial-management --no-verify-jwt
```

### 3. Environment Variables

Add these environment variables to your Supabase project:

```bash
# In Supabase Dashboard > Settings > Edge Functions
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key # Optional, for email functions
```

### 4. Frontend Integration

Update your main App component to use the new hooks:

```tsx
// Replace the old useAuth with useEdgeAuth
import { EdgeAuthProvider } from '@/hooks/useEdgeAuth';

function App() {
  return (
    <EdgeAuthProvider>
      {/* Your app content */}
    </EdgeAuthProvider>
  );
}
```

## 🔄 Component Migration Guide

### UserManagement.tsx Migration

**Before (Direct DB Access):**
```tsx
// ❌ Direct database operations in component
const { data: profiles, error } = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false });
```

**After (Edge Function):**
```tsx
// ✅ Secure API call through edge function
import { apiClient } from '@/lib/api-client';

const { data: users, isLoading } = useQuery({
  queryKey: ['users', { page, search, role }],
  queryFn: () => apiClient.getUsers({ page, search, role }),
});
```

### FinancialTracker.tsx Migration

**Before (Frontend Calculations):**
```tsx
// ❌ Business logic in frontend
const totalIncome = transactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0);
```

**After (Server Calculations):**
```tsx
// ✅ Server-side calculations through edge function
import { useFinancialSummary } from '@/hooks/useEdgeFinancial';

const { data: summary } = useFinancialSummary({ currency });
const totalIncome = summary?.totals.income || 0;
```

## 🔒 Security Improvements

### Authentication & Authorization
- User tokens validated in edge functions
- Role-based access control with proper checks
- Service role used only for admin operations

### Input Validation
```typescript
// All inputs validated with Zod schemas
const transactionData = await validateBody(req, createTransactionSchema);

// String sanitization to prevent XSS
const sanitizedDescription = sanitizeString(transactionData.description);
```

### Row Level Security
```sql
-- Database policies enforce user access
CREATE POLICY "Users can manage their own transactions" 
ON public.financial_transactions 
FOR ALL 
USING (user_id = auth.uid());
```

### Audit Logging
```sql
-- All sensitive operations are logged
INSERT INTO public.approval_audit(approval_id, actor_id, action, notes)
VALUES (p_approval_id, auth.uid(), 'approved', p_notes);
```

## 🚀 API Reference

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user-management/me` | Get current user profile | Yes |
| PATCH | `/user-management/me` | Update current user profile | Yes |
| GET | `/user-management` | List users (admin) | Admin |
| POST | `/user-management/roles` | Update user roles (admin) | Admin |
| PATCH | `/user-management?userId=uuid` | Admin update user (super admin) | Super Admin |
| DELETE | `/user-management?userId=uuid` | Deactivate user (super admin) | Super Admin |

### Financial Management Endpoints  

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/financial-management/transactions` | Get user transactions | Yes |
| POST | `/financial-management/transactions` | Create transaction | Yes |
| PATCH | `/financial-management/transactions/:id` | Update transaction | Yes |
| DELETE | `/financial-management/transactions/:id` | Delete transaction | Yes |
| GET | `/financial-management/summary` | Get financial summary | Yes |
| POST | `/financial-management/ocr` | Process OCR job | Yes |
| GET | `/financial-management/ocr` | Get OCR jobs | Yes |

### Response Format

All edge functions return standardized JSON responses:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## 🧪 Testing

### Unit Tests for Edge Functions

```typescript
// Test edge function handlers
import { handler } from '../functions/user-management/index.ts';

describe('User Management', () => {
  test('GET /me returns user profile', async () => {
    const request = new Request('http://localhost/user-management/me', {
      headers: { 'Authorization': 'Bearer valid-token' }
    });
    
    const response = await handler(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('email');
  });
});
```

### Integration Tests with Database

```typescript
// Test against real database with RLS
beforeEach(async () => {
  // Set up test data
  await supabase.from('profiles').insert(testUser);
});

afterEach(async () => {
  // Clean up test data  
  await supabase.from('profiles').delete().eq('id', testUser.id);
});
```

### Frontend Component Tests

```typescript
// Test with React Query and API client
import { renderWithProviders } from '@/test-utils';
import { UserManagement } from '@/components/dashboard/UserManagement';

test('renders user list', async () => {
  renderWithProviders(<UserManagement />);
  
  await waitFor(() => {
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### GitHub Actions Workflow

```yaml
# .github/workflows/edge-functions.yml
name: Deploy Edge Functions

on:
  push:
    branches: [main]
    paths: ['supabase/functions/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: supabase/setup-cli@v1
        with:
          version: latest
          
      - name: Deploy functions
        run: supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### Environment-Specific Deployment

```bash
# Deploy to staging
supabase functions deploy --project-ref staging-ref

# Deploy to production  
supabase functions deploy --project-ref prod-ref
```

## 📊 Monitoring & Performance

### Key Metrics to Monitor

1. **Edge Function Performance**
   - Response time (P95 < 500ms)
   - Error rate (< 1%)
   - Cold start frequency

2. **Database Performance**
   - Query execution time
   - Connection pool utilization
   - RLS policy performance

3. **Security Metrics**
   - Authentication success rate
   - Authorization failures
   - Input validation errors

### Logging & Debugging

```typescript
// Structured logging in edge functions
console.log(JSON.stringify({
  level: 'info',
  message: 'Transaction created',
  userId: user.id,
  transactionId: data.id,
  amount: data.amount,
  timestamp: new Date().toISOString(),
}));
```

## 🔄 Rollback Strategy

### Feature Flags

```typescript
// Use feature flags for gradual rollout
const useEdgeFunctions = await getFeatureFlag('use-edge-functions', user.id);

if (useEdgeFunctions) {
  // Use new edge functions
  const data = await apiClient.getTransactions();
} else {
  // Fallback to direct database access
  const { data } = await supabase.from('financial_transactions').select('*');
}
```

### Database Rollback

```sql
-- Rollback migration if needed
-- Keep both old and new structures during transition
-- Remove edge function tables only after full migration
```

## ✅ Success Criteria

The migration is considered successful when:

- [ ] All direct database calls removed from frontend code
- [ ] Business logic moved to secure edge functions  
- [ ] RLS policies enabled and enforced on all tables
- [ ] Input validation implemented for all endpoints
- [ ] Authentication and authorization working correctly
- [ ] Performance improved or maintained
- [ ] Security scan shows no high-severity issues
- [ ] All tests passing in CI/CD pipeline

## 🎯 Next Steps

1. **Deploy Infrastructure**: Apply database migration and deploy edge functions to staging
2. **Update Components**: Migrate UserManagement.tsx and FinancialTracker.tsx
3. **Add Monitoring**: Set up logging and performance monitoring
4. **Security Testing**: Run penetration tests and security scans
5. **Performance Testing**: Load test edge functions under expected traffic
6. **Gradual Rollout**: Use feature flags for safe production deployment
7. **Documentation**: Update API documentation and developer onboarding guides

## 🤝 Support

For questions or issues with the migration:

1. Check the edge function logs in Supabase Dashboard
2. Review database query performance in pgBouncer stats
3. Test API endpoints manually with Postman or curl
4. Run local integration tests with `npm run test:integration`

---

**⚠️ Important Notes:**

- Always test edge functions locally before deployment
- Monitor database connection limits during migration  
- Keep the old code as fallback during initial rollout
- Update environment variables in both staging and production
- Coordinate with team members on timing of breaking changes