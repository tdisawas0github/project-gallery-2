package store

import (
	"fmt"
	"math/rand"
	"strings"
	"sync"
	"time"

	"github.com/llmgateway/backend/internal/models"
)

type Store struct {
	mu       sync.RWMutex
	apiKeys  []models.APIKey
	providers []models.Provider
	routes   models.RouteConfig
	settings Settings
	logs     []models.LogEntry
}

type Settings struct {
	GatewayName     string `json:"gatewayName"`
	Environment     string `json:"environment"`
	GlobalRPM       int    `json:"globalRPM"`
	PerKeyRPM       int    `json:"perKeyRPM"`
	LogRequests     bool   `json:"logRequests"`
	LogResponses    bool   `json:"logResponses"`
	SanitizeFields  bool   `json:"sanitizeFields"`
}

func New() *Store {
	s := &Store{}
	s.initData()
	return s
}

func (s *Store) initData() {
	s.apiKeys = []models.APIKey{
		{ID: "key_1", Name: "Production Server Key", Key: "ak_live_7dj3k8f2a9b1c4e6d8f0a2b4c6e8f0a8f7", Permissions: []string{"read", "write"}, ExpiresAt: "2026-09-21", CreatedAt: "2026-03-15", LastUsed: "2 minutes ago", Status: "active"},
		{ID: "key_2", Name: "Staging Environment", Key: "ak_test_3hj5k9m2n4p6q8r0s2t4v6x8z0b2d4f6", Permissions: []string{"read", "write"}, ExpiresAt: "2026-06-30", CreatedAt: "2026-01-10", LastUsed: "1 hour ago", Status: "active"},
		{ID: "key_3", Name: "Analytics Read-Only", Key: "ak_live_9xk2m5n8p1q4r7s0t3v6w9y2z5a8c1e4", Permissions: []string{"read"}, ExpiresAt: "2026-12-31", CreatedAt: "2026-02-20", LastUsed: "5 minutes ago", Status: "active"},
	}

	s.providers = []models.Provider{
		{ID: "openai", Name: "OpenAI GPT-4o", Logo: "openai", Status: "healthy", Models: []string{"gpt-4o"}, Latency: 842, Enabled: true, Weight: 40},
		{ID: "anthropic", Name: "Anthropic Claude", Logo: "anthropic", Status: "healthy", Models: []string{"claude-3-5-sonnet-20240620"}, Latency: 923, Enabled: true, Weight: 35},
		{ID: "xai", Name: "xAI Grok", Logo: "xai", Status: "healthy", Models: []string{"grok-beta"}, Latency: 1105, Enabled: true, Weight: 25},
	}

	s.routes = models.RouteConfig{
		Strategy:        "Weighted Round Robin",
		SessionAffinity: "None",
		HealthChecks:    true,
		Providers:       s.providers,
		FallbackChain:   []string{"OpenAI GPT-4o", "Anthropic Claude", "xAI Grok"},
		Timeout:         30,
		MaxRetries:      2,
		RetryInterval:   500,
		RetryConditions: []string{"5xx", "Timeout"},
	}

	s.settings = Settings{
		GatewayName:    "LLM Gateway Pro",
		Environment:    "Production",
		GlobalRPM:      10000,
		PerKeyRPM:      1000,
		LogRequests:    true,
		LogResponses:   true,
		SanitizeFields: false,
	}

	s.logs = []models.LogEntry{
		{ID: "req_8f3c2b1e-7d4a-4b2c-9e6f-1a2b4c5d6e7f", Timestamp: time.Now().Add(-2 * time.Minute).Format("2006-01-02 15:04:05.000"), Model: "gpt-4o", Provider: "OpenAI", TokensIn: 1024, TokensOut: 512, Latency: 1234, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_live_7dj3k...a8f7", Application: "Acme Dashboard", IP: "203.0.113.42"},
		{ID: "req_2a4b6c8d-1e3f-5a7b-9c0d-2e4f6a8b0c2d", Timestamp: time.Now().Add(-5 * time.Minute).Format("2006-01-02 15:04:05.000"), Model: "claude-3-5-sonnet", Provider: "Anthropic", TokensIn: 856, TokensOut: 423, Latency: 987, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_live_7dj3k...a8f7", Application: "Acme Dashboard", IP: "203.0.113.42"},
		{ID: "req_5c7d9e1f-3a5b-7c9d-1e3f-5a7b9c1d3e5f", Timestamp: time.Now().Add(-8 * time.Minute).Format("2006-01-02 15:04:05.000"), Model: "mistral-large", Provider: "Mistral", TokensIn: 512, TokensOut: 256, Latency: 654, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_test_3hj5...d4f6", Application: "Internal Tools", IP: "198.51.100.15"},
		{ID: "req_8e0f2a4b-6c8d-0e2f-4a6b-8c0d2e4f6a8b", Timestamp: time.Now().Add(-12 * time.Minute).Format("2006-01-02 15:04:05.000"), Model: "gemini-1.5-pro", Provider: "Google", TokensIn: 2048, TokensOut: 1024, Latency: 1567, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_live_9xk2...c1e4", Application: "Research Bot", IP: "192.0.2.42"},
		{ID: "req_1b3d5f7a-9c1e-3b5d-7f9a-1c3e5g7i9k1m", Timestamp: time.Now().Add(-15 * time.Minute).Format("2006-01-02 15:04:05.000"), Model: "grok-beta", Provider: "xAI", TokensIn: 768, TokensOut: 384, Latency: 1105, StatusCode: 200, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_live_7dj3k...a8f7", Application: "Acme Dashboard", IP: "203.0.113.42"},
		{ID: "req_4e6g8i0k-2d4f-6h8j-0l2n-4p6r8t0v2x4z", Timestamp: time.Now().Add(-20 * time.Minute).Format("2006-01-02 15:04:05.000"), Model: "gpt-4o", Provider: "OpenAI", TokensIn: 1536, TokensOut: 768, Latency: 2345, StatusCode: 429, Method: "POST", Path: "/v1/chat/completions", APIKey: "ak_test_3hj5...d4f6", Application: "Load Test", IP: "198.51.100.15"},
	}
}

func generateID() string {
	return fmt.Sprintf("key_%s", randomString(12))
}

func generateReqID() string {
	return fmt.Sprintf("req_%s", randomString(24))
}

func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func randomAPIKey() string {
	return fmt.Sprintf("ak_live_%s", randomString(24))
}

func (s *Store) Dashboard() models.DashboardMetrics {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return models.DashboardMetrics{
		TotalRequests:       "2.4M",
		TotalRequestsChange: 12.5,
		AvgLatency:          "142ms",
		AvgLatencyChange:    -8.5,
		SuccessRate:         "99.7%",
		SuccessRateChange:   2.1,
		CostToday:           "$847",
		CostTodayChange:     5.3,
		Environment:         s.settings.Environment,
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
	s.mu.RLock()
	defer s.mu.RUnlock()
	return []models.Model{
		{ID: "gpt-4o", Name: "GPT-4o", Provider: "OpenAI", Capabilities: []string{"chat", "vision", "function-calling"}, Status: "active", ContextWindow: 128000, Pricing: models.Pricing{Input: 2.5, Output: 10.0}},
		{ID: "claude-3-5-sonnet", Name: "Claude 3.5 Sonnet", Provider: "Anthropic", Capabilities: []string{"chat", "vision", "function-calling"}, Status: "active", ContextWindow: 200000, Pricing: models.Pricing{Input: 3.0, Output: 15.0}},
		{ID: "grok-beta", Name: "Grok Beta", Provider: "xAI", Capabilities: []string{"chat", "function-calling"}, Status: "active", ContextWindow: 131072, Pricing: models.Pricing{Input: 5.0, Output: 15.0}},
		{ID: "mistral-large", Name: "Mistral Large", Provider: "Mistral", Capabilities: []string{"chat", "function-calling"}, Status: "active", ContextWindow: 128000, Pricing: models.Pricing{Input: 2.0, Output: 6.0}},
		{ID: "gemini-1.5-pro", Name: "Gemini 1.5 Pro", Provider: "Google", Capabilities: []string{"chat", "vision", "function-calling"}, Status: "active", ContextWindow: 1000000, Pricing: models.Pricing{Input: 1.25, Output: 5.0}},
	}
}

func (s *Store) APIKeys() []models.APIKey {
	s.mu.RLock()
	defer s.mu.RUnlock()
	result := make([]models.APIKey, len(s.apiKeys))
	copy(result, s.apiKeys)
	return result
}

func (s *Store) CreateAPIKey(name string, permissions []string, expiresAt string) models.APIKey {
	s.mu.Lock()
	defer s.mu.Unlock()
	key := models.APIKey{
		ID:          generateID(),
		Name:        name,
		Key:         randomAPIKey(),
		Permissions: permissions,
		ExpiresAt:   expiresAt,
		CreatedAt:   time.Now().Format("2006-01-02"),
		LastUsed:    "Never",
		Status:      "active",
	}
	s.apiKeys = append(s.apiKeys, key)
	return key
}

func (s *Store) DeleteAPIKey(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i, k := range s.apiKeys {
		if k.ID == id {
			s.apiKeys = append(s.apiKeys[:i], s.apiKeys[i+1:]...)
			return true
		}
	}
	return false
}

func (s *Store) Providers() []models.Provider {
	s.mu.RLock()
	defer s.mu.RUnlock()
	result := make([]models.Provider, len(s.providers))
	copy(result, s.providers)
	return result
}

func (s *Store) UpdateProvider(id string, enabled *bool, weight *int) (*models.Provider, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i, p := range s.providers {
		if p.ID == id {
			if enabled != nil {
				s.providers[i].Enabled = *enabled
			}
			if weight != nil {
				s.providers[i].Weight = *weight
			}
			return &s.providers[i], true
		}
	}
	return nil, false
}

func (s *Store) AddProvider(name, logo string, models []string, weight int) models.Provider {
	s.mu.Lock()
	defer s.mu.Unlock()
	provider := models.Provider{
		ID:      strings.ToLower(strings.ReplaceAll(name, " ", "-")),
		Name:    name,
		Logo:    logo,
		Status:  "healthy",
		Models:  models,
		Latency: 800 + rand.Intn(500),
		Enabled: true,
		Weight:  weight,
	}
	s.providers = append(s.providers, provider)
	return provider
}

func (s *Store) RouteConfig() models.RouteConfig {
	s.mu.RLock()
	defer s.mu.RUnlock()
	providers := make([]models.Provider, len(s.providers))
	copy(providers, s.providers)
	return models.RouteConfig{
		Strategy:        s.routes.Strategy,
		SessionAffinity: s.routes.SessionAffinity,
		HealthChecks:    s.routes.HealthChecks,
		Providers:       providers,
		FallbackChain:   s.routes.FallbackChain,
		Timeout:         s.routes.Timeout,
		MaxRetries:      s.routes.MaxRetries,
		RetryInterval:   s.routes.RetryInterval,
		RetryConditions: s.routes.RetryConditions,
	}
}

func (s *Store) UpdateRouteConfig(timeout, maxRetries, retryInterval int, strategy string, retryConditions []string) models.RouteConfig {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.routes.Timeout = timeout
	s.routes.MaxRetries = maxRetries
	s.routes.RetryInterval = retryInterval
	if strategy != "" {
		s.routes.Strategy = strategy
	}
	s.routes.RetryConditions = retryConditions
	return s.RouteConfig()
}

func (s *Store) Logs() []models.LogEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()
	result := make([]models.LogEntry, len(s.logs))
	copy(result, s.logs)
	return result
}

func (s *Store) Analytics() models.AnalyticsData {
	s.mu.RLock()
	defer s.mu.RUnlock()
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

func (s *Store) GetSettings() Settings {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.settings
}

func (s *Store) UpdateSettings(settings Settings) Settings {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.settings = settings
	return s.settings
}
