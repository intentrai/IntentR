// UbeCode — Copyright © 2025 James Reynolds
//
// This file is part of UbeCode.
// You may use this file under either:
//   • The AGPLv3 Open Source License, OR
//   • The UbeCode Commercial License
// See the LICENSE.AGPL and LICENSE.COMMERCIAL files for details.

package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/jareynolds/ubecode/pkg/container"
)

func main() {
	// Create the main orchestrator
	orchestrator := container.NewOrchestrator()

	// TODO: Register containers here as they are implemented
	// Example:
	// orchestrator.Register(newExampleContainer())

	// Set up context with cancellation
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Set up signal handling for graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// Start all containers
	fmt.Println("Starting UbeCode orchestrator...")
	if err := orchestrator.Start(ctx); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to start orchestrator: %v
", err)
		os.Exit(1)
	}

	fmt.Println("All containers started successfully")

	// Print status
	for _, info := range orchestrator.Status() {
		fmt.Printf("  - %s
", info)
	}

	// Wait for shutdown signal
	fmt.Println("
Press Ctrl+C to stop...")
	<-sigChan

	// Graceful shutdown
	fmt.Println("
Shutting down orchestrator...")
	if err := orchestrator.Stop(ctx); err != nil {
		fmt.Fprintf(os.Stderr, "Error during shutdown: %v
", err)
		os.Exit(1)
	}

	fmt.Println("Shutdown complete")
}
