package store

import "github.com/llmgateway/backend/internal/models"

type Store struct{}

func New() *Store {
	return &Store{}
}

func (s *Store) Dashboard() models.DashboardMetrics {
	return models.DashboardMetrics{
		TotalRequests:       "2.4M",
		TotalRequestsChange: 12.5,
		AvgLatency:          "142ms",
		AvgLatencyChange:    -8.5,
		SuccessRate:         "99.7%",
		SuccessRateChange:   2.1,
		CostToday:           "$847",
		CostTodayChange:     5.3,
		Environment:         "Production",
		Version:             "v2.4.1",
		RequestVolume: []models.VolumePoint{
			{Time: "00:00", Requests: 380000},
			{Time: "02:00", Requests: 320000},
			{Time: "04:00", Requests: 280000},
			{Time: "06:00", Requests: 250000},
			{Time: "08:00", Requests: 310000},
			{Time: "10:00", Requests: 290000},
			{Time: "12:00", Requests: 220000},
			{Time: "14:00", Requests: 180000},
			{Time: "16:00", Requests: 150000},
			{Time: "18:00", Requests: 120000},
			{Time: "20:00", Requests: 90000},
			{Time: "22:00", Requests: 60000},
			{Time: "24:00", Requests: 40000},
		},
	}
}

func (s *Store) Models() []models.Model {
	return []models.Model{
		{ID: "gpt-4o", Name: "GPT-4o", Provider: "OpenAI", Capabilities: []string{"chat", "vision", "function-calling"}, Status: "active", ContextWindow: 128000, Pricing: models.Pricing{Input: 2.5, Output: 10.0}},
		{ID: "claude-3-5-sonnet", Name: "Claude 3.5 Sonnet", Provider: "Anthropic", Capabilities: []string{"chat", "vision", "function-calling"}, Status: "active", ContextWindow: 200000, Pricing: models.Pricing{Input: 3.0, Output: 15.0}},
		{ID: "grok-beta", Name: "Grok Beta", Provider: "xAI", Capabilities: []string{"chat", "function-calling"}, Status: "active", ContextWindow: 131072, Pricing: models.Pricing{Input: 5.0, Output: 15.0}},
		{ID: "mistral-large", Name: "Mistral Large", Provider: "Mistral", Capabilities: []string{"chat", "function-calling"}, Status: "active", ContextWindow: 128000, Pricing: models.Pricing{Input: 2.0, Output: 6.0}},
		{ID: "gemini-1.5-pro", Name: "Gemini 1.5 Pro", Provider: "Google", Capabilities: []string{"chat", "vision", "function-calling"}, Status: "active", ContextWindow: 1000000, Pricing: models.Pricing{Input: 1.25, Output: 5.0}},
	}
}

func (s *Store) APIKeys() []models.APIKey {
	return []models.APIKey{
		{ID: "key_1", Name: "Production Server Key", Key: "ak_live_7dj3k8f2a9b1c4e6d8f0a2b4c6e8f0a8f7", Permissions: []string{"read", "write"}, ExpiresAt: "2026-09-21", CreatedAt: "2026-03-15", LastUsed: "2 minutes ago", Status: "active"},
		{ID: "key_2", Name: "Staging Environment", Key: "ak_test_3hj5k9m2n4p6q8r0s2t4v6x8z0b2d4f6", Permissions: []string{"read", "write"}, ExpiresAt: "2026-06-30", CreatedAt: "2026-01-10", LastUsed: "1 hour ago", Status: "active"},
		{ID: "key_3", Name: "Analytics Read-Only", Key: "ak_live_9xk2m5n8p1q4r7s0t3v6w9y2z5a8c1e4", Permissions: []string{"read"}, ExpiresAt: "2026-12-31", CreatedAt: "2026-02-20", LastUsed: "5 minutes ago", Status: "active"},
	}
}

func (s *Store) Providers() []models.Provider {
	return []models.Provider{
		{ID: "openai", Name: "OpenAI GPT-4o", Logo: "openai", Status: "healthy", Models: []string{"gpt-4o"}, Latency: 842, Enabled: true, Weight: 40},
		{ID: "anthropic", Name: "Anthropic Claude", Logo: "anthropic", Status: "healthy", Models: []string{"claude-3-5-sonnet-20240620"}, Latency: 923, Enabled: true, Weight: 35},
		{ID: "xai", Name: "xAI Grok", Logo: "xai", Status: "healthy", Models: []string{"grok-beta"}, Latency: 1105, Enabled: true, Weight: 25},
	}
}

func (s *Store) RouteConfig() models.RouteConfig {
	return models.RouteConfig{
		Strategy:        "Weighted Round Robin",
		SessionAffinity: "None",
		HealthChecks:    true,
		Providers:       s.Providers(),
		FallbackChain:   []string{"OpenAI GPT-4o", "Anthropic Claude", "xAI Grok"},
		Timeout:         30,
		MaxRetries:      2,
		RetryInterval:   500,
		RetryConditions: []string{"5xx", "Timeout"},
	}
}

func (s *Store) Logs() []models.LogEntry {
	return []models.LogEntry{
		{ID: "req_8f3c2b1e-7d4a-4b2c-9e6f-1a2b4c5d6e7f", Timestamp: "2026-06-21 14:32:18.456", Model: "gpt-4o", Provider: "OpenAI", TokensIn: 1024, TokensOut: 512, Latency: 1234, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_live_7dj3k...a8f7", Application: "Acme Dashboard", IP: "203.0.113.42"},
		{ID: "req_2a4b6c8d-1e3f-5a7b-9c0d-2e4f6a8b0c2d", Timestamp: "2026-06-21 14:31:45.123", Model: "claude-3-5-sonnet", Provider: "Anthropic", TokensIn: 856, TokensOut: 423, Latency: 987, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_live_7dj3k...a8f7", Application: "Acme Dashboard", IP: "203.0.113.42"},
		{ID: "req_5c7d9e1f-3a5b-7c9d-1e3f-5a7b9c1d3e5f", Timestamp: "2026-06-21 14:30:12.789", Model: "mistral-large", Provider: "Mistral", TokensIn: 512, TokensOut: 256, Latency: 654, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_test_3hj5...d4f6", Application: "Internal Tools", IP: "198.51.100.15"},
	}
}

func (s *Store) Analytics() models.AnalyticsData {
	return models.AnalyticsData{
		RequestsByModel: []models.NamedValue{
			{Name: "GPT-4o", Value: 42},
			{Name: "Claude 3.5", Value: 28},
			{Name: "Grok Beta", Value: 15},
			{Name: "Mistral", Value: 10},
			{Name: "Other", Value: 5},
		},
		ErrorsByType: []models.ColoredValue{
			{Name: "4xx", Value: 42, Color: "#3b82f6"},
			{Name: "5xx", Value: 26, Color: "#ef4444"},
			{Name: "Network", Value: 20, Color: "#7c3aed"},
			{Name: "Other", Value: 12, Color: "#6b7280"},
		},
		CostByModel: []models.CostEntry{
			{Name: "GPT-4o", Cost: 342},
			{Name: "Claude 3.5", Cost: 256},
			{Name: "Grok Beta", Cost: 128},
			{Name: "Mistral", Cost: 64},
			{Name: "Gemini", Cost: 57},
		},
	}
}