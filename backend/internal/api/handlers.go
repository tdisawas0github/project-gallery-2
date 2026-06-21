package api

import (
	"encoding/json"
	"net/http"

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

func (h *Handler) GetProviders(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Providers())
}

func (h *Handler) GetRoutes(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.RouteConfig())
}

func (h *Handler) GetLogs(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Logs())
}

func (h *Handler) GetAnalytics(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, h.store.Analytics())
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}