package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/llmgateway/backend/internal/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(corsMiddleware)

	h := api.NewHandler()

	registerRoutes := func(r chi.Router) {
		r.Get("/dashboard", h.GetDashboard)
		r.Get("/models", h.GetModels)
		r.Get("/api-keys", h.GetAPIKeys)
		r.Get("/providers", h.GetProviders)
		r.Get("/routes", h.GetRoutes)
		r.Get("/logs", h.GetLogs)
		r.Get("/analytics", h.GetAnalytics)
		r.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
			writeJSON(w, map[string]string{"status": "ok"})
		})
	}

	// /api/* for local dev and direct access; /* for App Platform (strips /api prefix)
	r.Route("/api", registerRoutes)
	registerRoutes(r)

	log.Printf("LLM Gateway Admin API listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}