package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/llmgateway/backend/internal/store"
)

type Handler struct {
	store *store.Store
}

func NewHandler() *Handler {
	return &Handler{store: store.New()}
}

func (h *Handler) GetDashboard(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Dashboard())
}

func (h *Handler) GetModels(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Models())
}

func (h *Handler) GetAPIKeys(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.APIKeys())
}

type CreateAPIKeyRequest struct {
	Name        string   `json:"name"`
	Permissions []string `json:"permissions"`
	ExpiresAt   string   `json:"expiresAt"`
}

func (h *Handler) CreateAPIKey(w http.ResponseWriter, r *http.Request) {
	var req CreateAPIKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	if req.Name == "" {
		http.Error(w, `{"error":"name is required"}`, http.StatusBadRequest)
		return
	}
	if req.ExpiresAt == "" {
		req.ExpiresAt = "2026-12-31"
	}
	key := h.store.CreateAPIKey(req.Name, req.Permissions, req.ExpiresAt)
	writeJSON(w, key)
}

func (h *Handler) DeleteAPIKey(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api-keys/")
	if id == "" {
		http.Error(w, `{"error":"key ID required"}`, http.StatusBadRequest)
		return
	}
	if h.store.DeleteAPIKey(id) {
		writeJSON(w, map[string]string{"status": "deleted"})
	} else {
		http.Error(w, `{"error":"key not found"}`, http.StatusNotFound)
	}
}

func (h *Handler) GetProviders(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Providers())
}

type UpdateProviderRequest struct {
	Enabled *bool `json:"enabled"`
	Weight  *int  `json:"weight"`
}

func (h *Handler) UpdateProvider(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/providers/")
	if id == "" {
		http.Error(w, `{"error":"provider ID required"}`, http.StatusBadRequest)
		return
	}
	var req UpdateProviderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	provider, ok := h.store.UpdateProvider(id, req.Enabled, req.Weight)
	if !ok {
		http.Error(w, `{"error":"provider not found"}`, http.StatusNotFound)
		return
	}
	writeJSON(w, provider)
}

type AddProviderRequest struct {
	Name    string   `json:"name"`
	Logo    string   `json:"logo"`
	Models  []string `json:"models"`
	Weight  int      `json:"weight"`
}

func (h *Handler) AddProvider(w http.ResponseWriter, r *http.Request) {
	var req AddProviderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	if req.Name == "" {
		http.Error(w, `{"error":"name is required"}`, http.StatusBadRequest)
		return
	}
	provider := h.store.AddProvider(req.Name, req.Logo, req.Models, req.Weight)
	writeJSON(w, provider)
}

func (h *Handler) GetRoutes(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.RouteConfig())
}

type UpdateRouteConfigRequest struct {
	Timeout         int      `json:"timeout"`
	MaxRetries      int      `json:"maxRetries"`
	RetryInterval   int      `json:"retryInterval"`
	Strategy        string   `json:"strategy"`
	RetryConditions []string `json:"retryConditions"`
}

func (h *Handler) UpdateRoutes(w http.ResponseWriter, r *http.Request) {
	var req UpdateRouteConfigRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	config := h.store.UpdateRouteConfig(req.Timeout, req.MaxRetries, req.RetryInterval, req.Strategy, req.RetryConditions)
	writeJSON(w, config)
}

func (h *Handler) GetLogs(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Logs())
}

func (h *Handler) GetAnalytics(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Analytics())
}

func (h *Handler) GetSettings(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.GetSettings())
}

type SettingsRequest struct {
	GatewayName    string `json:"gatewayName"`
	Environment    string `json:"environment"`
	GlobalRPM      int    `json:"globalRPM"`
	PerKeyRPM      int    `json:"perKeyRPM"`
	LogRequests    bool   `json:"logRequests"`
	LogResponses   bool   `json:"logResponses"`
	SanitizeFields bool   `json:"sanitizeFields"`
}

func (h *Handler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	var req SettingsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}
	settings := store.Settings{
		GatewayName:    req.GatewayName,
		Environment:    req.Environment,
		GlobalRPM:      req.GlobalRPM,
		PerKeyRPM:      req.PerKeyRPM,
		LogRequests:    req.LogRequests,
		LogResponses:   req.LogResponses,
		SanitizeFields: req.SanitizeFields,
	}
	result := h.store.UpdateSettings(settings)
	writeJSON(w, result)
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}
