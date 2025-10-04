import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { strategyClient } from '../strategy-client';
import type { BusinessInput, StrategyInput, Milestone } from '../strategy-client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
}));

describe('StrategyClient', () => {
  const mockBusinessData: BusinessInput = {
    user_id: 'user-123',
    name: 'Test Business',
    business_type: 'retail',
    stage: 'growth',
    description: 'Test business description',
    registration_number: '123456789',
    registration_certificate_url: 'https://example.com/certificate.pdf',
  };

  const mockStrategyData: Omit<StrategyInput, 'id' | 'created_at' | 'updated_at'> = {
    user_id: 'user-123',
    business_name: 'Test Business',
    business_stage: 'growth',
    vision: 'Test vision',
    mission: 'Test mission',
    target_market: 'Test target market',
    revenue_model: 'Test revenue model',
    value_proposition: 'Test value proposition',
    key_partners: 'Test key partners',
    marketing_approach: 'Test marketing approach',
    operational_needs: 'Test operational needs',
    growth_goals: 'Test growth goals',
  };

  const mockMilestones: Array<Omit<Milestone, 'id' | 'created_at' | 'updated_at'>> = [
    {
      title: 'First Milestone',
      description: 'Complete business registration',
      status: 'pending',
      milestone_type: 'business_registration',
      target_date: '2025-12-31',
      business_id: 'business-123',
      strategy_id: 'strategy-123',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveStrategyWithBusinessAndMilestones', () => {
    it('should create a new strategy with business and milestones', async () => {
      // Mock the RPC response
      const mockResponse = {
        strategy: {
          id: 'strategy-123',
          ...mockStrategyData,
          business_id: 'business-123',
          created_at: '2025-10-03T00:00:00Z',
          updated_at: '2025-10-03T00:00:00Z',
        },
        business: {
          id: 'business-123',
          ...mockBusinessData,
          created_at: '2025-10-03T00:00:00Z',
          updated_at: '2025-10-03T00:00:00Z',
        },
        milestones: [
          {
            id: 'milestone-123',
            ...mockMilestones[0],
            created_at: '2025-10-03T00:00:00Z',
            updated_at: '2025-10-03T00:00:00Z',
          },
        ],
      };

      // Mock the RPC call
      (supabase.rpc as any).mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      // Call the method
      const result = await strategyClient.saveStrategyWithBusinessAndMilestones(
        mockStrategyData,
        mockBusinessData,
        mockMilestones
      );

      // Verify the RPC call
      expect(supabase.rpc).toHaveBeenCalledWith(
        'create_or_update_strategy_with_business',
        {
          strategy_data: {
            ...mockStrategyData,
            business_id: undefined, // Should be undefined when creating new business
          },
          business_data: mockBusinessData,
          milestones_data: mockMilestones.map(m => ({
            ...m,
            business_id: m.business_id || mockStrategyData.business_id,
          })),
        }
      );

      // Verify the result
      expect(result).toEqual({
        strategy: mockResponse.strategy,
        business: mockResponse.business,
        milestones: mockResponse.milestones,
      });
    });

    it('should update an existing strategy with business and milestones', async () => {
      const updatedBusinessData = {
        ...mockBusinessData,
        id: 'business-123',
        name: 'Updated Business Name',
      };

      const updatedStrategyData = {
        ...mockStrategyData,
        business_name: 'Updated Business Name',
      };

      // Mock the RPC response
      const mockResponse = {
        strategy: {
          id: 'strategy-123',
          ...updatedStrategyData,
          business_id: 'business-123',
          created_at: '2025-10-03T00:00:00Z',
          updated_at: '2025-10-04T00:00:00Z',
        },
        business: {
          id: 'business-123',
          ...updatedBusinessData,
          created_at: '2025-10-03T00:00:00Z',
          updated_at: '2025-10-04T00:00:00Z',
        },
        milestones: [
          {
            id: 'milestone-123',
            ...mockMilestones[0],
            created_at: '2025-10-03T00:00:00Z',
            updated_at: '2025-10-04T00:00:00Z',
          },
        ],
      };

      // Mock the RPC call
      (supabase.rpc as any).mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      // Call the method with an existing business ID
      const result = await strategyClient.saveStrategyWithBusinessAndMilestones(
        { ...updatedStrategyData, business_id: 'business-123' },
        updatedBusinessData,
        mockMilestones
      );

      // Verify the RPC call
      expect(supabase.rpc).toHaveBeenCalledWith(
        'create_or_update_strategy_with_business',
        {
          strategy_data: {
            ...updatedStrategyData,
            business_id: 'business-123',
          },
          business_data: updatedBusinessData,
          milestones_data: mockMilestones.map(m => ({
            ...m,
            business_id: m.business_id || 'business-123',
          })),
        }
      );

      // Verify the result
      expect(result).toEqual({
        strategy: mockResponse.strategy,
        business: mockResponse.business,
        milestones: mockResponse.milestones,
      });
    });

    it('should handle errors from the database', async () => {
      // Mock an error response
      const errorMessage = 'Database error';
      (supabase.rpc as any).mockResolvedValueOnce({
        data: null,
        error: { message: errorMessage },
      });

      // Expect the method to throw an error
      await expect(
        strategyClient.saveStrategyWithBusinessAndMilestones(
          mockStrategyData,
          mockBusinessData,
          mockMilestones
        )
      ).rejects.toThrow(errorMessage);
    });
  });
});
