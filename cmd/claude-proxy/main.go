// UbeCode — Copyright © 2025 James Reynolds
//
// Claude CLI Proxy Service
// This service runs on the host machine (outside Docker) and executes
// Claude CLI commands on behalf of the Docker container.

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

const defaultPort = "9085"

// Request represents an incoming CLI execution request
type Request struct {
	WorkspacePath    string `json:"workspacePath"`
	Command          string `json:"command"`
	AdditionalPrompt string `json:"additionalPrompt,omitempty"`
}

// Response represents the CLI execution response
type Response struct {
	Response string `json:"response,omitempty"`
	Error    string `json:"error,omitempty"`
}

func main() {
	port := os.Getenv("CLAUDE_PROXY_PORT")
	if port == "" {
		port = defaultPort
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/execute", corsMiddleware(handleExecute))
	mux.HandleFunc("/health", corsMiddleware(handleHealth))

	// Handle OPTIONS for CORS preflight
	mux.HandleFunc("OPTIONS /execute", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	addr := ":" + port
	log.Printf("Claude CLI Proxy starting on %s", addr)
	log.Printf("This service must run on the host machine (not in Docker)")
	log.Printf("It executes Claude CLI commands on behalf of Docker containers")

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		next(w, r)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	// Check if claude CLI is available
	claudePath, err := findClaudeCLI()
	if err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(Response{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":     "healthy",
		"claudePath": claudePath,
	})
}

func handleExecute(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{Error: "Invalid request body: " + err.Error()})
		return
	}

	// Validate workspace path
	workspacePath := req.WorkspacePath
	if workspacePath == "" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{Error: "No workspace path provided"})
		return
	}

	// Make path absolute if needed
	if !filepath.IsAbs(workspacePath) {
		cwd, _ := os.Getwd()
		workspacePath = filepath.Join(cwd, workspacePath)
	}

	// Verify workspace exists
	info, err := os.Stat(workspacePath)
	if err != nil || !info.IsDir() {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{Error: fmt.Sprintf("Workspace folder not found: %s", workspacePath)})
		return
	}

	// Build the full prompt
	fullPrompt := req.Command
	if req.AdditionalPrompt != "" {
		fullPrompt += "\n\n## ADDITIONAL INSTRUCTIONS\n\n" + req.AdditionalPrompt
	}

	// Find claude CLI
	claudePath, err := findClaudeCLI()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{Error: err.Error()})
		return
	}

	// Execute claude CLI with --dangerously-skip-permissions for automation
	// This allows Claude to write files without interactive permission prompts
	log.Printf("Executing Claude CLI in directory: %s", workspacePath)
	log.Printf("Command: %s -p --dangerously-skip-permissions <prompt of %d chars>", claudePath, len(fullPrompt))

	cmd := exec.Command(claudePath, "-p", "--dangerously-skip-permissions", fullPrompt)
	cmd.Dir = workspacePath

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		errOutput := stderr.String()
		if errOutput == "" {
			errOutput = err.Error()
		}
		log.Printf("Claude CLI error: %s", errOutput)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{Error: fmt.Sprintf("Claude CLI error: %s", errOutput)})
		return
	}

	response := stdout.String()
	if response == "" {
		response = "Claude CLI completed but returned no output."
	}

	log.Printf("Claude CLI completed successfully, response length: %d chars", len(response))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Response: response})
}

// findClaudeCLI locates the claude CLI executable
func findClaudeCLI() (string, error) {
	// Check common locations
	locations := []string{
		"/opt/homebrew/bin/claude",  // Apple Silicon Mac (Homebrew)
		"/usr/local/bin/claude",     // Intel Mac / Linux (Homebrew)
		"/usr/bin/claude",           // System-wide Linux
	}

	// First try PATH
	if path, err := exec.LookPath("claude"); err == nil {
		return path, nil
	}

	// Then try common locations
	for _, loc := range locations {
		if _, err := os.Stat(loc); err == nil {
			return loc, nil
		}
	}

	return "", fmt.Errorf("claude CLI not found in PATH or common locations. Please install it: npm install -g @anthropic-ai/claude-code")
}
