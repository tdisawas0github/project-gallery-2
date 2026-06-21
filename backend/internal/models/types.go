package models

type VolumePoint struct {
	Time     string `json:"time"`
	Requests int    `json:"requests"`
}

type DashboardMetrics struct {
	TotalRequests       string        `json:"totalRequests"`
	TotalRequestsChange float64       `json:"totalRequestsChange"`
	AvgLatency          string        `json:"avgLatency"`
	AvgLatencyChange    float64       `json:"avgLatencyChange"`
	SuccessRate         string        `json:"successRate"`
	SuccessRateChange   float64       `json:"successRateChange"`
	CostToday           string        `json:"costToday"`
	CostTodayChange     float64       `json:"costTodayChange"`
	RequestVolume       []VolumePoint `json:"requestVolume"`
	Environment         string        `json:"environment"`
	Version             string        `json:"version"`
}

type Pricing struct {
	Input  float64 `json:"input"`
	Output float64 `json:"output"`
}

type Model struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Provider      string   `json:"provider"`
	Capabilities  []string `json:"capabilities"`
	Status        string   `json:"status"`
	ContextWindow int      `json:"contextWindow"`
	Pricing       Pricing  `json:"pricing"`
}

type APIKey struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Key         string   `json:"key"`
	Permissions []string `json:"permissions"`
	ExpiresAt   string   `json:"expiresAt"`
	CreatedAt   string   `json:"createdAt"`
	LastUsed    string   `json:"lastUsed"`
	Status      string   `json:"status"`
}

type Provider struct {
	ID      string   `json:"id"`
	Name    string   `json:"name"`
	Logo    string   `json:"logo"`
	Status  string   `json:"status"`
	Models  []string `json:"models"`
	Latency int      `json:"latency"`
	Enabled bool     `json:"enabled"`
	Weight  int      `json:"weight"`
}

type RouteConfig struct {
	Strategy        string     `json:"strategy"`
	SessionAffinity string     `json:"sessionAffinity"`
	HealthChecks    bool       `json:"healthChecks"`
	Providers       []Provider `json:"providers"`
	FallbackChain   []string   `json:"fallbackChain"`
	Timeout         int        `json:"timeout"`
	MaxRetries      int        `json:"maxRetries"`
	RetryInterval   int        `json:"retryInterval"`
	RetryConditions []string   `json:"retryConditions"`
}

type LogEntry struct {
	ID          string `json:"id"`
	Timestamp   string `json:"timestamp"`
	Model       string `json:"model"`
	Provider    string `json:"provider"`
	TokensIn    int    `json:"tokensIn"`
	TokensOut   int    `json:"tokensOut"`
	Latency     int    `json:"latency"`
	StatusCode  int    `json:"statusCode"`
	Method      string `json:"method"`
	Path        string `json:"path"`
	APIKey      string `json:"apiKey"`
	Application string `json:"application"`
	IP          string `json:"ip"`
}

type NamedValue struct {
	Name  string `json:"name"`
	Value int    `json:"value"`
}

type ColoredValue struct {
	Name  string `json:"name"`
	Value int    `json:"value"`
	Color string `json:"color"`
}

type CostEntry struct {
	Name string  `json:"name"`
	Cost float64 `json:"cost"`
}

type AnalyticsData struct {
	RequestsByModel []NamedValue   `json:"requestsByModel"`
	ErrorsByType    []ColoredValue `json:"errorsByType"`
	CostByModel     []CostEntry    `json:"costByModel"`
}